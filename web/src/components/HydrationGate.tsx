"use client";

import React from "react";
import { useUserStore } from "@/store/user.store";
import { useRecentFormsStore } from "@/store/form.store";

export default function HydrationGate({ children }: { children: React.ReactNode }) {
    const userHydrated = useUserStore((s) => s.rehydrated);
    const formsHydrated = useRecentFormsStore((s) => s.rehydrated);

    if (!userHydrated || !formsHydrated) {
        return null;
    }

    return <>{children}</>;
}
