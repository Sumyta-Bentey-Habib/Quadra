"use client";

import Link from "next/link";
import Lottie from "lottie-react";
import notFoundAnim from "@/components/lottie/404.json";
import { ThemeToggler } from "@/components/Theme/ThemeToggler";

export default function NotFoundPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center 
      bg-gradient-to-br from-purple-100 via-white to-purple-200 
      dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      
      {/* Theme Toggle (top-right) */}
      <div className="absolute top-4 right-4">
        <ThemeToggler />
      </div>

      {/* Animation */}
      <Lottie animationData={notFoundAnim} loop={true} className="w-72 h-72" />

      {/* Title */}
      <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-400 mt-6">
        Oops! Page Not Found
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 dark:text-gray-300 mt-2">
        The page you are looking for doesn’t exist.
      </p>

      {/* Back Home Button */}
      <Link
        href="/"
        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md transition 
        dark:bg-purple-500 dark:hover:bg-purple-600"
      >
        Back to Home
      </Link>
    </div>
  );
}
