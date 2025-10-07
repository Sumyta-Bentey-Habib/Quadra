import { ThemeToggler } from "@/components/Theme/ThemeToggler";
import NavLinks from "../navbar/NavLinks";
import Link from "next/link";
import ROUTES from "@/constants/routes";

const LeftSidebar = () => {
	return (
		<section className='sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto no-scrollbar border-r p-4 max-sm:hidden lg:w-64'>
			{/* Sidebar Content */}
			{/* Sidebar Link */}
			<nav>
				<Link href={ROUTES.HOME} className="max-lg:hidden">
					<p className="text-black dark:text-white font-black px-4 pb-4 text-xl border-b">Quadra</p>
				</Link>
				<NavLinks />
			</nav>
			{/* Sidebar Footer */}
			<div className='flex justify-end'>
				<ThemeToggler />
			</div>
		</section>
	);
};

export default LeftSidebar;
