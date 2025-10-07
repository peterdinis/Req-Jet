"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";
import { createId } from "@paralleldrive/cuid2";
import { AuthError } from "@supabase/supabase-js";
import { SaveRequestDialogProps } from "@/types/DialogTypes";

/**
 * Dialog component for saving an API request to a collection/folder in Supabase.
 *
 * @param {SaveRequestDialogProps} props - Props to control dialog behavior and request data.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {(open: boolean) => void} props.onOpenChange - Callback when the dialog open state changes.
 * @param {object} props.requestData - The request data to be saved (name, url, method, headers, body).
 * @returns {JSX.Element} SaveRequestDialog component
 */
export function SaveRequestDialog({
  open,
  onOpenChange,
  requestData,
}: SaveRequestDialogProps) {
  const [name, setName] = useState(requestData.name || "");
  const [collectionId, setCollectionId] = useState<string>("");
  const [folderId, setFolderId] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  /**
   * Fetch all collections for the user.
   */
  const { data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  /**
   * Fetch folders within the selected collection.
   */
  const { data: folders } = useQuery({
    queryKey: ["folders", collectionId],
    queryFn: async () => {
      if (!collectionId) return [];
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("collection_id", collectionId)
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!collectionId,
  });

  /**
   * Mutation to save a request to the database.
   */
  const saveRequestMutation = useMutation({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("api_requests").insert({
        id: createId(),
        user_id: user.id,
        name: name || requestData.url,
        url: requestData.url,
        method: requestData.method,
        headers: requestData.headers,
        body: requestData.body,
        collection_id: collectionId || null,
        folder_id: folderId || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Request saved successfully" });
      queryClient.invalidateQueries({ queryKey: ["api_requests"] });
      onOpenChange(false);
      setName("");
      setCollectionId("");
      setFolderId("");
    },
    onError: (error: Partial<AuthError>) => {
      toast({
        title: "Failed to save request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  /**
   * Handles the save button click.
   * Validates input and triggers the mutation.
   */
  const handleSave = () => {
    if (!name) {
      toast({ title: "Please enter a name", variant: "destructive" });
      return;
    }
    saveRequestMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Request Name Input */}
          <div className="space-y-2">
            <Label>Request Name</Label>
            <Input
              placeholder="My API Request"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Collection Selector */}
          <div className="space-y-2">
            <Label>Collection (Optional)</Label>
            <Select value={collectionId} onValueChange={setCollectionId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent>
                {collections?.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Folder Selector */}
          {collectionId && folders && folders.length > 0 && (
            <div className="space-y-2">
              <Label>Folder (Optional)</Label>
              <Select value={folderId} onValueChange={setFolderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Dialog Footer */}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saveRequestMutation.isPending}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
