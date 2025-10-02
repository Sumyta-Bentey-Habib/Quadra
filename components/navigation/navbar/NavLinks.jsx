"use client";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import React from "react";
import NavLink from "./NavLink";
import { cn } from "@/lib/utils";

const NavLinks = ({ isMobileNav = false }) => {
	const pathname = usePathname();
	return (
		<nav className={cn(isMobileNav && "flex justify-around border-b sticky z-50 top-0 left-0 right-0 w-full")}>
			{sidebarLinks.map((item) => {
				const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;
				if (item.route === "/profile") {
					item.route = `${item.route}/1`;
				}
                return (
                    <NavLink key={item.label} item={item} isActive={isActive} isMobileNav={isMobileNav}></NavLink>
                );
			})}
		</nav>
	);
};

export default NavLinks;
