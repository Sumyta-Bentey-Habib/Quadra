"use client";
import React from "react";
import { TypeAnimation } from "react-type-animation";
import { FaComments, FaHeart, FaShareAlt, FaArrowRight } from "react-icons/fa";

const CoverPage = ({ onGetStarted }) => {
  return (
    <section className="min-h-screen flex flex-col justify-between items-center text-center bg-gradient-to-b from-white to-gray-100 dark:from-[#0D0D0D] dark:to-[#1A1A1A] text-gray-900 dark:text-gray-100 p-6 relative overflow-hidden">
      
      {/* Top Section */}
      <div className="pt-10 z-10 relative">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
          Quadra
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Connect. Share. Inspire.
        </p>
      </div>

      {/* Middle Section */}
      <div className="flex flex-col items-center justify-center flex-1 space-y-6 z-10 relative">
        <TypeAnimation
          sequence={["Connect.", 1200, "Share.", 1200, "Inspire.", 1200]}
          wrapper="h2"
          repeat={Infinity}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
        />

        <p className="max-w-xl text-gray-700 dark:text-gray-300 text-lg mt-4 leading-relaxed">
          Join the next generation of social connection.  
          Where authentic conversations meet beautiful design.
        </p>

        {/* Floating Icons */}
        <div className="flex gap-12 text-4xl mt-6 text-blue-600 dark:text-blue-400">
          <div className="animate-bounce-slow"><FaComments /></div>
          <div className="animate-bounce-slower"><FaHeart /></div>
          <div className="animate-bounce-fast"><FaShareAlt /></div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4 pb-12 z-10 relative">
        <button
          onClick={onGetStarted}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium text-lg transition"
        >
          Get Started <FaArrowRight />
        </button>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Join thousands of users already on <span className="font-semibold">Quadra</span>.
        </p>
      </div>

      {/* Footer */}
      <footer className="w-full text-center border-t border-gray-200 dark:border-gray-700 py-4 text-xs text-gray-500 dark:text-gray-400 z-10 relative">
        © 2024 Quadra. Connecting the world, one post at a time.
      </footer>

      {/* Background Circles */}
      <div className="absolute inset-0">
        <div className="absolute w-6 h-6 bg-blue-200 dark:bg-blue-800 opacity-40 rounded-full top-[10%] left-[5%] animate-float-slow"></div>
        <div className="absolute w-8 h-8 bg-blue-200 dark:bg-blue-800 opacity-40 rounded-full top-[30%] left-[85%] animate-float-slower"></div>
        <div className="absolute w-7 h-7 bg-blue-200 dark:bg-blue-800 opacity-40 rounded-full top-[70%] left-[20%] animate-float-fast"></div>
      </div>
    </section>
  );
};

export default CoverPage;
