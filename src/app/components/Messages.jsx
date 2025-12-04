"use client";

import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Loading from './Loading';
import { AIBubble } from './TypingIndicator';

const Messages = ({ messages }) => {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const user_name = useSelector((state) => state.user.name);

  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      if (bottomRef.current && bottomRef.current.parentElement) {
        const container = bottomRef.current.parentElement.parentElement;
        if (container && container.scrollHeight) {
          container.scrollTop = container.scrollHeight;
        }
      }
    }, 100);
    
    return () => clearTimeout(scrollTimer);
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white space-y-4 opacity-50 px-4">
        <h2 className="text-4xl font-extrabold 
              bg-linear-to-r from-blue-600 via-blue-700 to-indigo-900
              text-transparent bg-clip-text 
              brightness-150">
          Welcome{user_name ? `, ${user_name}` : " Gentle Man"}!
        </h2>
        <p className='text-xl font-bold'>
          No messages yet. Start a conversation with Vetox AI!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-2 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
      {messages.map((msg, index) => {
        const isUser = msg.role === 'user';

        return (
          <div key={index} className={`flex my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`
                flex gap-4
                ${isUser 
                  ? 'max-w-[85%] md:max-w-[70%] flex-row-reverse' 
                  : 'max-w-full w-full flex-row'
                }`}>
              <div className={`
                  p-3 sm:p-4 rounded-2xl whitespace-pre-wrap text-lg sm:text-base
                  ${isUser 
                    ? 'bg-slate-800 text-slate-100 rounded-tr-none border border-slate-700' 
                    : 'text-slate-200 w-full rounded-tl-none' 
                  }`}>
                   {isUser ? (
                        msg.content
                          ) : msg.content === "" ? (
                     <Loading />
                       ) : msg.animate ? (
                          <AIBubble text={msg.content} />
                       ) : (
                          msg.content
                       )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default Messages;
