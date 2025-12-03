import React from 'react';
import { Sparkles, Menu } from 'lucide-react';

export const ChatHeader = ({ 
  onSummarize, 
  isLoading, 
  hasMessages,
  isSidebarOpen,
  setIsSidebarOpen
}) => {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-slate-900/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10 w-full">
      
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-2 mt-3.5 text-slate-400 hover:text-white rounded-lg transition-colors ${isSidebarOpen ? 'md:hidden' : 'block'}`}
        >
          <Menu size={25} />
        </button>

        <div className="flex flex-col mt-4">
          <h1 className="text-[20px] font-semibold text-slate-100 flex items-center gap-2">
            <span className="px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-md font-bold border border-indigo-500/20">Vetox 1.0</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onSummarize}
          disabled={isLoading || !hasMessages}
          className="p-2 mt-3.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Summarize Chat"
        >
          <Sparkles size={25} />
        </button>
      </div>
    </header>
  );
};