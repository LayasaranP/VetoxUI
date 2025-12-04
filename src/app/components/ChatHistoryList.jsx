"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChatHistory from "./ChatHistory";
import { fetchUserChats } from "../services/VetoxServices";

const ChatHistoryList = ({ onSelectChat, refreshTrigger }) => {
  const [historyList, setHistoryList] = useState([]); 
  const user_id = useSelector((state) => state.user.user_id);

  useEffect(() => {
    handleChatHistory();
  }, [user_id, refreshTrigger]); 

  const handleChatHistory = async () => {
    if (!user_id) {
      return;
    }

    try {
      const data = await fetchUserChats(user_id);
      let sessions = [];

      if (Array.isArray(data)) {
        // Group blocks by session_id
        const sessionMap = {};
        
        data.forEach(block => {
          const sId = block.session_id || 'legacy'; // Handle legacy chats without session_id
          if (!sessionMap[sId]) {
            sessionMap[sId] = [];
          }
          sessionMap[sId].push(block);
        });

        // Convert map to array of session objects
        sessions = Object.keys(sessionMap).map(sId => {
          const blocks = sessionMap[sId];
          // Sort blocks by index
          blocks.sort((a, b) => a.block_index - b.block_index);
          
          const lastBlock = blocks[blocks.length - 1];
          const firstBlock = blocks[0];
          
          // Get summary from the first message of the first block
          let summary = "New Chat";
          if (firstBlock.conversations && firstBlock.conversations.length > 0) {
            summary = firstBlock.conversations[0].user;
          }
          
          // Get timestamp from the last message of the last block
          let timestamp = new Date().toISOString();
          if (lastBlock.conversations && lastBlock.conversations.length > 0) {
            timestamp = lastBlock.conversations[lastBlock.conversations.length - 1].timestamp || timestamp;
          }

          return {
            session_id: sId,
            blocks: blocks,
            summary: summary,
            timestamp: timestamp,
            _id: sId // Use session_id as key
          };
        });
        
        // Sort sessions by timestamp (newest first)
        sessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
      } else if (data && typeof data === 'object' && (data._id || data.conversations)) {
         // Handle single block case (legacy or weird API response)
         const sId = data.session_id || 'legacy';
         sessions = [{
            session_id: sId,
            blocks: [data],
            summary: data.conversations?.[0]?.user || "New Chat",
            timestamp: data.conversations?.at(-1)?.timestamp || new Date().toISOString(),
            _id: sId
         }];
      } else {
        sessions = [];
      }
      
      setHistoryList(sessions);

    } catch (error) {
    }
  };

  const handleDeleteChat = async (session) => {
    if (!session || !user_id) return;

    if (!window.confirm(`Delete this chat? This action cannot be undone.`)) {
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // We need to delete ALL blocks associated with this session
      const deletePromises = session.blocks.map(block => 
        fetch(`${apiUrl}/chat/${user_id}/block_index/${block.block_index}`, {
            method: 'DELETE',
        })
      );
      
      await Promise.all(deletePromises);

      // Remove from UI
      setHistoryList((prev) => prev.filter((s) => s.session_id !== session.session_id));
      
    } catch (error) {
      alert("Failed to delete chat. Please try again.");
    }
  };

  return (
    <>
      {historyList.map((session) => (
        <ChatHistory 
          key={session._id} 
          chat={session} 
          onSelectChat={() => onSelectChat(session.blocks)} 
          onDeleteChat={handleDeleteChat}
        />
      ))}
      {historyList.length === 0 && (
          <p className="text-sm text-slate-500 px-4 py-2">No recent chats.</p>
      )}
    </>
  );
};

export default ChatHistoryList;