// context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { IUserProfile } from "@/typings/UserProfile.type";

interface AuthContextType {
  user: IUserProfile | null;
  loading: boolean;
  login: (userData: IUserProfile) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Use separate useEffect for client-side code to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);

    // Only run this code on the client
    const loadUserFromStorage = () => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing stored user data:", e);
          localStorage.removeItem("currentUser");
        }
      }

      // Start auth check after checking local storage
      checkAuthStatus();
    };

    loadUserFromStorage();

    return () => {
      setIsMounted(false);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check for authentication token
      const token = localStorage.getItem("authToken");
      console.log("Auth check - token exists:", !!token);

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Make request with token
      const response = await fetch("http://localhost:8080/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      console.log("Auth check response status:", response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log("Auth check response data:", userData);
        setUser(userData);
      } else {
        console.log("Auth check failed, clearing user");
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: IUserProfile) => {
    setUser(userData);
    if (isMounted) {
      localStorage.setItem("currentUser", JSON.stringify(userData));
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      if (isMounted) {
        localStorage.removeItem("currentUser");
      }
      setUser(null);
      if (isMounted) {
        router.push("/login");
      }
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
