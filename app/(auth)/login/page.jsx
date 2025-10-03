"use client";

import React from "react";
import LoginForm from "@/components/forms/LoginForm";
import Lottie from "lottie-react";
import loginAnimation from "@/components/lottie/login.json";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { ThemeToggler } from "@/components/Theme/ThemeToggler";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl grid md:grid-cols-2 relative overflow-hidden">

        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggler />
        </div>

        {/* Lottie Animation */}
        <div className="flex items-center justify-center p-6">
          <Lottie animationData={loginAnimation} loop className="w-full max-w-sm" />
        </div>

        {/* Login Form */}
        <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">Login</h1>

          <LoginForm mode="signin" />

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
            <p className="text-sm text-center sm:text-left">
              Don’t have an account?{" "}
              <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
                Register
              </Link>
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              className="text-sm flex items-center gap-1 w-full sm:w-auto justify-center"
            >
              <LogIn className="w-4 h-4" /> Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
