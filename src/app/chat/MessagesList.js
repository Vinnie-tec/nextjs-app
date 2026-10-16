'use client';

import { useCallback, useEffect, useState, useRef } from "react";
import { getMessages } from "./actions";
import { formatDistanceToNow } from "date-fns";

export default function MessagesList({ courseId }) {
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
    [courseId]
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
              {formatDistanceToNow(new Date(msg.created_at + "Z"), { addSuffix: true })}
            </small>
          </li>
        ))}
        <div ref={bottomRef} />
      </ul>
    </div>
  );
}