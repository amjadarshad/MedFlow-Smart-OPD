import { userRoles } from "../constants/authConstants.js";
import { storageKeys } from "../constants/storageConstants.js";

const validRoles = new Set(Object.values(userRoles));

export function readSession() {
  try {
    const savedSession = localStorage.getItem(storageKeys.session);
    if (savedSession) {
      const session = JSON.parse(savedSession);
      if (session?.token && validRoles.has(session?.user?.role)) return session;
    }

    const token = localStorage.getItem(storageKeys.legacyToken);
    const savedUser = localStorage.getItem(storageKeys.legacyUser);
    const user = savedUser ? JSON.parse(savedUser) : null;

    if (token && validRoles.has(user?.role)) {
      const migratedSession = { token, user };
      writeSession(migratedSession);
      return migratedSession;
    }
  } catch {
    clearSession();
  }

  return null;
}

export function writeSession(session) {
  localStorage.setItem(storageKeys.session, JSON.stringify(session));
  localStorage.removeItem(storageKeys.legacyRole);
  localStorage.removeItem(storageKeys.legacyToken);
  localStorage.removeItem(storageKeys.legacyUser);
}

export function clearSession() {
  Object.values(storageKeys).forEach((key) => localStorage.removeItem(key));
}
