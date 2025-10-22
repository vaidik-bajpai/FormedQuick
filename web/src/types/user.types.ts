import { PersistOptions } from "zustand/middleware";

interface User {
    username: string
    email: string
}

interface StoreUser {
    user: User | null;
    setUser: (user: User) => void;
    getUser: () => User | null;
    clearUser: () => void;

    rehydrated: boolean;
    setRehydrated: (v: boolean) => void;
}

export type {
    User,
    StoreUser,
}