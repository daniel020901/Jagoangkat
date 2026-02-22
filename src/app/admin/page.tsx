import type { Metadata } from "next";
import { getServerSession } from "@/lib/get-session";
import { forbidden, unauthorized } from "next/navigation";
import Overview from "./overview/page";

export const metadata: Metadata = {
  title: "ADMIN",
};

export default async function AdminPage() {
  const session = await getServerSession()
  const user = session?.user;

  if(!user) unauthorized()

  if(user.role !== "ADMIN") forbidden()
  
  return (
    <Overview/>
  );
}
