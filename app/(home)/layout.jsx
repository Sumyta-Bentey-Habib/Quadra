import Navbar from "@/components/navigation/navbar/Navbar";
import LeftSidebar from "@/components/navigation/sidebar/LeftSidebar";
import RightSidebar from "@/components/navigation/sidebar/RightSidebar";
import React from "react";

const HomeLayout = ({ children }) => {
	return (
		<>
			<header>
				<Navbar />
			</header>
			<main className='flex relative'>
				{/* Left sidebar */}
				<LeftSidebar />
				<section className='flex min-h-screen flex-1 flex-col px-6 pt-10 max-md:pb-14 sm:px-14'>
					{/* Main content */}
					<div className='mx-auto w-full max-w-5xl'>{children}</div>
				</section>
				{/* Right sidebar */}
				<RightSidebar />
			</main>
			<footer>{/* Footer */}</footer>
		</>
	);
};

export default HomeLayout;
