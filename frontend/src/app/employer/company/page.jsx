import { CompanyForm } from "@/components/employer/company-form";
import { PageHeader } from "@/components/common/page-header";

export const metadata = { title: "Hồ sơ công ty" };

export default function EmployerCompanyPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Hồ sơ công ty" description="Thông tin này hiển thị trên các tin tuyển dụng của bạn." />
      <CompanyForm />
    </div>
  );
}
