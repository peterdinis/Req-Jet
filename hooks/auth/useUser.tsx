"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { User, Session } from "@supabase/supabase-js";

/**
 * Custom React hook for managing the authenticated user session with Supabase.
 *
 * This hook:
 * - Fetches the current Supabase session using React Query.
 * - Stores the authenticated user in local state.
 * - Subscribes to Supabase auth state changes to update user state in real-time.
 * - Redirects unauthenticated users to the `/auth` page.
 *
 * @example
 * ```tsx
 * const { user, isLoading } = useUser();
 *
 * if (isLoading) return <p>Loading...</p>;
 * if (!user) return <p>No user logged in</p>;
 *
 * return <p>Welcome {user.email}</p>;
 * ```
 *
 * @returns {Object} Auth state
 * @returns {User | null} return.user - The currently authenticated user or null if not logged in
 * @returns {boolean} return.isLoading - Whether the user session is still being loaded
 */
export const useUser = () => {
  /** State for the current authenticated user */
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  /**
   * Query to fetch the current Supabase session.
   *
   * @type {UseQueryResult<Session | null, Error>}
   */
  const query: UseQueryResult<Session | null, Error> = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    },
  });

  /**
   * Effect that updates the user state whenever the query result changes.
   */
  useEffect(() => {
    const session = query.data;
    setUser(session?.user ?? null);
  }, [query.data, query.isLoading, router]);

  /**
   * Effect that subscribes to Supabase authentication state changes.
   * Updates user state and redirects to `/auth` if no session exists.
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        router.push("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return { user, isLoading: query.isLoading };
};
