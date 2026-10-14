'use client';

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "./actions";
import SubmitButton from "@/components/ui/SubmitButton";
import { inputClass } from "@/lib/styles";
import FormError from "@/components/FormError";

// ✅ Zod schema for new password validation
const passwordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password is too long" }),
});

export default function ResetPasswordPage() {
  const router = useRouter();
  
  // 🔍 Access URL query parameters in a client component
  // Needed to read the token from the password reset link
  const searchParams = useSearchParams();

  // 🏷️ Extract the "token" parameter from the URL query string
  // This token is required to verify the password reset request on the server
  const token = searchParams.get("token");

  // 🔄 Local state for loading
  const [loading, setLoading] = useState(false);

  // ✅ React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  // 📝 Form submission handler
  const onSubmit = async (data) => {
    // 🕓 Start loading state: disables the form and shows a spinner
    setLoading(true);

    try {
      // 📨 Create FormData to send to the server action
      // This ensures token and new password are properly formatted for the server
      const formData = new FormData();
      formData.append("token", token);          // Attach the reset token from URL
      formData.append("password", data.password); // Attach the new password

      // 🚀 Call the server action to reset the password
      const result = await resetPassword(formData);

      // ✅ If password reset succeeded
      if (result.success) {
        toast.success("Password reset successfully! You can now log in."); // Notify user
        reset();        // Clear the form fields
        router.push("/login"); // Redirect user to the login page
      }
      // ❌ If the server returned an error (e.g., invalid token or server error)
      else {
        toast.error(result.error || "Reset failed"); // Show error message
      }
    }
    // 🧯 Catch network or unexpected errors (e.g., server down)
    catch (err) {
      console.error(err);            // Log for debugging
      toast.error("Request failed"); // Show generic error to the user
    }
    finally {
      // 🔚 Stop loading state regardless of success or failure
      // Re-enables form inputs and buttons
      setLoading(false);
    }
  }

  // ⚠️ If token is missing, show error
  if (!token) {
    return <p className="p-6 text-center text-red-500">Invalid reset link.</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🔒 Reset Password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="New password"
          {...register("password")}
          className={inputClass}
          disabled={loading} // disable input while loading
        />
        <FormError>{errors.password?.message}</FormError>

        <SubmitButton isLoading={loading} loadingText="Resetting...">
          Reset Password
        </SubmitButton>
      </form>
    </div>
  );
}