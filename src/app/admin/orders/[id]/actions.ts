// app/admin/orders/[id]/actions.ts — Server Action terpisah
"use server";

import { updateOrderStatusService } from "@/lib/services/order-service";
import { getServerSession } from "@/lib/get-session";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@/lib/generated/prisma/client";

export async function updateStatusAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getServerSession();
  if (!session || session.user?.role !== "ADMIN") {
    return "Unauthorized";
  }

  const orderId = formData.get("orderId") as string;
  const status  = formData.get("status") as OrderStatus;

  if (!Object.values(OrderStatus).includes(status)) {
    return "Status tidak valid";
  }

  try {
    await updateOrderStatusService(orderId, status);
    revalidatePath(`/admin/orders/${orderId}`);
    return null; // null = sukses
  } catch (e) {
    return e instanceof Error ? e.message : "Gagal update status";
  }
}