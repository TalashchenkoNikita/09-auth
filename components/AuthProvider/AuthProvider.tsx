"use client";

import { useEffect, type ReactNode } from "react";

import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await checkSession();

        if (session.success) {
          const user = await getMe();
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      }
    }

    checkAuth();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}

export default AuthProvider;
