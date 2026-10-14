"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { sendResetEmail } from "./actions"; // server action
import SubmitButton from "@/components/ui/SubmitButton";
import FormError from "@/components/FormError";
import { inputClass } from "@/lib/styles";

// 🧩 Schema
const forgotPasswordSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    // 🕓 Start loading state (disables form and shows Sending...)
    setLoading(true);

    try {
      // 📨 Create a FormData object to send to the server action
      const formData = new FormData();
      formData.append("email", data.email);
      
      // 🚀 Call the server action to send the reset email
      const result = await sendResetEmail(formData);
      
      // ✅ If the action succeeded (even if the email doesn’t exist, to prevent leaks)
      if (result.success) {
        toast.success("If that email exists, a reset link has been sent!");
        reset(); // Clear the form after success
      }
      
      // ❌ If the server returned an error message
      else {
        toast.error(result.error || "Something went wrong");
      }

    } catch (error) {
      // 🧯 Catch any network or unexpected runtime errors
      console.error("Forgot password error:", error);
      toast.error("Request failed. Please try again.");
    } finally {
      // 🔚 Always stop loading state, even if an error occurred
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🔑 Forgot Password</h1>
      <p className="text-sm text-gray-600 mb-4">
        Enter your email and we’ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <input
            type="email"
            placeholder="Your email"
            {...register("email")}
            className={inputClass}
            disabled={loading}
          />
          <FormError>{errors.email?.message}</FormError>
        </div>

        <SubmitButton isLoading={loading} loadingText="Sending...">
          Send Reset Link
        </SubmitButton>
      </form>
    </div>
  );
}