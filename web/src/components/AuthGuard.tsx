"use client"

import { useUserStore } from "@/store/user.store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const user = useUserStore((state) => state.user)
    const hasHydrated = useUserStore.persist.hasHydrated()
    const router = useRouter()

    useEffect(() => {
        if (!hasHydrated) return 

        if (!user) {
            toast("Unauthorised, please log in again")
            router.replace("/signin")
        }
    }, [user, router, hasHydrated])

    if (!hasHydrated || !user) {
        return <div>Loading...</div>
    }

    return <>{children}</>
}

export default AuthGuard
