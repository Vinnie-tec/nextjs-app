import db from "@/lib/dbSetup";
import { broadcastMessage } from "./stream/route.js";

// -------------------------------------------------------------
// GET handler — used to fetch all messages from messages.json
// -------------------------------------------------------------
export async function GET() {
  try {
    const messages = db.prepare(`
    SELECT m.id, m.text, m.created_at, u.name AS user_name
    FROM messages m
    LEFT JOIN users u ON m.user_id = u.id
    ORDER BY m.id ASC
  `).all();

    // Return the messages as a JSON response
    return Response.json(messages);
  } catch (error) {
    // Log the error to the server console for debugging
    console.error("Error reading messages:", error);

    // Return a JSON response with an error message and 500 (Internal Server Error) status
    return Response.json({ error: "Failed to read messages" }, { status: 500 });    
  }
}

// -------------------------------------------------------------
// POST handler — used to add a new message to messages.json
// -------------------------------------------------------------
export async function POST(request) {
  try {
    // Extract JSON data from the incoming POST request
    const { text } = await request.json();

    // Randomly assign a user for demo
    const userIds = db.prepare("SELECT id FROM users").all().map(u => u.id);
    const randomUser = userIds[Math.floor(Math.random() * userIds.length)];

    // Insert the new message into the database
    const stmt = db.prepare("INSERT INTO messages (user_id, text) VALUES (?, ?)");
    const result = stmt.run(randomUser, text); // result includes metadata like the new record’s ID

    // Retrieve the newly inserted message
    const messageWithId = db
      .prepare(`
        SELECT m.id, m.text, m.created_at, u.name AS user_name
        FROM messages m
        LEFT JOIN users u ON m.user_id = u.id
        WHERE m.id = ?
      `)
      .get(result.lastInsertRowid); // `result.lastInsertRowid` gives us the auto-incremented ID

    // Broadcast newMessage to all connected clients
    broadcastMessage(messageWithId);

    // Return a success response with the newly created message
    return Response.json({
      success: true,
      message: "Message saved successfully!",
      data: messageWithId,
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error saving message:", error);

    // Return a JSON response with an error message and 500 status
    return Response.json({ error: "Failed to save message" }, { status: 500 });
  }
}