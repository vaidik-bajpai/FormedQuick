"use client"

import { useUserStore } from "@/store/user.store"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const user = useUserStore((state) => state.user)
    const router = useRouter()

    if (!user) {
        toast("Unauthorised, please log in again")
        router.replace("/signin")
    }

    return <>{children}</>
}

export default AuthGuard
