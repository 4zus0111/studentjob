import { AreaShell } from "@/components/layout/area-shell";

export default function AdminLayout({ children }) {
  return <AreaShell role="ADMIN">{children}</AreaShell>;
}
