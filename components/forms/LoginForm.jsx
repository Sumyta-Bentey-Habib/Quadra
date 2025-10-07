"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { useAlertDialog } from "@/components/hooks/use-alert-dialog";




const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  photoUrl: z.string().url({ message: "Enter a valid URL" }).optional(),
});

export default function LoginForm({ mode }) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", photoUrl: "" },
  });

  const { showAlert, AlertDialogUI } = useAlertDialog();

  async function onSubmit(values) {
    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const err = await res.json();
          showAlert({
            title: "Error!",
            description: err.error || "Failed to register",
            confirmText: "Close",
          });
          return;
        }

        showAlert({
          title: "Registered!",
          description: "Your account has been created.",
          confirmText: "Go Home",
          onConfirm: () => router.push("/"),
        });
      } else {
        const res = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (res?.error) {
          showAlert({
            title: "Login Failed",
            description: res.error,
            confirmText: "Try Again",
          });
        } else {
          showAlert({
            title: "Logged in!",
            description: `Welcome back, ${values.email}`,
            confirmText: "Go Home",
            onConfirm: () => router.push("/"),
          });
        }
      }
    } catch (error) {
      showAlert({
        title: "Error",
        description: error.message || "Something went wrong",
      });
    }
  }

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md mx-auto">
        {/* Signup-only fields */}
        {mode === "signup" && (
          <>
            <div>
              <Input placeholder="Name" {...form.register("name")} className="w-full" />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Profile Photo URL (optional)"
                {...form.register("photoUrl")}
                className="w-full"
              />
              {form.formState.errors.photoUrl && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.photoUrl.message}</p>
              )}
            </div>
          </>
        )}

        {/* Email (always visible) */}
        <div>
          <Input placeholder="Email" {...form.register("email")} className="w-full" />
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>

        {/* Password (always visible) */}
        <div>
          <Input
            type="password"
            placeholder="Password"
            {...form.register("password")}
            className="w-full"
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full py-2">
          {mode === "signup" ? "Sign Up" : "Sign In"}
        </Button>

        {/* Google Login always visible */}
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2 mt-2 py-2"
          onClick={handleGoogleLogin}
        >
          <LogIn className="w-5 h-5" /> Continue with Google
        </Button>
      </form>

      {AlertDialogUI}
    </>
  );
}
