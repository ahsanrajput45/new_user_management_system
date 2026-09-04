import { api } from "./api";

export async function getUsers() {
  const { data } = await api.get("/users");
  return data.map(({ password, ...user }) => user);
}

export async function getUserById(id) {
  const { data } = await api.get(`/users/${id}`);
  const { password, ...user } = data;
  return user;
}

export async function createUser(payload) {
  const { data } = await api.post("/users", {
    ...payload,
    createdAt: new Date().toISOString(),
  });
  const { password, ...user } = data;
  return user;
}

export async function updateUser(id, payload) {
  const { data: existing } = await api.get(`/users/${id}`);
  const { data } = await api.put(`/users/${id}`, {
    ...existing,
    ...payload,
    ...(payload.password ? { password: payload.password } : { password: existing.password }),
    id,
  });
  const { password, ...user } = data;
  return user;
}

export async function deleteUser(id) {
  await api.delete(`/users/${id}`);
  return id;
}

export async function checkEmailExists(email, excludeId) {
  const { data } = await api.get("/users", { params: { email } });
  return data.some((user) => user.id !== excludeId);
}
