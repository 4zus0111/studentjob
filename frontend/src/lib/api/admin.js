import { api } from "@/lib/api";

export async function getAdminEmployers(params) {
  const res = await api.get("/admin/employers", { params });
  return res.data.data;
}

export async function decideEmployer({ userId, approved }) {
  const res = await api.patch(`/admin/employers/${userId}/approval`, { approved });
  return res.data.data;
}

export async function getAdminJobs(params) {
  const res = await api.get("/admin/jobs", { params });
  return res.data.data;
}

export async function setJobHidden({ id, hidden }) {
  const res = await api.patch(`/admin/jobs/${id}/visibility`, { hidden });
  return res.data.data;
}

export async function getAdminUsers(params) {
  const res = await api.get("/admin/users", { params });
  return res.data.data;
}

export async function setUserLocked({ id, locked }) {
  const res = await api.patch(`/admin/users/${id}/lock`, { locked });
  return res.data.data;
}
