// Purpose: stream messages to connected clients using SSE

let clients = []; // list of connected clients

export async function GET() {
  let client;

  const stream = new ReadableStream({
    start(controller) {
      client = { controller };
      clients.push(client);

      controller.enqueue(
        encode(`data: ${JSON.stringify({ type: "connected" })} \n\n`),
      );
    },
    cancel() {
      clients = clients.filter((c) => c != client);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",

      "Cache-Control": "no-cache, no-transform",

      Connection: 'keep-alive'
    },
  });
}


function encode(str) {
    return new TextEncoder().encode(str)
}

export function broadCastMessage(msg) {
    const data = `data: ${JSON.stringify(msg)}\n\n`
    const encoded = encode(data)

    for (const client of clients) {
        try {
            clients.controller.enqueue(encoded);

        } catch (error) {
            // ignore if client has disconnected
        }
    }
}