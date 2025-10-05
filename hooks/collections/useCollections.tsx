"use client"

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";

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
