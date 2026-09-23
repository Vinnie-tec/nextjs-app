"use client";

import { useEffect, useState } from "react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessages] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("failed to fetch message", error);
      return [];
    }
  };

  useEffect(() => {
    fetchMessages().then(setMessages);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newMessage }),
      });

      const data = await response.json();

      if (data.success) {
        setNewMessages("");
        setMessages(await fetchMessages());
      } else {
        alert("failed to save message");
      }
    } catch (error) {
      console.error("Error submitting messages", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <ul className="space-y-2 mb-6">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className="p-3 border rounded-md bg-gray-100 dark:bg-gray-800"
          >
            {msg.text}
          </li>
        ))}
      </ul>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessages(event.target.value)}
          placeholder="Type a message..."
          required
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Sending" : "Send"}
        </button>
      </form>
    </div>
  );
}
