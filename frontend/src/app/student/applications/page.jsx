import { PageHeader } from "@/components/common/page-header";
import { MyApplications } from "@/components/student/my-applications";

export const metadata = { title: "Đơn ứng tuyển" };

export default function StudentApplicationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Đơn ứng tuyển" description="Theo dõi trạng thái các vị trí bạn đã ứng tuyển." />
      <MyApplications />
    </div>
  );
}
