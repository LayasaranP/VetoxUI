"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import Messages from './Messages';
import { useSelector } from 'react-redux';

export const ChatInput = () => {
  const textareaRef = useRef(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const user_id = useSelector((state) => state.user.user_id);

  const onSendMessage = async () => {
    if (!input.trim()) return;

    const currentInput = input;

    const userMessage = { role: 'user', content: currentInput };

    const botPlaceholder = { role: 'assistant', content: '' };

    setMessages((prev) => [...prev, userMessage, botPlaceholder]);
    setInput('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      let data;

      if (apiUrl) {
        const res = await fetch(`${apiUrl}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: currentInput, user_id }),
        });

        if (!res.ok) throw new Error('Failed to fetch');
        data = await res.json();
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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const height = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(height, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 font-sans">
      {/* Messages */}
      <div className="flex-1 w-full overflow-y-auto custom-scrollbar p-4 md:p-6 scroll-smooth">
        <Messages messages={messages} />
      </div>

      {/* Input */}
      <div className="bg-slate-950 border-slate-900/50 p-4 md:p-6 pb-6">
        <div className="max-w-3xl mx-auto relative">
          <div className="relative flex items-end gap-2 bg-slate-900/50 border border-white/60 rounded-2xl p-2 shadow-md shadow-white/40">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full bg-transparent text-base p-3 max-h-[200px] min-h-[50px] resize-none custom-scrollbar focus:outline-none"
              rows={1}
            />
            <button
              onClick={onSendMessage}
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-xl transition-all ${
                input.trim() && !isLoading
                  ? 'text-white'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>

          <p className="text-center text-xs text-slate-600 mt-4">
            Vetox can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};
