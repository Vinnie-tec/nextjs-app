'use client';

import { useEffect, useState } from "react";
import { getMessages } from "./actions"; // server actions
import { formatDistanceToNow } from "date-fns";

export default function MessagesList({ courseId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect hook runs when the component mounts or when `courseId` changes
  useEffect(() => {
    // Define an async function to fetch messages
    const fetchMessages = async () => {
      setLoading(true); // Set loading state to true before fetching data

      // Fetch messages from the API using the current courseId
      const data = await getMessages(courseId);

      // Reverse messages so the oldest messages appear first
      setMessages(data.reverse());

      setLoading(false); // Set loading state to false after data is fetched
    };

    fetchMessages(); // Call the async fetch function
  }, [courseId]); // Dependency array: effect re-runs whenever courseId changes

  // If messages are still loading, show a loading message
  if (loading) return <p>Loading messages...</p>;

  return (
    <ul>
      {messages.map((msg) => (
        <li key={msg.id}>
          <p>{msg.user_name || "Anonymous"}: {msg.text}</p>
          <small>{formatDistanceToNow(new Date(msg.created_at + "Z"), { addSuffix: true })}</small>
        </li>
      ))}
    </ul>
  );
}