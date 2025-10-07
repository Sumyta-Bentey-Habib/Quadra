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
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const { showAlert, AlertDialogUI } = useAlertDialog();

  async function onSubmit(values) {
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
  }

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md mx-auto">
        <div>
          <Input placeholder="Email" {...form.register("email")} className="w-full" />
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>

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

        <Button type="submit" className="w-full py-2">
          Sign In
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
