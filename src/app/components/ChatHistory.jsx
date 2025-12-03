import React from "react";
import { Trash2 } from "lucide-react";
import ChatHistoryList from './ChatHistoryList';

const ChatHistory = ({ chat, onSelectChat, onDeleteChat }) => {
  if (!chat) return null; 

  const conversationList = chat.conversations || [];

  const chatSummary =
    conversationList.length > 0
      ? conversationList[0]?.user 
      : "New Chat";

  const lastMessage =
    conversationList.length > 0
      ? conversationList.at(-1)
      : null;

  const timestampDisplay = lastMessage
    ? new Date(lastMessage.timestamp).toLocaleString()
    : "No messages yet";

  const handleDelete = (e) => {
    e.stopPropagation(); 
    if (onDeleteChat && chat._id) {
      onDeleteChat(chat._id);
    } else {
      console.log(`Deleting chat with ID: ${chat._id}`); 
    }
  };

  return (
    <div className="group relative">
      {/* Sidebar Chat Item */}
      <button
        onClick={() => onSelectChat(chat)} 
        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 transition-colors"
      >
        <div className="flex flex-col items-start overflow-hidden mr-6">
          <span className="text-sm font-medium truncate w-full text-left">
            {chatSummary} 
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