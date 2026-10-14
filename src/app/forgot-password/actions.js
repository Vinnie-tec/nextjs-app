'use server';

import db from "@/lib/dbSetup";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";
import { z } from "zod";

// Zod schema for email
const emailSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
});

export async function sendResetEmail(formData) {
  // 📥 Extract the email field from the incoming FormData
  // Convert to string and trim whitespace to prevent invalid input
  const email = formData.get("email")?.toString().trim() || "";

   // ✅ Validate the email format using Zod (server-side safety check)
  const validation = emailSchema.safeParse({ email });
  if (!validation.success) {
    // If validation fails, return the first error message to the client
    const firstError = validation.error.errors[0];
    return { success: false, error: firstError.message };
  }

  // 🔍 Check if a user with this email exists in the database
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    // 🕵️ Security measure: don't reveal whether the email exists or not
    // Always return success to prevent account enumeration attacks
    return { success: true };
  }

  // 🔐 Generate a unique reset token and expiry timestamp
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 30).toISOString(); // 30 minutes from now

  // 💾 Store the reset token and expiry time in the user's database record
  db.prepare(`
    UPDATE users
    SET password_reset_token = ?, password_reset_expires = ?
    WHERE id = ?
  `).run(token, expires, user.id);

  // 🌐 Construct a secure password reset URL with the token
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  // 📧 Send password reset email with instructions and reset link
  await sendEmail({
    to: email,
    subject: "Reset your password",
    html: `
      <p>Hello ${user.name || ""},</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
      <p>This link will expire in 30 minutes.</p>
    `
  });

  // ✅ Return success response (do not include any sensitive data)
  return { success: true };
}