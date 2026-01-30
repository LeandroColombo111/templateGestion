export type DemoRole = "ADMIN" | "ANALYST";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
};

export const demoUsers: Array<DemoUser & { password: string }> = [
  {
    id: "user-admin",
    name: "Demo Admin",
    email: "admin@demo.local",
    password: "demo1234",
    role: "ADMIN"
  },
  {
    id: "user-analyst",
    name: "Demo Analyst",
    email: "analyst@demo.local",
    password: "demo1234",
    role: "ANALYST"
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
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

export function storeUser(user: DemoUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey);
}
