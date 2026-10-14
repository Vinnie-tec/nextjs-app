'use client';

export default function SubmitButton({
  isLoading = false,
  children = "Submit",
  loadingText,
  ...props
}) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full px-4 py-2 rounded-md text-white transition ${
        isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      }`}
      {...props}
    >
      {isLoading ? (loadingText || children) : children}
    </button>
  );
}
