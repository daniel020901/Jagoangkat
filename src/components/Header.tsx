import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

import { getServerSession } from "../lib/get-session";
import  ShoppingCartIcon  from "./ShoppingCartIcon";

import { ModeToggle } from "./mode-toggle";
import {UserDropdown} from "./user-dropdown";

export default async function Header() {
  const session = await getServerSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background backdrop-blur supports-backdrop-filter:bg-background">
      <div className="w-full px-4 sm:px-8">
        <div className="flex h-16 items-center justify-between space-x-4 md:space-x-8 lg:space-x-12">
          <Link href="/" className="relative h-10 w-32 md:w-40">
            <Image
              src="/jagoangkat.png"
              alt="Jago Angkat Logo"
              fill
            className="border-muted object-contain "
              
            />
          </Link>

          <nav className="hidden md:flex items-center justify-center space-x-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-red-700 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-red-700 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-red-700 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-red-700 transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Shopping Cart"
            >
              <ShoppingCartIcon  />
            </Button>

            <ModeToggle />

            {/* Tampilkan UserDropdown hanya jika user login */}
            {user ? (
              <UserDropdown user={user} />
            ) : (
              <Button asChild>
                <Link href="/sign-in">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}