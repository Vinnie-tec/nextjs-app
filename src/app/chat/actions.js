"use server";

import db from "@/lib/dbSetup";

// ✅ Fetch all courses
export async function getCourses() {
  const courses = db.prepare(`
    SELECT *
    FROM courses
    ORDER BY id ASC
  `).all();

  return courses;
}