import { supabase } from "@/supabase/client";
import { useMutation } from "@tanstack/react-query";

/**
 * Custom React Query mutation hook for logging in a user using Supabase authentication.
 *
 * This hook wraps the `supabase.auth.signInWithPassword` method and integrates
 * it with React Query's mutation system for better state management (loading, error, success).
 *
 * @example
 * ```tsx
 * const loginMutation = useLoginMutation();
 *
 * loginMutation.mutate(
 *   { email: "test@example.com", password: "password123" },
 *   {
 *     onSuccess: () => console.log("Login successful"),
 *     onError: (error) => console.error("Login failed:", error.message),
 *   }
 * );
 * ```
 *
 * @returns {UseMutationResult<void, Error, { email: string; password: string }>}
 * A React Query mutation object with `mutate`, `mutateAsync`, `status`, `error`, etc.
 */
export const useLoginMutation = () =>
  useMutation({
    mutationKey: ["loginUser"],
    /**
     * Mutation function that performs Supabase login with email and password.
     *
     * @async
     * @param {Object} params - User login credentials
     * @param {string} params.email - The user's email
     * @param {string} params.password - The user's password
     * @throws {Error} Throws an error if Supabase authentication fails
     */
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
    },
  });
