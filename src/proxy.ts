// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(req: NextRequest) {
  // Ambil session berdasarkan request middleware
  const session = await auth.api.getSession(req);

  const pathname = req.nextUrl.pathname;

  if (!session?.user) {
    const loginUrl = new URL("/sign-in", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Validasi role
  if (
    session.user.role !== "ADMIN" 
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // 3. lanjutkan request
  return NextResponse.next();
}

// Aktif untuk semua route /admin
export const config = {
  matcher: ["/admin/:path*"],
};
