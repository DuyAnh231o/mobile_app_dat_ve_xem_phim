import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ───────────────────────────────────────────────────────────────────

type User = {
  name: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
};

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Khởi động app: đọc AsyncStorage 1 lần duy nhất
  useEffect(() => {
    const restore = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("access_token");
        const storedName = await AsyncStorage.getItem("user_name");
        const storedRole = await AsyncStorage.getItem("user_role");

        if (storedToken && storedName) {
          setToken(storedToken);
          setUser({ name: storedName, role: storedRole || "USER" });
        }
      } catch (e) {
        console.warn("AuthContext restore error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    restore();
  }, []);

  // Gọi sau khi đăng nhập thành công → cập nhật state ngay lập tức
  const login = useCallback(async (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);

    await AsyncStorage.setItem("access_token", newToken);
    await AsyncStorage.setItem("user_name", newUser.name);
    await AsyncStorage.setItem("user_role", newUser.role || "USER");
  }, []);

  // Gọi khi đăng xuất → xóa state ngay lập tức
  const logout = useCallback(async () => {
    setToken(null);
    setUser(null);

    await AsyncStorage.multiRemove(["access_token", "user_name", "user_role"]);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải dùng bên trong <AuthProvider>");
  return ctx;
}
