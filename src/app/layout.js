import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import ThemeProvider from "@/context/ThemeContext";

export const metadata = {
  title: "Course App",
  description: "Course App by Vincent",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <ThemeProvider>
          <Navigation />

          <main className="grow p-6">{children}</main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
