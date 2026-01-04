import { auth } from "@/lib/auth"; // Pastikan ini path ke file konfigurasi Better Auth Anda
import { headers } from "next/headers";
import {  forbidden, unauthorized } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Better Auth membutuhkan headers untuk memvalidasi session di Server Side
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    unauthorized();
  }

  // Pada Better Auth, struktur biasanya adalah session.user
  if (session.user.role !== "admin") {
    forbidden();
  }

  return (
    <div className="min-h-screen flex">
      <main className="flex-1">{children}</main>
    </div>
  );
}