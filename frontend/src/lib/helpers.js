/** Role helpers and backend error translation (backend messages are English, UI is Vietnamese). */

export const ROLES = {
  STUDENT: "STUDENT",
  EMPLOYER: "EMPLOYER",
  ADMIN: "ADMIN",
};

export const ROLE_LABELS = {
  STUDENT: "Sinh viên",
  EMPLOYER: "Nhà tuyển dụng",
  ADMIN: "Quản trị viên",
};

/** Where a user lands after login (and when visiting an area of another role). */
export const ROLE_HOME = {
  STUDENT: "/student/profile",
  EMPLOYER: "/employer/jobs",
  ADMIN: "/admin/employers",
};

export function homeFor(role) {
  return ROLE_HOME[role] ?? "/";
}

/** Only allow same-site relative redirects (prevents open redirects via ?next=). */
export function safeNext(next) {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : null;
}

// ---- Error translation -------------------------------------------------------

const MESSAGES = {
  "Invalid email or password": "Email hoặc mật khẩu không đúng",
  "Email is already registered": "Email này đã được đăng ký",
  "Your account has been locked": "Tài khoản của bạn đã bị khóa",
  "Authentication required": "Vui lòng đăng nhập để tiếp tục",
  "Validation failed": "Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại",
};

function translateFieldMessage(msg) {
  if (!msg) return msg;
  if (msg === "must not be blank") return "Không được để trống";
  if (msg === "must be a valid email") return "Email không hợp lệ";
  let m = msg.match(/^must be between (\d+) and (\d+) characters$/);
  if (m) return `Phải từ ${m[1]} đến ${m[2]} ký tự`;
  m = msg.match(/^must be at most (\d+) characters$/);
  if (m) return `Tối đa ${m[1]} ký tự`;
  return msg;
}

/** Field errors from the backend `errors` map, translated. */
export function getFieldErrors(error) {
  const errors = error?.response?.data?.errors;
  if (!errors) return {};
  return Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, translateFieldMessage(v)]));
}

/** Human readable (Vietnamese) message for any thrown error. */
export function getErrorMessage(error) {
  if (error?.response) {
    const message = error.response.data?.message;
    if (message && MESSAGES[message]) return MESSAGES[message];
    if (error.response.status >= 500) return "Máy chủ đang gặp sự cố, vui lòng thử lại sau";
    if (error.response.status === 403) return "Bạn không có quyền thực hiện thao tác này";
    return message || "Đã có lỗi xảy ra, vui lòng thử lại";
  }
  if (error?.request) return "Không thể kết nối tới máy chủ, vui lòng kiểm tra mạng";
  return "Đã có lỗi xảy ra, vui lòng thử lại";
}

/** First letters of a display name, for avatar fallbacks. */
export function getInitials(name = "") {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const last = words[words.length - 1][0];
  return (words.length > 1 ? words[0][0] + last : last).toUpperCase();
}
