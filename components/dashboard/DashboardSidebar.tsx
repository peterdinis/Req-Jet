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
  GripVertical,
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
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/supabase/client";
import { CollectionDialog } from "../dialogs/CollectionDialog";
import { ModeToggle } from "../shared/ModeToggle";
import { Collection } from "@/types/CollectionTypes";

/**
 * DashboardSidebar displays a user's collections, folders, and API requests
 * in a collapsible, scrollable sidebar. Supports creating, editing, and
 * deleting collections and folders, as well as logging out.
 *
 * @param {Object} props
 * @param {User | null} props.user - The currently logged-in user.
 * @param {(request: unknown) => void} [props.onRequestSelect] - Callback invoked when a request is selected.
 */
export function DashboardSidebar({
  user,
  onRequestSelect,
}: {
  user: User | null;
  onRequestSelect?: (request: unknown) => void;
}) {
  /** Tracks which collections are expanded */
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(
    new Set(),
  );

  /** Controls whether the collection dialog is open */
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);

  /** The currently selected collection for editing */
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  /** Controls whether the delete confirmation dialog is open */
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  /** ID of the collection to be deleted */
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(
    null,
  );

  const { toast } = useToast();
  const queryClient = useQueryClient();

  /**
   * Fetch all collections for the user, ordered by creation date descending.
   * Only runs if a user is logged in.
   */
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

  /**
   * Fetch all folders, ordered by position ascending.
   * Only runs if a user is logged in.
   */
  const { data: folders = [] } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .order("position", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  /**
   * Fetch all API requests.
   * Only runs if a user is logged in.
   */
  const { data: requests = [] } = useQuery({
    queryKey: ["api_requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("api_requests").select("*");
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  /**
   * Mutation to delete a collection by ID. Invalidates collections, requests, and folders queries on success.
   */
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

  /**
   * Sign out the current user from Supabase.
   */
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  /**
   * Toggles the expanded/collapsed state of a collection in the sidebar.
   * @param {string} id - The ID of the collection to toggle.
   */
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
              <h2 className="font-semibold">Req Jet</h2>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-4">
          {/* New Collection Button */}
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

          {/* Scrollable List of Collections */}
          <ScrollArea className="flex-1">
            <SidebarMenu>
              {collections.map((collection, index) => {
                const collectionFolders = folders.filter(
                  (f) => f.collection_id === collection.id,
                );
                const collectionRequests = requests.filter(
                  (r) => r.collection_id === collection.id && !r.folder_id,
                );
                const isExpanded = expandedCollections.has(collection.id);

                return (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Collapsible
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

                        {/* Folders and Requests */}
                        <CollapsibleContent className="ml-6 mt-1 space-y-1">
                          <AnimatePresence>
                            {collectionFolders.map((folder, idx) => (
                              <motion.div
                                key={folder.id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{
                                  delay: idx * 0.03,
                                  duration: 0.2,
                                }}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1 w-full group">
                                    <div className="cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity">
                                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <SidebarMenuButton className="flex-1 pl-2">
                                      <FolderPlus className="h-3 w-3" />
                                      <span className="text-sm">{folder.name}</span>
                                    </SidebarMenuButton>
                                  </div>
                                  {requests
                                    .filter((r) => r.folder_id === folder.id)
                                    .map((request) => (
                                      <SidebarMenuButton
                                        key={request.id}
                                        className="w-full pl-6 cursor-pointer"
                                        onClick={() => onRequestSelect?.(request)}
                                      >
                                        <FileText className="h-3 w-3" />
                                        <span className="text-xs">{request.name}</span>
                                      </SidebarMenuButton>
                                    ))}
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
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
                  </motion.div>
                );
              })}
            </SidebarMenu>
          </ScrollArea>
          <ModeToggle />
        </SidebarContent>

        {/* Logout Button */}
        <SidebarFooter className="border-t border-border p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>

      {/* Collection Dialog for create/edit */}
      <CollectionDialog
        open={collectionDialogOpen}
        onOpenChange={setCollectionDialogOpen}
        collection={selectedCollection}
      />

      {/* Delete Collection Confirmation Dialog */}
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
