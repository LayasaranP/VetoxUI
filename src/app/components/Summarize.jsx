"use client";

import React, { useEffect, useState } from 'react';
import { X, Loader2, Sparkles } from 'lucide-react';
import summarise from '../services/Summarise';

const Summarize = ({ isOpen, onClose, messages }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && messages && messages.length > 0) {
      handleSummarize();
    }
  }, [isOpen, messages]);

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);
    setSummary('');

    try {
      const result = await summarise(messages);
      if (result && result.summary) {
        setSummary(result.summary);
      } else if (result && result.reply) {
         setSummary(result.reply);
      } else if (result && result.message) {
         setSummary(result.message);
      } else {
        setError("Failed to generate summary.");
      }
    } catch (err) {
      setError("An error occurred while summarizing.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles size={20} />
            <h2 className="text-lg font-semibold text-white">Chat Summary</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 size={32} className="animate-spin text-indigo-500" />
              <p className="text-slate-400 text-sm">Generating summary...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={handleSummarize}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                {summary || "No summary available."}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summarize;
