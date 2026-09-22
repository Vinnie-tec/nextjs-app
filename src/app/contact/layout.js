export default function ContactLayout({ children }) {
  return (
    <div className="flex fles-col bg-blue-50">
      <header className="bg-blue-200 p-4 text-center font-semibold shadow">
        <h2>Contact Us</h2>
      </header>

      <main className="grow p-6">{children}</main>
    </div>
  );
}
