import { Badge } from "@/components/ui/badge";
import {
  APPLICATION_STATUS_LABELS,
  JOB_STATUS_LABELS,
  USER_STATUS_LABELS,
} from "@/lib/format";
import { cn } from "@/lib/utils";

const TONES = {
  green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  red: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  gray: "bg-muted text-muted-foreground",
};

const CONFIG = {
  application: {
    labels: APPLICATION_STATUS_LABELS,
    tones: { PENDING: "amber", ACCEPTED: "green", REJECTED: "red" },
  },
  job: {
    labels: JOB_STATUS_LABELS,
    tones: { OPEN: "green", CLOSED: "gray", HIDDEN: "red" },
  },
  user: {
    labels: USER_STATUS_LABELS,
    tones: { ACTIVE: "green", PENDING_APPROVAL: "amber", LOCKED: "red" },
  },
};

/** kind: "application" | "job" | "user" */
export function StatusBadge({ kind, value, className }) {
  const config = CONFIG[kind];
  return (
    <Badge variant="outline" className={cn("border-transparent", TONES[config.tones[value] ?? "gray"], className)}>
      {config.labels[value] ?? value}
    </Badge>
  );
}
