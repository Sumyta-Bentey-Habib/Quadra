"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { LogIn } from "lucide-react";

// Validation schema
const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginForm({ mode, onSuccess }) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values) {
    try {
      if (mode === "signup") {
        // Sign up
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const err = await res.json();
          Swal.fire({
            title: "Error!",
            text: err.message || "Failed to register",
            icon: "error",
            showConfirmButton: true,
          });
          return;
        }

        Swal.fire({
          title: "Registered!",
          text: "Your account has been created.",
          icon: "success",
          showConfirmButton: true,
        });

        onSuccess?.();
      } else {
        // Sign in
        const res = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (res?.error) {
          Swal.fire({
            title: "Login failed",
            text: res.error,
            icon: "error",
            showConfirmButton: true,
          });
        } else {
          // Successful login
          Swal.fire({
            title: "Logged in!",
            html: `<span style="display:flex; align-items:center; gap:5px;">
                    <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-check-circle" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Welcome back, ${values.email}</span>`,
            showConfirmButton: true,
          }).then(() => {
            onSuccess?.(values.email);
            router.push("/");
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong",
        icon: "error",
        showConfirmButton: true,
      });
    }
  }

  const handleGoogleLogin = () => {
    signIn("google", {
      callbackUrl: "/",
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {mode === "signup" && (
        <div>
          <Input placeholder="Name" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
          )}
        </div>
      )}

      <div>
        <Input placeholder="Email" {...form.register("email")} />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div>
        <Input type="password" placeholder="Password" {...form.register("password")} />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        {mode === "signup" ? "Sign Up" : "Sign In"}
      </Button>

      {mode === "signin" && (
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2 mt-2"
          onClick={handleGoogleLogin}
        >
          <LogIn className="w-5 h-5" /> Continue with Google
        </Button>
      )}
    </form>
  );
}
