'use server';

import db from "@/lib/dbSetup";
import bcrypt from "bcrypt";
import { z } from "zod";

// ✅ Zod schema for server-side validation
// Ensures both token and password meet basic requirements before touching the database
const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }), // Token must not be empty
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }) // Min length 8
    .max(100, { message: "Password is too long" }),                 // Max length 100
});

/**
 * Reset a user's password using a valid token.
 * @param {FormData} formData - Must include 'token' and 'password'
 */
export async function resetPassword(formData) {
  // 📝 Extract token and password from incoming FormData
  const token = formData.get("token");
  const password = formData.get("password");

  // ✅ Validate input using Zod schema
  const validation = resetPasswordSchema.safeParse({ token, password });
  if (!validation.success) {
    // If validation fails, return first error to client
    const firstError = validation.error.errors[0];
    return { success: false, error: firstError.message };
  }

  try {
    // 🔍 Look up the user by token and ensure token hasn't expired
    const user = db
      .prepare(
        "SELECT * FROM users WHERE password_reset_token = ? AND password_reset_expires > ?"
      )
      .get(token, new Date().toISOString());

    if (!user) {
      // ❌ No user found or token expired
      return { success: false, error: "Invalid or expired token" };
    }

    // 🔐 Hash the new password securely using bcrypt
    const hashed = await bcrypt.hash(password, 10);

    // 💾 Update the user's password and clear the reset token & expiry
    db.prepare(`
      UPDATE users
      SET password = ?, password_reset_token = NULL, password_reset_expires = NULL
      WHERE id = ?
    `).run(hashed, user.id);

    // ✅ Return success
    return { success: true };
  } catch (err) {
    // 🧯 Catch any unexpected errors (e.g., DB errors)
    console.error("Reset password error:", err);
    return { success: false, error: "Failed to reset password" };
  }
}