import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Which URL each role lands on right after login / when their session is restored
export const ROLE_HOME_PATHS = {
  patient: "/dashboard",
  doctor: "/dashboard/appointments",
  admin: "/dashboard/admin",
};

export function AuthProvider({ children }) {
  // Persist to localStorage so refreshing the page doesn't log the user out
  const [role, setRole] = useState(() => localStorage.getItem("medflow_role") || null);
  const [token, setToken] = useState(() => localStorage.getItem("medflow_token") || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("medflow_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Called after a successful /api/auth/login or /api/auth/register response
  function login(userData, authToken) {
    setRole(userData.role);
    setToken(authToken);
    setUser(userData);
    localStorage.setItem("medflow_role", userData.role);
    localStorage.setItem("medflow_token", authToken);
    localStorage.setItem("medflow_user", JSON.stringify(userData));
  }

  function logout() {
    setRole(null);
    setToken(null);
    setUser(null);
    localStorage.removeItem("medflow_role");
    localStorage.removeItem("medflow_token");
    localStorage.removeItem("medflow_user");
  }

  return (
    <AuthContext.Provider value={{ role, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook so components can just do: const { role, token, user, login, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}