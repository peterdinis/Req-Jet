"use client";

import { supabase } from "@/supabase/client";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () =>
  useMutation({
    mutationKey: ["loginUser"],
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
    },
  });

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