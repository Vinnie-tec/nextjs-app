export const metadata = {
  title: "Verify Your Email | Vinnie",
  description: "Check your email for the verification link from Vinnie to activate your account",
};

export default function VerifyEmailPage() {
  return (
    <div className="max-w-lg mx-auto mt-20 text-center">
      <h1 className="text-3xl font-bold mb-4">📨 Check Your Email</h1>
      <p className="text-gray-600">
        We’ve sent you a verification link. Please click it to activate your account.
      </p>
    </div>
  );
}
