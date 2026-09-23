import db from "@/lib/db";
import { broadCastMessage } from "./stream/route";


export async function GET() {
  try {
    const messages = db
      .prepare("SELECT id, text, created_at, FROM messages ORDER BY id ASC")
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

    const statement = db.prepare("INSERT INTO messages (text) VALUES (?)");
    const result = statement.run(text);

    const messageWithId = db
      .prepare("SELECT * FROM messages WHERE id = ?")
      .get(result.lastInsertRowid);


    broadCastMessage(messageWithId)

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
