"use client";

import React, { useState, useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/navigation/navbar/Navbar";
import LeftSidebar from "@/components/navigation/sidebar/LeftSidebar";
import RightSidebar from "@/components/navigation/sidebar/RightSidebar";
import CoverPage from "@/components/coverpage/Coverpage";
import { usePathname } from "next/navigation";

const HomeContent = ({ children }) => {
	const { data: session } = useSession();
	const [started, setStarted] = useState(false);
	const pathname = usePathname();
	// If user is already logged in, skip cover page
	useEffect(() => {
		if (session) setStarted(true);
	}, [session]);

	return (
		<AnimatePresence mode='wait'>
			{!started ? (
				<motion.div
					key='cover'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5 }}
					className='fixed inset-0 z-[999] w-full h-full'
				>
					<CoverPage onGetStarted={() => setStarted(true)} />
				</motion.div>
			) : (
				<motion.div
					key='home'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5 }}
					className='flex flex-col min-h-screen  mx-auto'
				>
					<header>
						<Navbar />
					</header>
					<main className='flex relative flex-1'>
						<LeftSidebar />
						<section className='flex min-h-screen flex-1 flex-col max-md:pb-14'>
							<div className='w-full'>{children}</div>
						</section>
						{!pathname.startsWith('/messages') && <RightSidebar />}
					</main>
					<footer />
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const HomeLayout = ({ children }) => (
	<SessionProvider>
		<HomeContent>{children}</HomeContent>
	</SessionProvider>
);

export default HomeLayout;
