import { RecentFormsState } from "@/types/form.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useRecentFormsStore = create<RecentFormsState>()(
    persist(
        (set, get) => ({
            recentForms: [],
            rehydrated: false,

            addRecentForm: (form) => {
                const existing = get().recentForms.filter((f) => f.id !== form.id);
                const updated = [form, ...existing].slice(0, 5);
                set({ recentForms: updated });
            },

            removeRecentForm: (id) => {
                set({
                    recentForms: get().recentForms.filter((f) => f.id !== id),
                });
            },

            clearRecentForms: () => set({ recentForms: [] }),
            setRehydrated: (v: boolean) => set({ rehydrated: v }),
        }),
        {
            name: "recent-forms-storage",
            onRehydrateStorage: () => (state) => {
                state?.setRehydrated(true);
            },
        }
    )
);
