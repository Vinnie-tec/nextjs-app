import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/message.json");

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");

    const messages = JSON.parse(data);

    return Response.json(messages);
  } catch (error) {
    console.error("Error reading messages", error);

    return Response.json({ error: "Failed to read messages" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newMessages = await request.json();

    const data = await fs.readFile(filePath, "utf8");

    const messages = JSON.parse(data);

    const messageWithId = {
      id: messages.length ? messages[messages.length - 1].id + 1 : 1,
      text: newMessages.text,
    };

    messages.push(messageWithId);

    await fs.writeFile(filePath, JSON.stringify(messages, null, 2));

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
