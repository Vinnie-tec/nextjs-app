// Mark this as a Client Component in Next.js  to use hooks: useState, useEffect
'use client';

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function MessagesPage() {
  // -------------------------------------------------------------
  // Get the current authentication status
  // (e.g. "authenticated", "unauthenticated", or "loading") from NextAuth
  // -------------------------------------------------------------
  const { status } = useSession();

  // -------------------------------------------------------------
  // Local state variables
  // -------------------------------------------------------------
  const [messages, setMessages] = useState([]); // List of messages fetched from the API
  const [newMsg, setNewMsg] = useState(""); // Current value of the new message input field
  const [loading, setLoading] = useState(false); // Whether a message is being submitted

  // -------------------------------------------------------------
  // Fetch messages from the backend API
  // Called initially (in useEffect) and after new message submission
  // -------------------------------------------------------------
  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages"); // GET request to your API endpoint
      const data = await res.json(); // Parse JSON response
      setMessages(data); // Update state with the fetched messages
    } catch (error) {
      console.error("Failed to load messages:", error); // Log any fetch errors
    }
  };

  // -------------------------------------------------------------
  // Load messages when the component first mounts
  // The empty dependency array [] ensures this runs only once
  // -------------------------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchMessages();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // -------------------------------------------------------------
  // Create a connection to the server-sent events (SSE) endpoint
  // The browser will keep this connection open to receive updates
  // -------------------------------------------------------------
  useEffect(() => {
    // Connect to SSE stream
    const eventSource = new EventSource("/api/messages/stream");

    // Listen for incoming messages from the SSE stream
    eventSource.onmessage = (event) => {
      // Parse the JSON string from the server
      const newMessage = JSON.parse(event.data);

      // Handle special events or normal messages
      if(newMessage.type === "connected"){
        // If the server sends a "connected" type event, show a toast
        toast.success("Connected successfully!");
      }else{
        // Otherwise, append the new message to the current messages state
        setMessages((prev) => [...prev, newMessage]);
      }    
    };
    // Cleanup when the component unmounts
    return () => eventSource.close();
  }, []); // Empty dependency array => runs once on mount

  // -------------------------------------------------------------
  // Handle submission of a new message
  // Sends a POST request to the API and refreshes the list on success
  // -------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default page reload behavior
    if (!newMsg.trim()) return; // Ignore empty messages

    setLoading(true); // Disable inputs and show loading state

    try {
      // Send new message to the API
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newMsg }), // Send message text as JSON
      });

      const data = await res.json(); // Parse API response

      if (data.success) {
        // If message saved successfully:
        setNewMsg(""); // Clear input field
        await fetchMessages(); // Refresh messages list
      } else {
        alert("Failed to save message."); // Handle backend failure
      }
    } catch (error) {
      console.error("Error submitting message:", error); // Catch any network or runtime errors
    } finally {
      setLoading(false); // Re-enable input/button regardless of outcome
    }
  }

  // -------------------------------------------------------------
  // 🔐 Handle auth states
  // -------------------------------------------------------------
  if (status === "loading") {
    return <p className="p-6 text-center">Loading session...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="p-6 text-center">
        <p className="mb-4">You must be logged in to view messages.</p>
        {/* Trigger the NextAuth sign-in flow when the user clicks the Login button */}
        <button
          onClick={() => signIn()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
        >
          Login
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // UI Rendering
  // -------------------------------------------------------------
  return (
    <div className="p-6 max-w-lg mx-auto">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4">💬 Messages</h1>

      {/* Message List */}
      <ul className="space-y-2 mb-6">
        {messages.map((msg) => (
          <li
            key={msg.id} // React key for stable list rendering
            className="p-3 border rounded-md bg-gray-100 dark:bg-gray-800"
          >
            <p className="font-semibold">{msg.user_name || "Anonymous"}</p>
            <p>{msg.text}</p>
            <span className="text-xs text-gray-500">{msg.created_at}</span>
          </li>
        ))}
      </ul>

      {/* Message Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        {/* Input field for typing new message */}
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          required
          disabled={loading} // Disable input while sending
          className={
            "border px-3 py-2 grow rounded-md " +
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          }
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading} // Prevent multiple submissions
          className={`px-4 py-2 rounded-md text-white transition  ${
            loading
              ? "bg-gray-400 cursor-not-allowed" // Loading state style
              : "bg-blue-600 hover:bg-blue-700" // Normal button style
          }`}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}