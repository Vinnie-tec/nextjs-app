import db from "@/lib/db.Setup";
import { broadCastMessage } from "./stream/route";

export async function GET() {
  try {
    const messages = db
      .prepare(
        `
      SELECT m.id, m.text, m.created_at, u.name, AS user_name
      FROM message m
      LEFT JOIN users u ON m.user_id = u.id
      ORDER BY m.id ASC
      `,
      )
      .all();

    return Response.json(messages);
  } catch (error) {
    console.error("Error reading messages", error);

    return Response.json({ error: "Failed to read messages" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { text } = await request.json();

    const userIds = db.prepare('SELECT id FROM users').all().map((u) => u.id);
    const randomUser = userIds[Math.floor(Math.random() * userIds.length)]

    const statement = db.prepare("INSERT INTO messages (user_id, text) VALUES (?, ?)");
    const result = statement.run(randomUser, text);

    const messageWithId = db
      .prepare(`
         SELECT m.id, m.text, m.created_at, u.name, AS user_name
      FROM message m
      LEFT JOIN users u ON m.user_id = u.id
      WHERE m.id = ?
        `)
      .get(result.lastInsertRowid);

    broadCastMessage(messageWithId);

    return Response.json({
      success: true,
      message: "Message saved successfully",
      data: messageWithId,
    });
  } catch (error) {
    console.error("Error saving message", error);

    return Response.json({ error: "Failed to save Message" }, { status: 500 });
  }
}
