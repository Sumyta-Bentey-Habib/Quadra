"use client";

import React from "react";
import LoginForm from "@/components/forms/LoginForm";
import Lottie from "lottie-react";
import loginAnimation from "@/components/lottie/login.json";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = (email) => {
    
    console.log("Logged in:", email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl grid md:grid-cols-2">
        {/* Lottie Animation */}
        <div className="hidden md:flex items-center justify-center p-6">
          <Lottie animationData={loginAnimation} loop={true} />
        </div>

        {/* Login Form */}
        <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
          <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

          <LoginForm mode="signin" onSuccess={handleLoginSuccess} />

          {/* Links */}
          <div className="flex justify-between mt-4">
            <p className="text-sm">
              Don’t have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              className="text-sm flex items-center gap-1"
            >
              <LogIn className="w-4 h-4" /> Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
