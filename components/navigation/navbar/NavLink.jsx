import { cn } from "@/lib/utils";
import Link from "next/link";

const NavLink = ({ item, isActive, isMobileNav }) => {
	const Icon = item.icon;
	return (
		<Link
			href={item.route}
			key={item.label}
			className={cn(
				isActive
					? "bg-gray-200 dark:bg-gray-800 text-black dark:text-white font-black"
					: "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium",
				"flex items-center justify-start gap-4 bg-transparent p-4 rounded-2xl",
			)}
		>
			<Icon className={cn({ "invert-colors": !isActive }, "h-6 w-6")} />
			<p className={cn(isActive ? "font-bold" : "font-medium", "max-lg:hidden", isMobileNav && "hidden")}>{item.label} {isActive && <span className="animate-pulse">•</span>}</p>
		</Link>
	);
};

export default NavLink;
