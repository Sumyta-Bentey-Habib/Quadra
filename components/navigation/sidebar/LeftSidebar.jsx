import { ThemeToggler } from "@/components/Theme/ThemeToggler";
import NavLinks from "../navbar/NavLinks";

const LeftSidebar = () => {
	return (
		<section className='sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r p-6 max-sm:hidden lg:w-64'>
			{/* Sidebar Content */}
			<div>
        <h1>Quadra Logo</h1>
      </div>
			{/* Sidebar Link */}
			<nav>
				<NavLinks />
			</nav>
			{/* Sidebar Footer */}
      <div className="flex justify-end">
        <ThemeToggler />
      </div>
		</section>
	);
};

export default LeftSidebar;
