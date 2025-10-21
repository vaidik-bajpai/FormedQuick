"use client";

import { useUserStore } from "@/store/user.store";
import { useRecentFormsStore } from "@/store/form.store";
import { useEffect } from "react";

const Hydration = () => {
    useEffect(() => {
        useUserStore.persist.rehydrate();
        useRecentFormsStore.persist.rehydrate();
    }, []);

    return null;
};

export default Hydration;