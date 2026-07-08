"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { API_BASE_URL, setTokens, clearTokens, getTokens } from "@/lib/api";

interface AuthUser {
  name: string;
  email: string;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getTokens()?.access);
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("404pnf_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    if (!res.ok) throw new Error("Invalid credentials");

    const data = await res.json();
    setTokens({ access: data.access, refresh: data.refresh });

    // username আলাদা করে জানা নাই (শুধু email/password দিয়ে login),
    // তাই email এর @ এর আগের অংশটাই display name হিসেবে ব্যবহার করছি
    const derivedName = email.split("@")[0];
    const userData: AuthUser = { name: derivedName, email };
    localStorage.setItem("404pnf_user", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const res = await fetch(`${API_BASE_URL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Registration failed");
      }

      // register এ username জানা আছে, সেটাই ব্যবহার করব login এর পর
      await login(email, password);

      // login() ইতিমধ্যে email prefix দিয়ে name সেট করে দিয়েছে;
      // এখানে সঠিক username দিয়ে override করছি
      const userData: AuthUser = { name: username, email };
      localStorage.setItem("404pnf_user", JSON.stringify(userData));
      setUser(userData);
    },
    [login]
  );

  const logout = useCallback(() => {
    clearTokens();
    localStorage.removeItem("404pnf_user");
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}