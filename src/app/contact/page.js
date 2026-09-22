"use client";

import toast from "react-hot-toast";

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully");
  };

  const inputClass =
    "border px-3 py-2 w-full rounded-md placeholder-gray-400 dark:placeholder-white/70";
  return (
    <div className="p-10 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <h1>Contact US</h1>
      <form className="space-y" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          className={inputClass}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className={inputClass}
          required
        />
        <textarea
          placeholder="Enter you message"
          className={inputClass}
          rows="4"
        ></textarea>
        <button
          type="submit"
          className={
            "bg-blue-600 text-white px-4 py-2 rounded-md" +
            '"hover:bg-blue-700 transition'
          }
        >
          Send
        </button>
      </form>
    </div>
  );
}
