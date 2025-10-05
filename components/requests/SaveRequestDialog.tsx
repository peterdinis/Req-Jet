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

type SaveRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestData: {
    name: string;
    url: string;
    method: string;
    headers: any[];
    body: string;
  };
};

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

  const saveRequestMutation = useMutation({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("api_requests").insert({
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
    onError: (error: any) => {
      toast({
        title: "Failed to save request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
          <div className="space-y-2">
            <Label>Request Name</Label>
            <Input
              placeholder="My API Request"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
