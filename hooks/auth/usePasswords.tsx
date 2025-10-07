import { supabase } from "@/supabase/client";
import { useMutation } from "@tanstack/react-query";

/**
 * Custom hook for requesting a password reset email via Supabase.
 *
 * This hook wraps the `supabase.auth.resetPasswordForEmail` method and integrates
 * it with React Query's mutation system. The email will contain a link that redirects
 * the user back to your app for password update.
 *
 * @example
 * ```tsx
 * const resetPassword = useResetPasswordMutation();
 *
 * resetPassword.mutate(
 *   { email: "test@example.com" },
 *   {
 *     onSuccess: () => console.log("Reset email sent"),
 *     onError: (error) => console.error("Reset failed:", error.message),
 *   }
 * );
 * ```
 *
 * @returns {UseMutationResult<void, Error, { email: string }>}
 * React Query mutation object (`mutate`, `isPending`, `error`, etc.)
 */
export const useResetPasswordMutation = () =>
  useMutation({
    mutationKey: ["resetPassword"],
    /**
     * Mutation function that triggers Supabase password reset email.
     *
     * @async
     * @param {Object} params - Input parameters
     * @param {string} params.email - User email for password reset
     * @throws {Error} Throws if Supabase returns an error
     */
    mutationFn: async ({ email }: { email: string }) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) throw new Error(error.message);
    },
  });

/**
 * Custom hook for updating the user’s password via Supabase.
 *
 * This hook wraps the `supabase.auth.updateUser` method and integrates
 * it with React Query’s mutation system.
 *
 * @example
 * ```tsx
 * const updatePassword = useUpdatePasswordMutation();
 *
 * updatePassword.mutate(
 *   { newPassword: "newSecurePassword123" },
 *   {
 *     onSuccess: () => console.log("Password updated successfully"),
 *     onError: (error) => console.error("Update failed:", error.message),
 *   }
 * );
 * ```
 *
 * @returns {UseMutationResult<void, Error, { newPassword: string }>}
 * React Query mutation object (`mutate`, `isPending`, `error`, etc.)
 */
export const useUpdatePasswordMutation = () =>
  useMutation({
    mutationKey: ["updatePassword"],
    /**
     * Mutation function that updates the user’s password.
     *
     * @async
     * @param {Object} params - Input parameters
     * @param {string} params.newPassword - The new password to set
     * @throws {Error} Throws if Supabase returns an error
     */
    mutationFn: async ({ newPassword }: { newPassword: string }) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw new Error(error.message);
    },
  });
