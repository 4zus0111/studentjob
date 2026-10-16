import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(500, "Tối đa 500 ký tự")
  .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Đường dẫn phải bắt đầu bằng http:// hoặc https://");

const optionalText = (max) => z.string().trim().max(max, `Tối đa ${max} ký tự`);

export const studentProfileSchema = z.object({
  fullName: z.string().trim().min(1, "Vui lòng nhập họ và tên").max(100, "Tối đa 100 ký tự"),
  phone: z
    .string()
    .trim()
    .max(20, "Tối đa 20 ký tự")
    .refine((v) => v === "" || /^[0-9+\s().-]{8,20}$/.test(v), "Số điện thoại không hợp lệ"),
  university: optionalText(255),
  major: optionalText(255),
  skills: optionalText(2000),
  cvUrl: optionalUrl,
});

export const employerProfileSchema = z.object({
  companyName: z.string().trim().min(1, "Vui lòng nhập tên công ty").max(255, "Tối đa 255 ký tự"),
  description: optionalText(5000),
  website: optionalUrl,
  address: optionalText(255),
  logoUrl: optionalUrl,
});

/** null -> "" so controlled inputs never receive null. */
export function toFormValues(profile, fields) {
  return Object.fromEntries(fields.map((f) => [f, profile?.[f] ?? ""]));
}
