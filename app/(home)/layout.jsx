"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/navigation/navbar/Navbar";
import LeftSidebar from "@/components/navigation/sidebar/LeftSidebar";
import RightSidebar from "@/components/navigation/sidebar/RightSidebar";
import { usePathname } from "next/navigation";

const HomeContent = ({ children }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col min-h-screen mx-auto"
      >
        <header>
          <Navbar />
        </header>
        <main className="flex relative flex-1">
          <LeftSidebar />
          <section className="flex min-h-screen flex-1 flex-col max-md:pb-14">
            <div className="w-full">{children}</div>
          </section>
          {!pathname.startsWith("/messages") && <RightSidebar />}
        </main>
        <footer />
      </motion.div>
    </AnimatePresence>
  );
};

const HomeLayout = ({ children }) => (
  <SessionProvider>
    <HomeContent>{children}</HomeContent>
  </SessionProvider>
);

export default HomeLayout;
