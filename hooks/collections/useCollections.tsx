"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";

/**
 * Custom hook to fetch collections, folders, and API requests from Supabase.
 *
 * This hook uses React Query to fetch and cache:
 * - Collections (optionally enabled)
 * - Folders
 * - API requests
 *
 * @param {boolean} enabled - Whether the queries should be enabled (run).
 * @returns {Object} Queries for collections, folders, and API requests
 * @returns {UseQueryResult<any[], Error>} return.collectionsQuery - Query result for collections
 * @returns {UseQueryResult<any[], Error>} return.foldersQuery - Query result for folders
 * @returns {UseQueryResult<any[], Error>} return.requestsQuery - Query result for API requests
 *
 * @example
 * ```ts
 * const { collectionsQuery, foldersQuery, requestsQuery } = useCollections(true);
 *
 * if (collectionsQuery.isLoading) return <p>Loading collections...</p>;
 * console.log(collectionsQuery.data);
 * ```
 */
export const useCollections = (enabled: boolean) => {
  const collectionsQuery = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled,
  });

  const foldersQuery = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("folders").select("*");
      if (error) throw error;
      return data || [];
    },
    enabled,
  });

  const requestsQuery = useQuery({
    queryKey: ["api_requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("api_requests").select("*");
      if (error) throw error;
      return data || [];
    },
    enabled,
  });

  return {
    collectionsQuery,
    foldersQuery,
    requestsQuery,
  };
};
