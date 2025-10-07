"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/client";

/**
 * Custom hook for logging out a user using Supabase authentication.
 *
 * This hook integrates Supabase's `signOut` method with React Query's `useMutation`
 * to handle loading, success, and error states in a React-friendly way.
 *
 * On successful logout, the user is redirected to the `/auth` page.
 *
 * @example
 * ```tsx
 * const { logout, isLoading, error } = useLogout();
 *
 * // Trigger logout
 * logout();
 *
 * if (isLoading) return <p>Logging out...</p>;
 * if (error) return <p>Logout failed: {error.message}</p>;
 * ```
 *
 * @returns {Object} Logout utilities
 * @returns {() => void} return.logout - Function to trigger the logout mutation
 * @returns {boolean} return.isLoading - Whether the logout process is in progress
 * @returns {Error | null} return.error - Error object if logout failed
 */
export const useLogout = () => {
  const router = useRouter();

  const mutation = useMutation<void, Error>({
    mutationKey: ["logoutUser"],
    /**
     * Mutation function that calls Supabase signOut.
     *
     * @throws {Error} Throws an error if Supabase sign-out fails.
     */
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    },
    /**
     * Called when the logout succeeds.
     * Redirects the user to the authentication page.
     */
    onSuccess: () => {
      router.push("/auth");
    },
    /**
     * Called when the logout fails.
     * Logs the error message to the console.
     *
     * @param {Error} error - The error thrown by the mutation
     */
    onError: (error) => {
      console.error("Logout failed:", error.message);
    },
  });

  return {
    /** Function to trigger the logout mutation */
    logout: mutation.mutate,
    /** Whether the logout process is currently running */
    isLoading: mutation.isPending,
    /** Error object if logout fails */
    error: mutation.error,
  };
};
