import { StoreUser } from '@/types/user.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware'

export const useUserStore = create<
    StoreUser,  
    [
        ['zustand/persist', StoreUser] 
    ]
>(
    persist(
        (set, get) => ({
            user: null,

            setUser: (user) => set({ user }),
            getUser: () => get().user,
            clearUser: () => set({ user: null }),
        }),
       
        {
            name: "form-gen-auth-user"
        }
    )
);