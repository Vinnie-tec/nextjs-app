"use client";

import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.email({ message: "Please enter a valid email address" }),
  message: z
    .string()
    .min(5, { message: "Message must be at least 5 characters" }),
});

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Message sent successfully");
        reset();
      } else {
        toast.error(
          result.message || "Failed to send messsage. Please try again",
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const inputClass =
    "border px-3 py-2 w-full rounded-md placeholder-gray-400 dark:placeholder-white/70";
  return (
    <div className="p-10 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <h1>Contact US</h1>
      <form className="space-y" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Your Name"
          className={inputClass}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
        <input
          type="email"
          placeholder="Your Email"
          className={inputClass}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
        <textarea
          placeholder="Enter you message"
          className={inputClass}
          rows="4"
          {...register("message")}
        ></textarea>
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={
            "bg-blue-600 text-white px-4 py-2 rounded-md" +
            '"hover:bg-blue-700 transition'
          }
        >
          {isSubmitting ? "Sending" : "Send"}
        </button>
      </form>
    </div>
  );
}
