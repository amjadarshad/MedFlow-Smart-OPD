import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMyProfile } from "../services/authService.js";
import { apiEvents } from "../constants/apiConstants.js";
import { clearSession, readSession, writeSession } from "../lib/session.js";
import { roleHomePaths } from "../config/navigation.js";

const authContext = createContext(null);

export { roleHomePaths };

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readSession());
  const [isInitializing, setIsInitializing] = useState(() => Boolean(readSession()?.token));

  const logout = useCallback(() => {
    setSession(null);
    clearSession();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener(apiEvents.unauthorized, handleUnauthorized);
    return () => window.removeEventListener(apiEvents.unauthorized, handleUnauthorized);
  }, [logout]);

  useEffect(() => {
    const currentSession = readSession();
    if (!currentSession?.token) {
      setIsInitializing(false);
      return;
    }

    let isActive = true;
    getMyProfile()
      .then((data) => {
        if (!isActive) return;
        const user = { ...currentSession.user, ...data.user };
        const nextSession = { ...currentSession, user };
        setSession(nextSession);
        writeSession(nextSession);
      })
      .catch(() => {
        if (isActive) logout();
      })
      .finally(() => {
        if (isActive) setIsInitializing(false);
      });

    return () => {
      isActive = false;
    };
  }, [session?.token, logout]);

  // Called after a successful /api/auth/login or /api/auth/register response
  const login = useCallback((userData, authToken) => {
    const nextSession = { user: userData, token: authToken };
    setSession(nextSession);
    writeSession(nextSession);
  }, []);

  const value = useMemo(() => ({
    role: session?.user?.role || null,
    token: session?.token || null,
    user: session?.user || null,
    isInitializing,
    login,
    logout,
  }), [session, isInitializing, login, logout]);

  return (
    <authContext.Provider value={value}>
      {children}
    </authContext.Provider>
  );
}

// Convenience hook so components can just do: const { role, token, user, login, logout } = useAuth();
export function useAuth() {
  const context = useContext(authContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
