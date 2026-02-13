import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#020202]">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-10 lg:p-12 overflow-y-auto min-h-screen">
        <div className="max-w-6xl mx-auto w-full h-full animate-in fade-in duration-700">{children}</div>
      </main>
    </div>
  );
}
