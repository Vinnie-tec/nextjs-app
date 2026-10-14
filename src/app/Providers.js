'use client';

import { SessionProvider } from "next-auth/react";
import ThemeProvider from "@/context/ThemeContext";
import ToasterClient from "@/components/ToasterClient";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
        <ToasterClient />
      </ThemeProvider>
    </SessionProvider>
  );
}