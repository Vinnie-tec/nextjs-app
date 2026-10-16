import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function MessageItem({
  msg,
  session,
  handleDelete,
}) {
  // Local state for editing mode and edit text
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(msg.text);

  const canEditOrDelete = session?.user?.id === msg.user_id;

  return (
    <li className="p-3 border rounded-md bg-gray-100 dark:bg-gray-800 relative">
      {/* Username */}
      <p className="font-semibold">{msg.user_name || "Anonymous"}</p>

      {/* Message content or editing input */}
      {isEditing ? (
        <div>
        </div>
      ) : (
        <p className="mt-1">{msg.text}</p>
      )}

      {/* Footer: timestamp + edited indicator */}
      <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
        <span>{formatDistanceToNow(new Date(msg.created_at + "Z"), { addSuffix: true })}</span>
        {msg.edited_at && <span>(edited)</span>}
      </div>

      {/* Edit/Delete buttons */}
      {canEditOrDelete && !isEditing && (
        <div className="absolute top-2 right-2 flex gap-2 text-sm">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:underline"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => handleDelete(msg.id)}
            className="text-red-600 hover:underline"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
    </li>
  );
}