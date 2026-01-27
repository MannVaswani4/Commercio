import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useAuthStore = create(
    devtools(
        persist(
            (set) => ({
                userInfo: null,
                setUserInfo: (data) => set({ userInfo: data }),
                logout: () => set({ userInfo: null }),
            }),
            {
                name: 'auth-storage',
            }
        )
    )
);

export default useAuthStore;
