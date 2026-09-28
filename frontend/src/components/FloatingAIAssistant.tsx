import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageCircle, X, Send, Bot, User, ArrowRight, Loader2 } from 'lucide-react';
import { sendAIChat } from '../utils/api';

interface FloatingAIAssistantProps {
  currentCity: string;
  onOpenPlanner?: () => void;
}

const QUICK_PROMPTS = [
  'Where can I eat under ₹200? 🍔',
  'Suggest a peaceful place 🍃',
  'Plan an evening for 4 friends under ₹500 👥',
  'What can I do tonight? 🌙',
  'Best café for studying with Wi-Fi ☕',
  'Famous spots near campus 🏛️',
];

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({
  currentCity,
  onOpenPlanner,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{
    role: 'bot' | 'user';
    text: string;
    timestamp: string;
  }>>([
    {
      role: 'bot',
      text: `Hey student! 👋 I'm **Travel With You AI** for **${currentCity}**. Ask me for cheap food spots, quick hangout plans, quiet study corners, or budget weekend ideas!`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      role: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const reply = await sendAIChat(textToSend, currentCity);
      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          text: `In ${currentCity}, check out Church Street bookstores or VV Puram street food for unbeatable student value under ₹200!`,
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 sm:bottom-6 right-5 z-40 p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-full bg-slate-950/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
          </div>
          <span className="hidden sm:inline">Ask Travel With You AI</span>
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[580px] h-[540px] bg-slate-900/95 border border-emerald-500/40 rounded-3xl shadow-2xl shadow-emerald-500/10 backdrop-blur-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-400 flex items-center justify-center text-slate-950">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Travel With You AI
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-[11px] text-slate-400">
                  Grounded student travel assistant • {currentCity}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-950/50 border-b border-slate-800/80 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
            {QUICK_PROMPTS.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-emerald-300 border border-slate-700/60 transition-colors cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                
                <div
                  className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-sm'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className={`block text-[9px] mt-1 ${msg.role === 'user' ? 'text-slate-800' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Finding budget options for you...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. cheap evening under ₹500)..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500/50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
