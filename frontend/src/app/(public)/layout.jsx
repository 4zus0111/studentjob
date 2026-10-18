import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({ children }) {
  return (
    <>
      {/* The navbar reads the pathname; dynamic routes (/jobs/[id]) require a Suspense boundary */}
      <Suspense fallback={<div className="h-16 border-b" />}>
        <Navbar />
      </Suspense>
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
