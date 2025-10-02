"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/navigation/navbar/Navbar";
import LeftSidebar from "@/components/navigation/sidebar/LeftSidebar";
import RightSidebar from "@/components/navigation/sidebar/RightSidebar";

const HomeLayout = ({ children }) => {
  return (
    <SessionProvider>
      <header>
        <Navbar />
      </header>
      <main className="flex relative">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col px-6 pt-10 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <RightSidebar />
      </main>
      <footer />
    </SessionProvider>
  );
};

export default HomeLayout;
