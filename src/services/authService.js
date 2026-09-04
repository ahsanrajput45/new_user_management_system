import { api } from "./api";

const SESSION_KEY = "auth_session";

export async function login({ email, password }) {
  const { data: users } = await api.get("/users", {
    params: { email },
  });

  const user = users[0];

  if (!user || user.password !== password) {
    throw new Error("Invalid email or password.");
  }

  const { password: _password, ...safeUser } = user;
  const session = { user: safeUser, loggedInAt: new Date().toISOString() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return safeUser;
}

export async function signup({ firstName, lastName, email, password, photo }) {
  const { data: existing } = await api.get("/users", { params: { email } });

  if (existing.length > 0) {
    throw new Error("An account with this email already exists.");
  }

  const { data: created } = await api.post("/users", {
    firstName,
    lastName,
    email,
    password,
    role: "User",
    status: "Active",
    createdAt: new Date().toISOString(),
    ...(photo ? { photo } : {}),
  });

  return created;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getSession());
}
