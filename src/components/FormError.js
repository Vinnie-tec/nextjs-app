'use client';

export default function FormError({ children }) {
  if (!children) return null;

  return <p className="text-red-500 text-sm mt-1">{children}</p>;
}