import { api } from "@/lib/api";

// Every endpoint returns { success, data, message }; these helpers unwrap `data`.

export async function login(payload) {
  const res = await api.post("/auth/login", payload);
  return res.data.data; // { accessToken, user }
}

export async function registerStudent(payload) {
  const res = await api.post("/auth/register/student", payload);
  return res.data.data; // user
}

export async function registerEmployer(payload) {
  const res = await api.post("/auth/register/employer", payload);
  return res.data.data; // user
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data.data;
}
