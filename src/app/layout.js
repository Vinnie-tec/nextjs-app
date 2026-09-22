import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Course App",
  description: "Course App by Vincent",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screeen flex flex-col">
        <Navigation />

        <main className="grow p-6">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
