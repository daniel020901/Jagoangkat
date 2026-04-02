import { getServerSession } from "@/lib/get-session";
import { NextResponse } from "next/server";
import { updateOrderStatusService } from "@/lib/services/order-service";
import { OrderStatus } from "@/lib/generated/prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses Admin ditolak" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const status = body.status as OrderStatus;

    if (!status) return NextResponse.json({ message: "Status diperlukan" }, { status: 400 });

    const result = await updateOrderStatusService(id, status);
    return NextResponse.json(result);

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    let code = 500;
    if (msg.includes("tidak ditemukan")) code = 404;
    if (msg.includes("belum lunas") || msg.includes("sudah final")) code = 403;
    
    return NextResponse.json({ message: msg }, { status: code });
  }
}