import { z } from "zod";

const email = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập email")
  .max(255, "Email tối đa 255 ký tự")
  .pipe(z.email("Email không hợp lệ"));

// BCrypt only uses the first 72 bytes, so the backend caps the password at 72 chars
const password = z
  .string()
  .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
  .max(72, "Mật khẩu tối đa 72 ký tự");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export const registerStudentSchema = z
  .object({
    fullName: z.string().trim().min(1, "Vui lòng nhập họ và tên").max(100, "Tối đa 100 ký tự"),
    email,
    phone: z
      .string()
      .trim()
      .max(20, "Tối đa 20 ký tự")
      .refine((v) => v === "" || /^[0-9+\s().-]{8,20}$/.test(v), "Số điện thoại không hợp lệ"),
    password,
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu nhập lại không khớp",
  });

export const registerEmployerSchema = z
  .object({
    companyName: z.string().trim().min(1, "Vui lòng nhập tên công ty").max(255, "Tối đa 255 ký tự"),
    email,
    password,
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu nhập lại không khớp",
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: password,
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu mới"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu nhập lại không khớp",
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    path: ["newPassword"],
    message: "Mật khẩu mới phải khác mật khẩu hiện tại",
  });
