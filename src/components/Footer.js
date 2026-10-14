export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-center py-4 mt-auto">
      <p>© {new Date().getFullYear()} My Next.js App — Built with ❤️ using Next.js 16</p>
    </footer>
  );
}