"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { Models } from "appwrite";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionUser = await account.get();
        setUser(sessionUser);
        // Ensure proxy detects session by setting a fallback cookie
        document.cookie = "insyt_fallback_session=true; path=/; max-age=31536000";
      } catch (error) {
        // Not logged in or session expired
        setUser(null);
        document.cookie = "insyt_fallback_session=; path=/; max-age=0";
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      document.cookie = "insyt_fallback_session=; path=/; max-age=0";
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
