"use client";

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import { ChatHeader } from '../components/ChatHeader';
import { ChatInput } from '../components/ChatInput';
import Sidebar from '../components/Sidebar';
import Summarize from '../components/Summarize';
import { fetchChatDetails } from '../services/VetoxServices';

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [refreshSidebar, setRefreshSidebar] = useState(0);
  const [isSummarizeOpen, setIsSummarizeOpen] = useState(false);

  const auth = useSelector((state) => state.user.isLoggedIn);
  const user_id = useSelector((state) => state.user.user_id);

  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      router.push('/');
    }
  }, [auth, router]);

  // Load most recent chat on initial mount
  useEffect(() => {
    const loadRecentChat = async () => {
      if (!user_id) return;
      
      try {
        const { fetchUserChats } = await import('../services/VetoxServices');
        const chats = await fetchUserChats(user_id);
        
        if (Array.isArray(chats) && chats.length > 0) {
          // Group by session_id to find the most recent session
          const sessions = {};
          chats.forEach(block => {
            const sId = block.session_id || 'legacy';
            if (!sessions[sId]) sessions[sId] = [];
            sessions[sId].push(block);
          });
          
          // Sort sessions by latest timestamp (assuming last block's last message)
          // For simplicity, just taking the first block's session if it exists
          // In reality, we'd want to sort sessions.
          // Assuming backend returns sorted blocks, the last block in the list might be the latest?
          // Or first? Usually APIs return newest first or oldest first.
          // Let's assume we just pick the first available session from the list.
          
          const firstBlock = chats[0];
          const sId = firstBlock.session_id || 'legacy';
          const sessionBlocks = sessions[sId];
          
          if (sessionBlocks) {
             handleSelectChat(sessionBlocks);
          }
        }
      } catch (error) {
        console.error("Error loading recent chat:", error);
      }
    };

    loadRecentChat();
  }, [user_id]);

  const handleSelectChat = async (sessionBlocks) => {
    if (!sessionBlocks || sessionBlocks.length === 0) return;
    
    // Sort blocks by index to ensure correct order
    const sortedBlocks = [...sessionBlocks].sort((a, b) => a.block_index - b.block_index);
    
    const latestBlock = sortedBlocks[sortedBlocks.length - 1];
    setCurrentChatId(latestBlock._id); // Keep track of last block ID if needed
    setCurrentSessionId(latestBlock.session_id);
    
    // Combine conversations from all blocks
    const allConversations = sortedBlocks.flatMap(block => block.conversations || []);
    
    const formattedMessages = allConversations.flatMap(conv => [
      { role: 'user', content: conv.user },
      { role: 'assistant', content: conv.assistant }
    ]);
    
    setMessages(formattedMessages);
    
    // On mobile, close sidebar after selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setCurrentSessionId(crypto.randomUUID()); // Generate new Session ID
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSendMessage = async (currentInput, setMessages, setIsLoading) => {
    // Check if current chat has reached conversation limit
    // With sessions, we might not need to limit strictly per block if backend handles new blocks.
    // But let's keep the check if it's critical, or rely on backend to create new blocks.
    // The backend code provided creates new blocks automatically.
    // So we can remove the frontend limit check or relax it.
    
    // const conversationCount = messages.length / 2; 
    // const MAX_CONVERSATIONS_PER_BLOCK = 10; 
    
    // if (conversationCount >= MAX_CONVERSATIONS_PER_BLOCK) ... 
    // We'll remove this check to allow infinite scroll/sessions handled by backend blocks.

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      let data;

      // Ensure we have a session ID
      let activeSessionId = currentSessionId;
      if (!activeSessionId) {
          activeSessionId = crypto.randomUUID();
          setCurrentSessionId(activeSessionId);
      }

      if (apiUrl) {
        console.log("Sending message to backend:", currentInput, "Session:", activeSessionId);
        const res = await fetch(`${apiUrl}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
              message: currentInput, 
              user_id, 
              session_id: activeSessionId 
          }),
        });

        if (!res.ok) throw new Error('Failed to fetch');
        data = await res.json();
        console.log("Backend response:", data);
        
        // Check if backend returned an error about conversation limit
        if (data.error && data.error.includes('limit')) {
          alert("This chat has reached its conversation limit. Please start a new chat to continue.");
          setIsLoading(false);
          return;
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        data = { reply: `This is a simulated AI response to: "${currentInput}"\n\n(No API found, mock response.)` };
      }

      const aiMessage = { role: 'assistant', content: data.reply };

      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = aiMessage;
        return newMessages;
      });

      // Trigger sidebar refresh after successful message with a small delay
      // to allow backend to create the chat entry
      console.log("Triggering sidebar refresh");
      setTimeout(() => {
        setRefreshSidebar(prev => prev + 1);
      }, 1000); // Increased to 1 second

    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: "Sorry, I couldn't connect to the server.",
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        refreshTrigger={refreshSidebar}
      />

      <main 
        className={`flex-1 flex flex-col h-full relative transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'md:ml-72' : 'md:ml-0'}
        `}
      >
        <ChatHeader 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onSummarize={() => setIsSummarizeOpen(true)}
          hasMessages={messages.length > 0}
        />

        <ChatInput 
          messages={messages}
          setMessages={setMessages}
          onSendMessage={handleSendMessage}
          sessionId={currentSessionId}
        />
        
        <Summarize 
          isOpen={isSummarizeOpen} 
          onClose={() => setIsSummarizeOpen(false)} 
          messages={messages} 
        />
      </main>
    </div>
  );
}

export default Page;
