import { supabase } from "@/supabase/client";
import { useMutation } from "@tanstack/react-query";

export const useResetPasswordMutation = () =>
  useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: async ({ email }: { email: string }) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) throw new Error(error.message);
    },
  });

export const useUpdatePasswordMutation = () =>
  useMutation({
    mutationKey: ["updatePassword"],
    mutationFn: async ({ newPassword }: { newPassword: string }) => {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);
    },
  });