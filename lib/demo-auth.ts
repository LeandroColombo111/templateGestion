import type { DemoUser, Role } from "../types";
import { readStorage, writeStorage, removeStorage } from "./storage";

export type DemoUserRecord = DemoUser & { password: string };

export const demoUsers: DemoUserRecord[] = [
  {
    id: "user-admin",
    name: "Demo Admin",
    email: "admin@demo.local",
    password: "demo1234",
    role: "ADMIN" as Role
  },
  {
    id: "user-analyst",
    name: "Demo Analyst",
    email: "analyst@demo.local",
    password: "demo1234",
    role: "ANALYST" as Role
  }
];

const storageKey = "demoUser";

export function authenticate(email: string, password: string) {
  const user = demoUsers.find(
    (item) => item.email === email && item.password === password
  );
  if (!user) return null;
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export function getStoredUser(): DemoUser | null {
  return readStorage<DemoUser | null>(storageKey, null);
}

export function storeUser(user: DemoUser) {
  writeStorage(storageKey, user);
}

export function clearStoredUser() {
  removeStorage(storageKey);
}
