"use Client";

import { useEffect, useState } from "react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessages] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMessage = async () => {
    try {
      const response = await fetch("/api/messages");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.log("failed to fetch message", error);
    }
  };
  //   useEffect(() => {

  //   })
  
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <ul className="space-y-2 mb-6">
        {messages.map((msg) => {
          <li
            key={msg.id}
            className="p-3 border rounded-md bg-gray-100 dark:bg-gray-800"
          >
            {msg.text}
          </li>;
        })}
      </ul>
    </div>
  );
}
