"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogIn, Upload } from "lucide-react";
import { useAlertDialog } from "@/components/hooks/use-alert-dialog";
import { useState } from "react";

export default function LoginForm({ mode = "login" }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // New: selected file

  // --- Form schema ---
  const formSchema =
    mode === "signup"
      ? z.object({
          name: z.string().min(1, { message: "Name is required" }),
          email: z.string().email({ message: "Enter a valid email" }),
          password: z.string().min(6, { message: "Password must be at least 6 characters" }),
          photoUrl: z.string().optional(),
        })
      : z.object({
          email: z.string().email({ message: "Enter a valid email" }),
          password: z.string().min(6, { message: "Password must be at least 6 characters" }),
        });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues:
      mode === "signup"
        ? { name: "", email: "", password: "", photoUrl: "" }
        : { email: "", password: "" },
  });

  const { showAlert, AlertDialogUI } = useAlertDialog();

  // --- Handle file selection ---
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // --- Handle Cloudinary upload on button click ---
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "project_quadra"); 

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dizstnwr7/image/upload`, 
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        form.setValue("photoUrl", data.secure_url);
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  // --- Form submission ---
  async function onSubmit(values) {
    if (mode === "login") {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (res?.error) {
        showAlert({
          title: "Login Failed",
          description: "Invalid email or password",
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
    } else {
      // --- Signup ---
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (res.ok) {
          // Automatically sign in after successful signup
          const loginRes = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
          });

          if (loginRes?.error) {
            showAlert({
              title: "Account Created!",
              description: "Please login manually",
              confirmText: "Go to Login",
              onConfirm: () => router.push("/login"),
            });
          } else {
            showAlert({
              title: "Account Created!",
              description: "You are now logged in.",
              confirmText: "Go Home",
              onConfirm: () => router.push("/"),
            });
          }
        } else {
          showAlert({
            title: "Signup Failed",
            description: data.error || "Something went wrong",
            confirmText: "Try Again",
          });
        }
      } catch (err) {
        showAlert({
          title: "Signup Failed",
          description: "Something went wrong",
          confirmText: "Try Again",
        });
      }
    }
  }

  // --- Google Login ---
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md mx-auto">
        {/* Name field for signup */}
        {mode === "signup" && (
          <div>
            <Input placeholder="Name" {...form.register("name")} className="w-full" />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
        )}

        {/* Email */}
        <div>
          <Input placeholder="Email" {...form.register("email")} className="w-full" />
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>

        {/* Password */}
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

        {/* Cloudinary Upload Button (Signup only) */}
        {mode === "signup" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              Profile Photo
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange} // only select file
                className="text-sm text-gray-500"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>
              {form.watch("photoUrl") && (
                <img
                  src={form.watch("photoUrl")}
                  alt="Preview"
                  className="w-10 h-10 rounded-full object-cover border"
                />
              )}
            </div>
          </div>
        )}

        <Button type="submit" className="w-full py-2">
          {mode === "login" ? "Sign In" : "Register"}
        </Button>

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
