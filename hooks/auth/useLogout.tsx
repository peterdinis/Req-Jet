"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/client";

export const useLogout = () => {
  const router = useRouter();

  const mutation = useMutation<void, Error>({
    mutationKey: ["logoutUser"],
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      router.push("/auth");
    },
    onError: (error) => {
      console.error("Logout failed:", error.message);
    },
  });

  return {
    logout: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
