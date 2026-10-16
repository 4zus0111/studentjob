import { api } from "@/lib/api";

export async function getEmployerProfile() {
  const res = await api.get("/employers/me");
  return res.data.data;
}

export async function updateEmployerProfile(payload) {
  const res = await api.put("/employers/me", payload);
  return res.data.data;
}

export async function getMyJobs(params) {
  const res = await api.get("/employers/me/jobs", { params });
  return res.data.data;
}

export async function createJob(payload) {
  const res = await api.post("/employers/me/jobs", payload);
  return res.data.data;
}

export async function updateJob({ id, ...payload }) {
  const res = await api.put(`/employers/me/jobs/${id}`, payload);
  return res.data.data;
}

export async function deleteJob(id) {
  await api.delete(`/employers/me/jobs/${id}`);
}

export async function getApplicants(jobId, params) {
  const res = await api.get(`/employers/me/jobs/${jobId}/applications`, { params });
  return res.data.data;
}

/** status: "ACCEPTED" | "REJECTED" */
export async function updateApplicationStatus({ id, status }) {
  const res = await api.patch(`/applications/${id}/status`, { status });
  return res.data.data;
}
