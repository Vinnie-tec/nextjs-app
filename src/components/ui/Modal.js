// CLient component - handles interactivity and layout
"use client";

import { useState } from "react";

export default function Modal({ children }) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-blue-900 rounded-lg p-6 shadow-lg max-w-md w-full relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 𝘁𝗲𝘅𝘁-𝘅𝗹"
          onClick={() => setOpen(false)}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
