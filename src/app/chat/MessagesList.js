"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { getMessages } from "./actions";
import { useSession } from "next-auth/react";
import MessageItem from "./MessageItem";

export default function MessagesList({ courseId }) {
  // Get the current authentication session and session status from NextAuth
  const { data: session, status: sessionStatus } = useSession();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const bottomRef = useRef(null);
  const PAGE_SIZE = 2;

  const fetchMessages = useCallback(
    async (newOffset = 0) => {
      setLoading(true);

      try {
        const data = await getMessages(courseId, PAGE_SIZE, newOffset);

        if (newOffset === 0) {
          const initialMessages = [...data].reverse();
          setMessages(initialMessages);
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        } else {
          const olderMessages = [...data].reverse();
          setMessages((prev) => [...olderMessages, ...prev]);
        }

        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    },
    [courseId],
  );

  useEffect(() => {
    if (!courseId) return;

    const timer = setTimeout(() => {
      void fetchMessages(0);
    }, 0);

    return () => clearTimeout(timer);
  }, [courseId, fetchMessages]);

  const loadMore = () => {
    const nextOffset = offset + PAGE_SIZE;
    setOffset(nextOffset);
    fetchMessages(nextOffset);
  };

  // SSE live updates
  useEffect(() => {
    // If the user is not authenticated, don't open the SSE connection
    if (sessionStatus !== "authenticated") {
      return;
    }

    // Create a new EventSource to listen for real-time updates from the server
    const eventSource = new EventSource("/api/messages/stream");

    // Handle incoming messages from the SSE connection
    eventSource.onmessage = (event) => {
      // Parse the JSON payload sent from the server
      const payload = JSON.parse(event.data);
      console.log("payload:");
      console.log(payload);

      // Handle different message types sent from the server
      switch (payload.type) {
        case "connected":
          // Display a success toast when successfully connected to the stream
          toast.success("Connected successfully!");
          break;

        case "new":
          // Append a new message to the list of messages
          setMessages((prev) => [...prev, payload.data]);
          break;

        case "delete":
          // Remove a message from the list by ID
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== payload.data.id),
          );
          break;

        default:
          // Log a warning for any unexpected message types
          console.warn("Unknown SSE message type:", payload);
      }
    };

    // Clean up the EventSource connection when the component unmounts
    // or when dependencies change
    return () => eventSource.close();
  }, [sessionStatus]);

  // 🗑️ Handles deleting a message both in the UI and on the server
  const handleDelete = async (id) => {
    try {
      // ⚡ Optimistic UI update:
      // Immediately remove the message from the local state
      // so the user sees it disappear instantly (before the server confirms).
      setMessages((prev) => prev.filter((m) => m.id !== id));

      // 🌐 Send a DELETE request to the server to remove the message from the database
      const res = await fetch("/api/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }), // Pass the message ID in the request body
      });

      // 📦 Parse the JSON response
      const data = await res.json();

      // ❌ If the server responded with an error status, throw an error to trigger the catch block
      if (!res.ok) throw new Error(data.error || "Failed to delete message");

      // ✅ Show a success toast when deletion succeeds
      toast.success("Message deleted");
    } catch (err) {
      // 💥 Handle network or server errors gracefully
      console.error(err);

      // 🚫 Show an error toast to inform the user that deletion failed
      toast.error(err.message || "Failed to delete");
    }
  };

  if (loading) return <p>Loading messages...</p>;

  return (
    <div>
      {/* Load previous messages button */}
      {hasMore && (
        <button
          onClick={loadMore}
          className="mb-2 px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Load previous {PAGE_SIZE} messages
        </button>
      )}

      <ul>
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            msg={msg}
            session={session}
            handleDelete={handleDelete}
          />
        ))}
        <div ref={bottomRef} />
      </ul>
    </div>
  );
}
