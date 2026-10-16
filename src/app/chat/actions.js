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

// Fetch messages from the database with user info
export async function getMessages(courseId, limit = 10, offset = 0) {
  try {
    const messages = db
      .prepare(`
        SELECT m.id, m.text, m.created_at, m.user_id, u.name AS user_name, m.edited_at
        FROM messages m
        LEFT JOIN users u ON m.user_id = u.id
        WHERE m.course_id = ?
        ORDER BY m.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .all(courseId, limit, offset);

    return messages;
  } catch (error) {
    console.error("Error reading messages:", error);
    return [];
  }
}