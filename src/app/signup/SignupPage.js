'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signupUser } from "./actions"; // server action
import SubmitButton from "@/components/ui/SubmitButton";
import { inputClass } from "@/lib/styles";
import FormError from "@/components/FormError";

// ✅ Define schema for Zod
const signupSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be under 50 characters" }),
  email: z.email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password is too long" }),
});

export default function SignupPage() {
  const router = useRouter();

  // ✅ Setup React Hook Form with Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);

      // Call the server action from action.js to create a new user account
      const result = await signupUser(formData);

      if (result.success) {
        toast.success("Signup successful! Check your inbox to verify your email.");
        // Reset the form
        reset();
        // Redirect the user to the email verification page
        router.push("/verify-email");
      } else{
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(err.message || "Signup failed — please try again.");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Create an Account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Full Name"
            {...register("name")}
            className={inputClass}
          />
          <FormError>{errors.name?.message}</FormError>
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email Address"
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
        <SubmitButton isLoading={isSubmitting} loadingText="Signing up...">
          Sign Up
        </SubmitButton>
      </form>

      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="px-2 text-gray-500 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* OAuth Signup Buttons */}
      <div className="mt-6 flex flex-col gap-3">
        {/* Google Signup */}
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
          <span className="font-medium">Sign up with Google</span>
        </button>

        {/* GitHub Signup */}
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
          <span>Sign up with GitHub</span>
        </button>
      </div>
    </div>
  );
}