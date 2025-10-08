"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook providing mutations for managing collections.
 *
 * Currently supports:
 * - Deleting a collection by ID
 *
 * The hook automatically invalidates related queries to keep the UI in sync:
 * - collections
 * - folders
 * - api_requests
 *
 * @returns {Object} An object containing the collection mutation functions
 * @returns {import("@tanstack/react-query").UseMutationResult<void, unknown, string>} return.deleteCollection - Mutation to delete a collection by ID
 *
 * @example
 * ```ts
 * const { deleteCollection } = useCollectionMutations();
 *
 * // Delete a collection
 * deleteCollection.mutate("collection-id-123");
 * ```
 */
export const useCollectionMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteCollection = useMutation({
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
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["api_requests"] });
    },
    onError: () => {
      toast({ title: "Error deleting collection", variant: "destructive" });
    },
  });

  return { deleteCollection };
};
