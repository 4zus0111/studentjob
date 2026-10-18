import { api } from "@/lib/api";

export async function getStudentProfile() {
  const res = await api.get("/students/me");
  return res.data.data;
}

export async function updateStudentProfile(payload) {
  const res = await api.put("/students/me", payload);
  return res.data.data;
}

export async function getMyApplications(params) {
  const res = await api.get("/students/me/applications", { params });
  return res.data.data;
}

export async function applyToJob({ jobId, coverLetter }) {
  const res = await api.post(`/jobs/${jobId}/applications`, { coverLetter });
  return res.data.data;
}

/** The current student's application for a job, or null if they have not applied. */
export async function getMyApplicationForJob(jobId) {
  try {
    const res = await api.get(`/jobs/${jobId}/applications/me`);
    return res.data.data;
  } catch (error) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
}
