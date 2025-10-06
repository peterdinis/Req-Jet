"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Folder,
  FolderPlus,
  FileText,
  Plus,
  LogOut,
  Zap,
  ChevronRight,
  ChevronDown,
  Pencil,
  Trash2,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/supabase/client";
import { useLogout } from "@/hooks/auth/useLogout";
import { CollectionDialog } from "../dialogs/CollectionDialog";

type Collection = {
  id: string;
  name: string;
  description: string | null;
};

type Folder = {
  id: string;
  name: string;
  collection_id: string;
};

type ApiRequest = {
  id: string;
  name: string;
  method: string;
  collection_id: string | null;
  folder_id: string | null;
};

export function DashboardSidebar({
  user,
  onRequestSelect,
}: {
  user: User | null;
  onRequestSelect?: (request: any) => void;
}) {
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(
    new Set(),
  );
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(
    null,
  );
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: folders = [] } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("folders").select("*");
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["api_requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("api_requests").select("*");
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const deleteCollectionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Collection deleted" });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["api_requests"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      setDeleteDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error deleting collection", variant: "destructive" });
    },
  });

  const handleLogout = useLogout();

  const toggleCollection = (id: string) => {
    const newExpanded = new Set(expandedCollections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCollections(newExpanded);
  };

  return (
    <>
      <Sidebar className="border-r border-border">
        <SidebarHeader className="border-b border-border p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">API Tester</h2>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-4">
          <div className="mb-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => {
                setSelectedCollection(null);
                setCollectionDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              New Collection
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <SidebarMenu>
              {collections.map((collection) => {
                const collectionFolders = folders.filter(
                  (f) => f.collection_id === collection.id,
                );
                const collectionRequests = requests.filter(
                  (r) => r.collection_id === collection.id && !r.folder_id,
                );
                const isExpanded = expandedCollections.has(collection.id);

                return (
                  <Collapsible
                    key={collection.id}
                    open={isExpanded}
                    onOpenChange={() => toggleCollection(collection.id)}
                  >
                    <SidebarMenuItem>
                      <div className="flex items-center gap-1 w-full group">
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="flex-1">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <Folder className="h-4 w-4" />
                            <span className="flex-1 text-left">
                              {collection.name}
                            </span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              setSelectedCollection(collection);
                              setCollectionDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              setCollectionToDelete(collection.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <CollapsibleContent className="ml-6 mt-1 space-y-1">
                        {collectionFolders.map((folder) => (
                          <div key={folder.id} className="space-y-1">
                            <SidebarMenuButton className="w-full pl-2">
                              <FolderPlus className="h-3 w-3" />
                              <span className="text-sm">{folder.name}</span>
                            </SidebarMenuButton>
                            {requests
                              .filter((r) => r.folder_id === folder.id)
                              .map((request) => (
                                <SidebarMenuButton
                                  key={request.id}
                                  className="w-full pl-6 cursor-pointer"
                                  onClick={() => onRequestSelect?.(request)}
                                >
                                  <FileText className="h-3 w-3" />
                                  <span className="text-xs">
                                    {request.name}
                                  </span>
                                </SidebarMenuButton>
                              ))}
                          </div>
                        ))}
                        {collectionRequests.map((request) => (
                          <SidebarMenuButton
                            key={request.id}
                            className="w-full pl-2 cursor-pointer"
                            onClick={() => onRequestSelect?.(request)}
                          >
                            <FileText className="h-3 w-3" />
                            <span className="text-sm">{request.name}</span>
                          </SidebarMenuButton>
                        ))}
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>

        <SidebarFooter className="border-t border-border p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => {
              handleLogout.logout();
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>

      <CollectionDialog
        open={collectionDialogOpen}
        onOpenChange={setCollectionDialogOpen}
        collection={selectedCollection}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this collection? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                collectionToDelete &&
                deleteCollectionMutation.mutate(collectionToDelete)
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
