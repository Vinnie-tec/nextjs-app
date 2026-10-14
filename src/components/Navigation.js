'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { use, useState } from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { ThemeContext } from "@/context/ThemeContext";

export default function Navigation() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = use(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // ✅ Get current path

  // ✅ Function to check if link is active
  const isActive = (href) => {
    return pathname === href;
  };

  const themeToggleButton = (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-md text-sm bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-600 transition cursor-pointer"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );

  // ✅ Define navigation links once
  const navItems = [
    { href: "/", label: "Home" },
    // { href: "/about", label: "About" },
    { href: "/courses", label: "Courses" },
    { href: "/chat", label: "Course Chat Rooms" },
    { href: "/checkout", label: "Checkout" },
    // { href: "/about/team", label: "Our Team" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white dark:bg-slate-800 p-4 shadow">
      <nav className="flex justify-between items-center">
        {/* Left side — App pages */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden px-2 py-1 border rounded-md cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
          <ul
            className={clsx(
              // 🧩 Layout & structure
              "flex flex-col md:flex-row gap-4",

              // 🎨 Colors & text
              "text-gray-900 dark:text-gray-100",

              // 📐 Positioning & animation
              "absolute md:static transition-all",
              isOpen ? "top-16 left-4" : "top-[-500px]",

              // 🧱 Background & box styling
              "bg-white dark:bg-slate-800 md:bg-transparent p-4 md:p-0 shadow md:shadow-none"
            )}
          >
            {navItems.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    // 🧩 Base & spacing
                    "px-3 py-1 rounded-md transition",

                    // 📐 Layout & alignment
                    "flex items-center justify-center text-center",

                    // 🎨 Conditional styling based on active state
                    isActive(link.href)
                      ? clsx(
                        "bg-blue-600 text-white dark:bg-blue-600",
                        "hover:bg-blue-700 dark:hover:bg-blue-700"
                      )
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side — Theme toggle + Auth */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-gray-700 dark:text-gray-200">
                Hi  {session.user.name || session.user.email}
              </span>
              <button
                onClick={() => signOut()}
                className={clsx(
                  "px-3 py-1 text-sm rounded-md",
                  "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                )}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={clsx(
                  "px-3 py-1 text-sm rounded-md",
                  "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                )}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                Sign Up
              </Link>
            </>
          )}
          {/* Theme toggle */}
          {themeToggleButton}
        </div>
      </nav>
    </header>
  );
}
