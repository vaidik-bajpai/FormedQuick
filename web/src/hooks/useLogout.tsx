"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "@/api/axiosInstance"
import { useUserStore } from "@/store/user.store"
import { AxiosError } from "axios"

export function useLogout() {
    const router = useRouter()
    const clearUser = useUserStore((state) => state.clearUser)

    async function logout() {
        try {
            await axios.post("/auth/logout", null, {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("form-gen-access-token")}`,
                },
            })

            toast("You have logged out")
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status !== 401) {
                    toast(err.response?.data?.message || "Something went wrong, try again later")
                }
            } else {
                toast("Something went wrong, try again later")
            }
        } finally { 
            localStorage.removeItem("form-gen-access-token")
            localStorage.removeItem("form-gen-refresh-token")
            clearUser()
            router.push("/signin")
        }
    }

    return logout
}
