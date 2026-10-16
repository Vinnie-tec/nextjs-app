"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { getMessages } from "./actions";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";

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

        default:
          // Log a warning for any unexpected message types
          console.warn("Unknown SSE message type:", payload);
      }
    };

    // Clean up the EventSource connection when the component unmounts
    // or when dependencies change
    return () => eventSource.close();
  }, [sessionStatus]);

  if (loading) return <p>Loading messages...</p>;

  return (
    <div>
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
          <li key={msg.id}>
            <p>
              {msg.user_name || "Anonymous"}: {msg.text}
            </p>
            <small>
              {formatDistanceToNow(new Date(msg.created_at + "Z"), {
                addSuffix: true,
              })}
            </small>
          </li>
        ))}
        <div ref={bottomRef} />
      </ul>
    </div>
  );
}
