import { z } from "zod";
import { todayString } from "@/lib/format";

const salary = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d{1,12}$/.test(v), "Chỉ nhập số nguyên không âm");

/**
 * `originalDeadline`: when editing, keeping the existing deadline is allowed even if it has passed,
 * so an employer can still close or edit an expired job (the server applies the same rule).
 */
export function buildJobSchema(originalDeadline = null) {
  return z
  .object({
    title: z.string().trim().min(1, "Vui lòng nhập tiêu đề").max(255, "Tối đa 255 ký tự"),
    categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
    jobType: z.string().min(1, "Vui lòng chọn loại hình"),
    location: z.string().trim().max(255, "Tối đa 255 ký tự"),
    salaryMin: salary,
    salaryMax: salary,
    deadline: z
      .string()
      .min(1, "Vui lòng chọn hạn nộp hồ sơ")
      .refine((v) => v >= todayString() || v === originalDeadline, "Hạn nộp hồ sơ không được ở quá khứ"),
    description: z.string().trim().min(1, "Vui lòng nhập mô tả công việc").max(10000, "Tối đa 10000 ký tự"),
    requirements: z.string().trim().max(10000, "Tối đa 10000 ký tự"),
    status: z.enum(["OPEN", "CLOSED"]),
  })
  .refine((d) => d.salaryMin === "" || d.salaryMax === "" || Number(d.salaryMax) >= Number(d.salaryMin), {
    path: ["salaryMax"],
    message: "Lương tối đa không được thấp hơn lương tối thiểu",
  });
}

export const jobSchema = buildJobSchema();

export const JOB_DEFAULTS = {
  title: "",
  categoryId: "",
  jobType: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  deadline: "",
  description: "",
  requirements: "",
  status: "OPEN",
};

export function jobToFormValues(job) {
  return {
    title: job.title ?? "",
    categoryId: job.category?.id != null ? String(job.category.id) : "",
    jobType: job.jobType ?? "",
    location: job.location ?? "",
    salaryMin: job.salaryMin != null ? String(job.salaryMin) : "",
    salaryMax: job.salaryMax != null ? String(job.salaryMax) : "",
    deadline: job.deadline ?? "",
    description: job.description ?? "",
    requirements: job.requirements ?? "",
    // HIDDEN is controlled by admins; show it as OPEN-like choice but the server keeps it hidden
    status: job.status === "CLOSED" ? "CLOSED" : "OPEN",
  };
}

/** Form values -> JobRequest body. */
export function formValuesToJobRequest(values, { includeStatus }) {
  return {
    title: values.title,
    description: values.description,
    requirements: values.requirements,
    salaryMin: values.salaryMin === "" ? null : Number(values.salaryMin),
    salaryMax: values.salaryMax === "" ? null : Number(values.salaryMax),
    location: values.location,
    jobType: values.jobType,
    deadline: values.deadline,
    categoryId: Number(values.categoryId),
    ...(includeStatus ? { status: values.status } : {}),
  };
}
