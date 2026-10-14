// -------------------------------------------------------------
// API Route: /api/messages/stream
// Purpose: Stream messages to connected clients using SSE
// -------------------------------------------------------------

let clients = []; // List of connected clients

// define the /api/messages/stream API route
export async function GET() {
  let client; // Define client outside so cancel() can access it

  // create a stream of data that can be read incrementally.
  const stream = new ReadableStream({
    start(controller) {
      // Create a new "client" object that holds a reference to the
      // `controller`, which allows the server to send data to this client.
      // Each connected client will have its own controller.
      client = { controller };

      // Store this client in the global `clients` array.
      // This allows the server to broadcast new messages to all
      // connected clients later.
      clients.push(client);

      // Send initial message to confirm connection
      controller.enqueue(encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`));

      // The browser will close the connection when the tab closes or refreshes
    },
    cancel() {
      // This runs when the client disconnects
      // Remove the client when they disconnect
      clients = clients.filter((c) => c !== client);    
    },
  });   

  return new Response(stream, {
    headers: {
      // Required header for SSE — 
      // tells the browser to expect a continuous event stream
      "Content-Type": "text/event-stream",
      // Prevent intermediaries (like proxies or CDNs) from caching the connection.
      // SSE is a *live* stream, so caching would break real-time updates.
      "Cache-Control": "no-cache, no-transform",
      // Keeps the HTTP connection open indefinitely.
      Connection: "keep-alive",
    },
  });
}

// Utility helper: Encode strings for the stream
function encode(str) {
  // Convert the message string into a Uint8Array (binary data)
  // suitable for streaming through the SSE connection.
  return new TextEncoder().encode(str);
}

// -------------------------------------------------------------
// Broadcast a message to all connected clients
// -------------------------------------------------------------
export function broadcastMessage(msg) {
  // Each message must begin with "data:" and end with two newlines (\n\n)
  // so the browser knows where one message ends and another begins.
  const data = `data: ${JSON.stringify(msg)}\n\n`;
  const encoded = encode(data);

  // Iterate over all connected SSE clients
  for (const client of clients) {
    try {
      // Send (enqueue) the encoded message to each client's readable stream.
      // The browser connected via EventSource will immediately receive this data.
      client.controller.enqueue(encoded);
    } catch {
      // Ignore if the client has disconnected
    }
  }
}