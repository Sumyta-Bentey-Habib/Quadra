"use client";

import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import React from "react";
import NavLink from "./NavLink";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";

const NavLinks = ({ isMobileNav = false }) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav
      className={cn(
        isMobileNav &&
          "flex justify-around border-b sticky z-50 top-0 left-0 right-0 w-full"
      )}
    >
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        if (item.route === "/profile") {
          item.route = `${item.route}/1`; // mock profile
        }

        return (
          <NavLink
            key={item.label}
            item={item}
            isActive={isActive}
            isMobileNav={isMobileNav}
          />
        );
      })}

      {/*  Auth Buttons */}
      {!session ? (
        <Link
          href="/login"
          className="flex items-center gap-2 p-4 rounded-2xl text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <LogIn className="h-5 w-5" />
          <p className={cn("max-lg:hidden", isMobileNav && "hidden")}>Login</p>
        </Link>
      ) : (
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 p-4 rounded-2xl text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <LogOut className="h-5 w-5" />
          <p className={cn("max-lg:hidden", isMobileNav && "hidden")}>Logout</p>
        </button>
      )}
    </nav>
  );
};

export default NavLinks;
