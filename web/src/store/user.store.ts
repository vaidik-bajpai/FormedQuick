import { StoreUser } from "@/types/user.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create<StoreUser>()(
    persist(
        (set, get) => ({
            user: null,
            rehydrated: false,

            setUser: (user) => set({ user }),
            getUser: () => get().user,
            clearUser: () => set({ user: null }),
            setRehydrated: (v: boolean) => set({ rehydrated: v }),
        }),
        {
            name: "form-gen-auth-user",
            onRehydrateStorage: () => (state) => {
                state?.setRehydrated(true);
            },
        }
    )
);
