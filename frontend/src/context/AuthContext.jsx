import { createContext, useContext, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token"));
  const [email, setEmail] = useState(() => localStorage.getItem("admin_email"));

  async function login(loginEmail, password) {
    const { data } = await client.post("/auth/login", { email: loginEmail, password });
    localStorage.setItem("admin_token", data.token);
    localStorage.setItem("admin_email", data.email);
    setToken(data.token);
    setEmail(data.email);
  }

  function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");
    setToken(null);
    setEmail(null);
  }

  const value = { token, email, isAuthenticated: Boolean(token), login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
