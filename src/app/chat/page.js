"use client";

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import { ChatHeader } from '../components/ChatHeader';
import { ChatInput } from '../components/ChatInput';
import Sidebar from '../components/Sidebar';

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const auth = useSelector((state) => state.user.isLoggedIn);

  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      router.push('/');
    }
  }, [auth, router]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      <main 
        className={`flex-1 flex flex-col h-full relative transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'md:ml-72' : 'md:ml-0'}
        `}
      >
        <ChatHeader 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <ChatInput />
      </main>
    </div>
  );
}

export default Page;
