import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";

export default function MessageItem({
  msg,
  session,
  handleDelete,
  handleEdit,
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
        <form
          className="flex gap-2 items-center mt-1"
          onSubmit={(e) => {
            e.preventDefault(); // Prevent full page reload
            handleEdit(msg.id, editText);
            setIsEditing(false);
          }}
        >
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className={clsx(
              "border rounded-md px-2 py-1 grow",
              "bg-white text-gray-900",
              "dark:bg-gray-700 dark:text-gray-100"
            )}
          />
          <button
            type="submit"
            className="text-sm text-green-600 hover:underline"
          >
            Save
          </button>
          <button
            type="button" // Prevents submitting the form
            onClick={() => setIsEditing(false)}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </form>
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