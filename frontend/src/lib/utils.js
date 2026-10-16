import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and resolve conflicting Tailwind classes. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
