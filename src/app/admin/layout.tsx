import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { forbidden, unauthorized } from "next/navigation";
import { ToastContainer } from "react-toastify";
import AdminNavbar from "@/components/admin/AdminNavbar";
import Sidebar from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    unauthorized();
  }

  if (session.user.role !== "ADMIN") {
    forbidden();
  }

  return (
    // Menggunakan flex h-screen agar layout memenuhi layar dan tidak berantakan
    <div className="flex h-screen bg-background overflow-hidden">
    
      <Sidebar />

      {/* 2. Area kanan (Navbar + Main Content) */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar melayang di atas */}
        <AdminNavbar />
        
        {/* Konten utama dengan scroll mandiri */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}