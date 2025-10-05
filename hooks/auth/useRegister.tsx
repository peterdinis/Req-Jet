import { supabase } from "@/supabase/client";
import { useMutation } from "@tanstack/react-query";

export const useSignupMutation = () =>
  useMutation({
    mutationKey: ["registerUser"],
    mutationFn: async ({ email, password, fullName }: { email: string; password: string; fullName: string }) => {
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