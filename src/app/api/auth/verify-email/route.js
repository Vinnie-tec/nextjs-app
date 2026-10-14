import db from "@/lib/dbSetup";

export async function GET(request) {
  // Extract the "token" query parameter from the URL
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // If no token is provided, return a 400 Bad Request response
  if (!token) {
    return Response.json({ error: "Missing token" }, { status: 400 });
  }

  // Look up the user in the database by their verification token
  const user = db.prepare("SELECT * FROM users WHERE verification_token = ?").get(token);

  // If no matching user is found, the token is invalid or expired
  if (!user) {
    return Response.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  // Mark the user's email as verified and clear the verification token
  db.prepare(
    "UPDATE users SET email_verified = 1, verification_token = NULL WHERE id = ?"
  ).run(user.id);

  // Redirect the user to the email verification success page
  return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-email/success`);
}