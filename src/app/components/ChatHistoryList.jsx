"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ChatHistoryList = ({ onSelectChat }) => {
  const [historyList, setHistoryList] = useState([]); 

  const user_id = useSelector((state) => state.user.user_id);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const block_index = 0; 

  useEffect(() => {
    handleChatHistory();
  }, [user_id]); 

  const handleChatHistory = async () => {
    if (!user_id) return;

    try {
      const res = await fetch(
        `${apiUrl}/chat/${user_id}/block_index/${block_index}`
      );

      const data = await res.json();

      setHistoryList(data || []); 
      
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!chatId || !user_id) return;

    try {
      const res = await fetch(`${apiUrl}/chat/${chatId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setHistoryList((prev) => prev.filter((chat) => chat._id !== chatId));
      } else {
        console.error("Error deleting chat:", res.statusText);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <>
      {historyList.map((chat) => (
        <ChatHistory 
          key={chat._id} 
          chat={chat} 
          onSelectChat={onSelectChat} 
          onDeleteChat={handleDeleteChat}
        />
      ))}
      {historyList.length === 0 && (
          <p className="text-sm text-slate-500 px-4 py-2">No recent chats.</p>
      )}
    </>
  );
};