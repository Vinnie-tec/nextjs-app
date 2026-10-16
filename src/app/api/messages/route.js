import db from "@/lib/dbSetup";
import { broadcastMessage } from "./stream/route.js";
import { getServerSession } from "next-auth"; // ✅ To get logged-in user session
import { authOptions } from "../auth/[...nextauth]/route"; // ✅ Import NextAuth config

// -------------------------------------------------------------
// GET handler — used to fetch all messages from messages.json
// -------------------------------------------------------------
// export async function GET() {
//   try {
//     const messages = db.prepare(`
//     SELECT m.id, m.text, m.created_at, u.name AS user_name
//     FROM messages m
//     LEFT JOIN users u ON m.user_id = u.id
//     ORDER BY m.id ASC
//   `).all();

//     // Return the messages as a JSON response
//     return Response.json(messages);
//   } catch (error) {
//     // Log the error to the server console for debugging
//     console.error("Error reading messages:", error);

//     // Return a JSON response with an error message and 500 (Internal Server Error) status
//     return Response.json({ error: "Failed to read messages" }, { status: 500 });    
//   }
// }

// -------------------------------------------------------------
// POST handler — used to add a new message to messages.json
// -------------------------------------------------------------
export async function POST(request) {
  try {
    // ✅ Get the current logged-in user session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      // If no user is logged in, reject the request
      return Response.json(
        { error: "Unauthorized: Please sign in to post a message" },
        { status: 401 }
      );
    }

    // Extract message data from request body
    const { text, course_id } = await request.json();

    if (!text?.trim()) {
      return Response.json(
        { error: "Message text is required" },
        { status: 400 }
      );
    }

    if (!course_id) {
      return Response.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Insert the message linked to the logged-in user and course
    const stmt = db.prepare(
      "INSERT INTO messages (user_id, course_id, text) VALUES (?, ?, ?)"
    );
    const result = stmt.run(session.user.id, course_id, text);

    // Retrieve the newly inserted message with user info
    const newMessage = db
      .prepare(`
        SELECT m.id, m.text, m.created_at, m.user_id, u.name AS user_name, m.course_id
        FROM messages m
        LEFT JOIN users u ON m.user_id = u.id
        WHERE m.id = ?
      `)
      .get(result.lastInsertRowid);

    // Broadcast new message to all connected clients (SSE) - Will be done in the next session
    broadcastMessage({
      type: "new",
      data: newMessage,
    });

    // Return success response
    return Response.json({
      success: true,
      message: "Message saved successfully!",
    });
  } catch (error) {
    console.error("Error saving message:", error);
    return Response.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}


// -------------------------------------------------------------
// DELETE handler — Remove a message by its author
// -------------------------------------------------------------
export async function DELETE(request) {
  try {
    // 🔐 Get the current authenticated user session from NextAuth
    const session = await getServerSession(authOptions);

    // 🚫 If there's no authenticated user, return a 401 Unauthorized response
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 📦 Parse the JSON body from the DELETE request to extract the message ID
    const { id } = await request.json();

    // ⚠️ If no message ID is provided, return a 400 Bad Request error
    if (!id) {
      return Response.json({ error: "Message ID required" }, { status: 400 });
    }

    // 🔍 Look up the message in the database by its ID
    const message = db.prepare("SELECT * FROM messages WHERE id = ?").get(id);

    // 🚫 If the message doesn't exist, or the user doesn’t own it, deny access
    if (!message || message.user_id !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 🗑️ Delete the message from the database
    db.prepare("DELETE FROM messages WHERE id = ?").run(id);

    // 🔔 Notify all connected clients via Server-Sent Events (SSE)
    // that a message was deleted, so they can update their UIs in real-time
    broadcastMessage({
      type: "delete",
      data: { id },
    });

    // ✅ Return a success response
    return Response.json({
      success: true,
      message: "Message deleted successfully!",
    });
  } catch (error) {
    // 💥 Handle any unexpected errors (e.g., DB issues)
    console.error("Error deleting message:", error);
    return Response.json({ error: "Failed to delete message" }, { status: 500 });
  }
}

