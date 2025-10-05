"use client"

import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { supabase } from "@/supabase/client"
import { useRouter } from "next/navigation"
import { User, Session } from "@supabase/supabase-js"

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    const query: UseQueryResult<Session | null, Error> = useQuery({
        queryKey: ["userProfile"],
        queryFn: async () => {
            const { data: { session } } = await supabase.auth.getSession()
            return session
        }
    })

    // Spracovanie výsledku query cez useEffect
    useEffect(() => {
        const session = query.data
        setUser(session?.user ?? null)
        if (!session && !query.isLoading) {
            router.push("/auth")
        }
    }, [query.data, query.isLoading, router])

    // Subscription na zmeny v auth stave
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (!session) {
                router.push("/auth")
            }
        })

        return () => subscription.unsubscribe()
    }, [router])

    return { user, isLoading: query.isLoading }
}
