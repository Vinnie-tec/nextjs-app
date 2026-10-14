'use server';

import db from "@/lib/dbSetup";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";
import { z } from "zod";

// Zod schema for signup
const signupSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be under 50 characters" }),
  email: z.email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password is too long" }),
});

export async function signupUser(formData) {
  const name = formData.get("name")?.trim() || "";
  const email = formData.get("email")?.trim() || "";
  const password = formData.get("password")?.trim() || "";

  // Validate input using Zod
  const validation = signupSchema.safeParse({ name, email, password });
  if (!validation.success) {
    // Return the first validation error message if input is invalid
    const firstError = validation.error.errors[0];
    return { success: false, error: firstError.message };
  }

  // Check if user already exists
  const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (existingUser) {
    return { success: false, error: "Email already registered" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // Insert user into database
  const result = db.prepare(`
    INSERT INTO users (name, email, password, email_verified, verification_token, is_admin)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name, email, hashedPassword, 0, verificationToken, 0);

  // Fetch the newly created user's details from the database
  const newUser = db
    .prepare("SELECT id, name, email FROM users WHERE id = ?")
    .get(result.lastInsertRowid);

  // Send verification email
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${
    verificationToken
  }`;

  const html = `
    <h2>Welcome to Our App, ${name}!</h2>
    <p>Thanks for signing up! Please verify your email address by clicking below:</p>
    <p><a href="${verifyUrl}" target="_blank" style="color: blue;">Verify My Email</a></p>
    <p>If you didn’t create this account, you can safely ignore this email.</p>
  `;

  const emailSent = await sendEmail({ to: email, subject: "Verify your email address", html });

  if (!emailSent) {
    console.warn("⚠️ Email sending failed (Resend issue)");
  }

  return { success: true, user: newUser };
}