import { PageHeader } from "@/components/common/page-header";
import { StudentProfileForm } from "@/components/student/student-profile-form";

export const metadata = { title: "Hồ sơ của tôi" };

export default function StudentProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Hồ sơ của tôi" description="Hồ sơ đầy đủ giúp bạn gây ấn tượng với nhà tuyển dụng." />
      <StudentProfileForm />
    </div>
  );
}
