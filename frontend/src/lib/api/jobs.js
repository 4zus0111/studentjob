import { api } from "@/lib/api";

/** Params: keyword, categoryId, jobType, location, salaryMin, page (0-based), size. */
export async function searchJobs(params) {
  const res = await api.get("/jobs", { params });
  return res.data.data; // PageResponse<Job>
}

export async function getJob(id) {
  const res = await api.get(`/jobs/${id}`);
  return res.data.data;
}

export async function getCategories() {
  const res = await api.get("/categories");
  return res.data.data;
}
