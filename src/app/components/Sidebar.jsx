"use client";

import React from "react";
import { 
  Plus,
  PanelLeftClose,
} from "lucide-react";
import SignOut from "../auth/SignOut";
import ChatHistory from "./ChatHistory";
import { useSelector } from "react-redux";
import Image from "next/image";

export default function Sidebar({ isOpen, setIsOpen }) {

  const userName = useSelector((state) => state.user.name);
  const userEmail = useSelector((state) => state.user.email);

  return (
    <>
      <div 
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`} 
      />

      <aside 
        className={`
            fixed top-0 left-0 z-50 flex flex-col h-screen w-72 bg-slate-900 border-r border-slate-800
            transform transition-transform duration-300 ease-in-out shadow-2xl
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      > 

        <div className="p-4 border-b border-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3 text-indigo-400 font-bold text-xl">
              <Image 
              src="/LLM 3.jpg" 
              alt="VetoxAI Logo"
              width={50}
              height={50}
            />
            <span className="tracking-tight text-white">
              Vetox<span className="text-indigo-500">AI</span>
            </span>
          </div>

          <button 
            className="text-slate-400 hover:text-white transition"
            onClick={() => setIsOpen(false)}
          >
            <PanelLeftClose className="size-6" />
          </button>
        </div>

        <div className="p-4">
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/20 font-medium active:scale-95">
            <Plus size={18} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
          <h3 className="text-xs font-semibold text-slate-500 px-4 py-2 uppercase tracking-wider">
            Recent Chats
          </h3>

          <ChatHistory />
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-slate-900/50 bg-slate-900/50">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
            <div className="size-8 rounded-full bg-emerald-800 flex items-center justify-center text-xs font-bold text-white shrink-0">
              <h1 className="text-lg">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </h1>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">
                {userName || "Loading..."}
              </p>
              <p className="text-xs text-slate-400 truncate mt-1">
                {userEmail || ""}
              </p>
            </div>
          </div>

          <SignOut />
        </div>
      </aside>
    </>
  );
}
