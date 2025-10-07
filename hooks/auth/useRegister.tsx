import { supabase } from "@/supabase/client";
import { useMutation } from "@tanstack/react-query";

/**
 * Custom hook for registering a new user with Supabase authentication.
 *
 * This hook wraps the `supabase.auth.signUp` method and integrates it with
 * React Query's mutation system for handling loading, error, and success states.
 *
 * On signup, it creates a new user with email, password, and optional profile
 * metadata (such as `full_name`). Supabase will send a confirmation email
 * that redirects the user back to `/auth`.
 *
 * @example
 * ```tsx
 * const signup = useSignupMutation();
 *
 * signup.mutate(
 *   { email: "user@example.com", password: "strongPassword123", fullName: "John Doe" },
 *   {
 *     onSuccess: () => console.log("Signup successful! Check your email."),
 *     onError: (error) => console.error("Signup failed:", error.message),
 *   }
 * );
 * ```
 *
 * @returns {UseMutationResult<void, Error, { email: string; password: string; fullName: string }>}
 * React Query mutation object (`mutate`, `mutateAsync`, `isPending`, `error`, etc.)
 */
export const useSignupMutation = () =>
  useMutation({
    mutationKey: ["registerUser"],
    /**
     * Mutation function that creates a new Supabase user.
     *
     * @async
     * @param {Object} params - User signup details
     * @param {string} params.email - User email
     * @param {string} params.password - User password
     * @param {string} params.fullName - Full name to store in user metadata
     * @throws {Error} Throws if Supabase signup fails
     */
    mutationFn: async ({
      email,
      password,
      fullName,
    }: {
      email: string;
      password: string;
      fullName: string;
    }) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });
      if (error) throw new Error(error.message);
    },
  });
