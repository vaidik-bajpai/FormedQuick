import { RecentFormsState } from "@/types/form.types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useRecentFormsStore = create<RecentFormsState>()(
    persist(
        (set, get) => ({
            recentForms: [],

            addRecentForm: (form) => {
                const existing = get().recentForms.filter(f => f.id !== form.id)
                const updated = [form, ...existing].slice(0, 5) 
                set({ recentForms: updated })
            },

            removeRecentForm: (id) => {
                set({
                    recentForms: get().recentForms.filter(f => f.id !== id)
                })
            },

            clearRecentForms: () => set({ recentForms: [] }),
        }),
        
        {
            name: 'recent-forms-storage',
        }
    )
)