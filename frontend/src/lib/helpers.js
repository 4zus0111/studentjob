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
  "Access denied": "Bạn không có quyền thực hiện thao tác này",
  "Malformed request body": "Dữ liệu gửi lên không hợp lệ",
  "Job not found": "Không tìm thấy tin tuyển dụng",
  "Application not found": "Không tìm thấy đơn ứng tuyển",
  "Student profile not found": "Không tìm thấy hồ sơ sinh viên",
  "Employer profile not found": "Không tìm thấy hồ sơ công ty",
  "Employer not found": "Không tìm thấy nhà tuyển dụng",
  "User not found": "Không tìm thấy người dùng",
  "You have already applied to this job": "Bạn đã ứng tuyển vị trí này rồi",
  "The application deadline has passed": "Tin tuyển dụng đã hết hạn nộp hồ sơ",
  "This job is no longer accepting applications": "Tin tuyển dụng này không còn nhận hồ sơ",
  "Your employer account has not been approved yet": "Tài khoản nhà tuyển dụng của bạn chưa được duyệt",
  "You can only manage your own jobs": "Bạn chỉ có thể quản lý tin tuyển dụng của mình",
  "You can only review applications for your own jobs": "Bạn chỉ có thể xử lý hồ sơ của tin tuyển dụng của mình",
  "Status must be ACCEPTED or REJECTED": "Trạng thái phải là được nhận hoặc từ chối",
  "This job already has applications; close it instead of deleting it":
    "Tin đã có hồ sơ ứng tuyển, hãy đóng tin thay vì xóa",
  "Category does not exist": "Danh mục không tồn tại",
  "Maximum salary must not be lower than minimum salary": "Lương tối đa không được thấp hơn lương tối thiểu",
  "Only an admin can hide a job": "Chỉ quản trị viên mới có thể ẩn tin",
  "This job has been hidden by an admin": "Tin này đã bị quản trị viên ẩn",
  "This employer is not waiting for approval": "Nhà tuyển dụng này không ở trạng thái chờ duyệt",
  "Admin accounts cannot be locked": "Không thể khóa tài khoản quản trị viên",
  "Current password is incorrect": "Mật khẩu hiện tại không đúng",
  "New password must be different from the current password": "Mật khẩu mới phải khác mật khẩu hiện tại",
  "Deadline must not be in the past": "Hạn nộp hồ sơ không được ở quá khứ",
  "Data conflicts with existing records": "Dữ liệu bị trùng với bản ghi đã có",
};

function translateFieldMessage(msg) {
  if (!msg) return msg;
  if (msg === "must not be blank") return "Không được để trống";
  if (msg === "must be a valid email") return "Email không hợp lệ";
  if (msg === "is required") return "Không được để trống";
  if (msg === "must not be negative") return "Không được là số âm";
  if (msg === "must not be in the past") return "Không được là ngày trong quá khứ";
  if (msg === "must be a valid http(s) URL") return "Đường dẫn phải bắt đầu bằng http:// hoặc https://";
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
    const processed = message?.match(/^This application has already been (accepted|rejected)$/);
    if (processed) return `Hồ sơ này đã được ${processed[1] === "accepted" ? "chấp nhận" : "từ chối"} trước đó`;
    const badParam = message?.match(/^Invalid value for parameter/);
    if (badParam) return "Tham số tìm kiếm không hợp lệ";
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
