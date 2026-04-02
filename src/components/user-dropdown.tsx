"use client";

import { Clock, LogOutIcon, ShieldIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { User } from "@/lib/auth";

interface UserDropdownProps {
  user: User;
}

export function UserDropdown({ user }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 px-2 py-1 h-auto hover:bg-accent/50 transition-colors"
        >
          <div className="relative">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={32}
                height={32}
                className="rounded-full object-cover ring-2 ring-background"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>
          <span className="max-w-[10rem] truncate font-medium">
            {user.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <div className="flex items-center gap-3 px-2 py-3">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full object-cover ring-2 ring-primary/20"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator className="my-2" />
        {user.role !== "ADMIN" &&(
          <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile" className="flex items-center gap-3 px-2 py-2 rounded-md">
            <UserIcon className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Profile</span>
          </Link>
        </DropdownMenuItem>

        )}

        
        
        {user.role === "ADMIN" && <AdminItem />}
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/orders" className="flex items-center gap-3 px-2 py-2 rounded-md">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Riwayat Pesanan</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2" />
        <SignOutItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AdminItem() {
  return (
    <DropdownMenuItem asChild className="cursor-pointer">
      <Link href="/admin" className="flex items-center gap-3 px-2 py-2 rounded-md">
        <ShieldIcon className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium">Admin</span>
      </Link>
    </DropdownMenuItem>
  );
}

function SignOutItem() {
  const router = useRouter();

  async function handleSignOut() {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      toast.success("Signed out successfully");
      router.push("/");
      router.refresh()
    }
  }

  return (
    <DropdownMenuItem 
      onClick={handleSignOut} 
      className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
    >
      <div className="flex items-center gap-3 px-2 py-2 rounded-md w-full">
        <LogOutIcon className="w-4 h-4" />
        <span className="font-medium">Sign out</span>
      </div>
    </DropdownMenuItem>
  );
}