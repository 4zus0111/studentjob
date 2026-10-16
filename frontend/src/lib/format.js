/** Display helpers: labels, money, dates. All user-facing text is Vietnamese. */

export const JOB_TYPE_LABELS = {
  INTERNSHIP: "Thực tập",
  PART_TIME: "Bán thời gian",
  FULL_TIME: "Toàn thời gian",
};

export const JOB_STATUS_LABELS = {
  OPEN: "Đang tuyển",
  CLOSED: "Đã đóng",
  HIDDEN: "Bị ẩn",
};

export const APPLICATION_STATUS_LABELS = {
  PENDING: "Đang chờ",
  ACCEPTED: "Được nhận",
  REJECTED: "Bị từ chối",
};

export const USER_STATUS_LABELS = {
  ACTIVE: "Hoạt động",
  PENDING_APPROVAL: "Chờ duyệt",
  LOCKED: "Đã khóa",
};

function formatAmount(n) {
  if (n >= 1_000_000) {
    const millions = n / 1_000_000;
    return `${Number.isInteger(millions) ? millions : millions.toFixed(1).replace(".", ",")} triệu`;
  }
  return `${n.toLocaleString("vi-VN")}đ`;
}

/** "10 - 15 triệu", "Từ 5 triệu", "Đến 8 triệu" or "Thỏa thuận". */
export function formatSalary(min, max) {
  const hasMin = min != null;
  const hasMax = max != null;
  if (hasMin && hasMax) return min === max ? formatAmount(min) : `${formatAmount(min).replace(" triệu", "")} - ${formatAmount(max)}`;
  if (hasMin) return `Từ ${formatAmount(min)}`;
  if (hasMax) return `Đến ${formatAmount(max)}`;
  return "Thỏa thuận";
}

/** "2026-10-20" (LocalDate) -> "20/10/2026" without any timezone conversion. */
export function formatDate(date) {
  if (!date) return "";
  const [y, m, d] = String(date).slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

/** ISO date-time from the backend -> "20/10/2026". */
export function formatDateTime(dateTime) {
  if (!dateTime) return "";
  return new Date(dateTime).toLocaleDateString("vi-VN");
}

/** Today as "YYYY-MM-DD" in the browser's timezone (for <input type="date"> comparisons). */
export function todayString() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Whole days until the deadline (negative once it has passed). */
export function daysLeft(deadline) {
  if (!deadline) return null;
  const [y, m, d] = String(deadline).slice(0, 10).split("-").map(Number);
  const end = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((end - today) / 86_400_000);
}

export function isExpired(deadline) {
  const left = daysLeft(deadline);
  return left !== null && left < 0;
}

export function deadlineLabel(deadline) {
  const left = daysLeft(deadline);
  if (left === null) return "";
  if (left < 0) return "Đã hết hạn";
  if (left === 0) return "Hết hạn hôm nay";
  return `Còn ${left} ngày`;
}
