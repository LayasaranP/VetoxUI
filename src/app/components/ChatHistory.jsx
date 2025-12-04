import React from "react";
import { Trash2 } from "lucide-react";

const ChatHistory = ({ chat, onSelectChat, onDeleteChat }) => {
  if (!chat) return null; 

  const summary = chat.summary || (chat.user ? chat.user : (chat.conversations && chat.conversations.length > 0 ? chat.conversations[0]?.user : "New Chat"));
  
  const timestamp = chat.timestamp || (chat.conversations && chat.conversations.length > 0 
        ? chat.conversations.at(-1).timestamp 
        : null);

  const timestampDisplay = timestamp
    ? new Date(timestamp).toLocaleString()
    : "No messages yet";

  const handleDelete = (e) => {
    e.stopPropagation(); 
    if (onDeleteChat && chat) {
      onDeleteChat(chat);
    } else {
    }
  };

  return (
    <div className="group relative">

      <button
        onClick={() => onSelectChat(chat)} 
        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 transition-colors"
      >
        <div className="flex flex-col items-start overflow-hidden mr-6">
          <span className="text-sm font-medium truncate w-full text-left">
            {summary} 
          </span>

          <span className="text-xs mt-1 opacity-50 truncate w-full text-left">
            {timestampDisplay}
          </span>
        </div>
      </button>

      {/* Trash Icon */}
      <button 
        onClick={handleDelete} 
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default ChatHistory;