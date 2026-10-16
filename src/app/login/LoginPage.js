'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import FormError from "@/components/FormError";
import SubmitButton from "@/components/ui/SubmitButton";
import { inputClass } from "@/lib/styles";

// ✅ Zod v5 schema for login
const loginSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export default function LoginPage() {
  const router = useRouter();

  // Initialize form handling with React Hook Form and Zod validation
  const {
    register,           // Function to register form inputs
    handleSubmit,       // Handles form submission
    reset,              // Resets form fields after submit
    formState: { errors, isSubmitting }, // Provides form state (errors, loading, etc.)
  } = useForm({
    resolver: zodResolver(loginSchema), // Apply Zod validation via the resolver
  });

  // Define the function to run when the form is submitted
  const onSubmit = async (data) => {
    // Attempt to sign in using NextAuth with "credentials" provider
    const res = await signIn("credentials", {
      redirect: false, // Prevent automatic redirect after login
      email: data.email, // Send email from form data
      password: data.password, // Send password from form data
    });

    // Check if sign-in failed
    if (res?.error) {
      // Show an error toast if authentication failed
      toast.error("Invalid email or password");
    } else {
      // Show a success toast if authentication succeeded
      toast.success("Login successful!");
      // Redirect user to the chat page
      router.push("/chat");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="p-8 border rounded-lg shadow-md bg-white dark:bg-gray-800 w-80">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={inputClass}
            />
            <FormError>{errors.email?.message}</FormError>
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={inputClass}
            />
            <FormError>{errors.password?.message}</FormError>
          </div>

          {/* Submit Button */}
          <SubmitButton isLoading={isSubmitting} loadingText="Logging in...">
            Login
          </SubmitButton>
          
        </form>

        {/* OAuth Login Buttons */}
      <div className="mt-6 flex flex-col gap-3">
        {/* Google Login */}
        <button
          type="button"
          onClick={() => signIn("google")}
          className={clsx(
            // --- Layout & structure ---
            "w-full py-2 border rounded-md flex justify-center items-center gap-2",
            "transition shadow-sm font-medium cursor-pointer",

            // --- Light mode colors ---
            "bg-white text-gray-700 hover:bg-gray-100",

            // --- Dark mode colors ---
            "dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
          )}
        >
          <FcGoogle size={22} />
          <span className="font-medium">Login with Google</span>
        </button>

        {/* GitHub Login */}
        <button
          type="button"
          onClick={() => signIn("github")}
          className={clsx(
            // --- Layout & structure ---
            "w-full py-2 rounded-md border flex justify-center items-center gap-2",

            // --- Colors & dark mode ---
            "bg-black text-white hover:bg-gray-900",
            "dark:bg-gray-950 dark:hover:bg-black",

            // --- Interaction & transitions ---
            "transition shadow-sm font-medium cursor-pointer"
          )}
        >
          <FaGithub size={22} />
          <span>Login with GitHub</span>
        </button>
      </div>

        {/* Forgot password link */}
        <p className="text-sm text-center mt-4">
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
}