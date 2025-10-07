"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";
import { createId } from "@paralleldrive/cuid2";
import { AuthError } from "@supabase/supabase-js";
import { Collection } from "@/types/CollectionTypes";

/** 
 * Props for CollectionDialog component.
 */
type CollectionDialogProps = {
  /** Whether the dialog is open */
  open: boolean;

  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void;

  /** Optional collection object for editing; if null, dialog is for creating a new collection */
  collection?: Collection | null;
};

/**
 * CollectionDialog allows creating a new collection or editing an existing one.
 * Handles authentication, validation, and Supabase mutations for saving the collection.
 *
 * @param {CollectionDialogProps} props
 */
export function CollectionDialog({
  open,
  onOpenChange,
  collection,
}: CollectionDialogProps) {
  /** Name of the collection (state) */
  const [name, setName] = useState("");

  /** Description of the collection (state) */
  const [description, setDescription] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  /**
   * Populate state when editing an existing collection
   */
  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setDescription(collection.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [collection]);

  /**
   * Mutation to save collection data to Supabase.
   * Handles both creation and update, ensures user profile exists.
   */
  const saveMutation = useMutation({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Ensure profile exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
      if (profileError) throw profileError;

      if (!profile) {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: String(user.id),
          email: String(user.email),
          full_name: (user.user_metadata?.full_name as string) ?? null,
          avatar_url: (user.user_metadata?.avatar_url as string) ?? null,
        });
        if (insertError) throw insertError;
      }

      // Update existing collection
      if (collection) {
        const { error } = await supabase
          .from("collections")
          .update({ name, description })
          .eq("id", collection.id);
        if (error) throw error;
      } else {
        // Create new collection
        const { error } = await supabase.from("collections").insert({
          id: createId(),
          user_id: user.id,
          name,
          description,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: collection ? "Collection updated" : "Collection created",
      });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      onOpenChange(false);
    },
    onError: (error: Partial<AuthError>) => {
      toast({
        title: "Failed to save collection",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  /**
   * Handles form submission for saving the collection.
   * Validates that the collection name is not empty.
   */
  const handleSave = () => {
    if (!name.trim()) {
      toast({ title: "Please enter a name", variant: "destructive" });
      return;
    }
    saveMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {collection ? "Edit Collection" : "New Collection"}
          </DialogTitle>
        </DialogHeader>

        {/** Form fields for name and description */}
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="My Collection"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/** Dialog footer with actions */}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            {collection ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
