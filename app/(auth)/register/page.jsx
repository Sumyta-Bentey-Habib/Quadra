"use client";

import React from "react";
import LoginForm from "@/components/forms/LoginForm";
import Lottie from "lottie-react";
import registerAnimation from "@/components/lottie/register.json";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { LogIn } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-xl font-bold">
          You are already logged in as {session.user.email}
        </h2>
        <Button
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          Go to Home
        </Button>
      </div>
    );
  }

  const handleRegisterSuccess = () => {
    Swal.fire({
      title: "Registered!",
      text: "Your account has been created.",
      icon: "success",
      showConfirmButton: true,
    }).then(() => {
      router.push("/"); // Redirect to HOME page 
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl grid md:grid-cols-2">
        {/* Lottie Animation */}
        <div className="hidden md:flex items-center justify-center p-6">
          <Lottie animationData={registerAnimation} loop={true} />
        </div>

        {/* Register Form */}
        <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
          <h1 className="text-2xl font-bold text-center mb-4">Register</h1>

          <LoginForm mode="signup" onSuccess={handleRegisterSuccess} />

          {/* Google login */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 mt-2"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <LogIn className="w-5 h-5" /> Continue with Google
          </Button>

          {/* Links */}
          <div className="flex justify-between mt-4">
            <p className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
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
