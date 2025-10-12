"use client";

import React from "react";
import LoginForm from "@/components/forms/LoginForm";
import Lottie from "lottie-react";
import loginAnimation from "@/components/lottie/login.json";
import { ThemeToggler } from "@/components/Theme/ThemeToggler";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl grid md:grid-cols-2 relative overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggler />
        </div>

        <div className="flex items-center justify-center p-6">
          <Lottie animationData={loginAnimation} loop className="w-full max-w-sm" />
        </div>

        <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">Login</h1>
          <LoginForm mode="login" />

          {/* Links */}
          <div className="flex justify-center gap-4 mt-4 text-sm">
              Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
