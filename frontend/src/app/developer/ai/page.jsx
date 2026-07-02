"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, User, Sparkles, Send } from "lucide-react";

export default function AiAssistantPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I am the GearRent Developer Assistant. I can help you debug code, write database queries, configure environments, or explain architecture. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const [typing, setTyping] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      let response = "I am currently a mock interface. To fully implement me, you would need to connect my backend to an LLM provider like OpenAI or Anthropic.";
      if (userMsg.toLowerCase().includes("database") || userMsg.toLowerCase().includes("query")) {
        response = "To query the database, you can use the built-in Database Manager. If you'd like a custom MongoDB aggregate pipeline, try:\n\n`db.bookings.aggregate([{ $match: { status: 'active' } }])`";
      }
      
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setTyping(false);
    }, 1500);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-6 flex-shrink-0">
        <div className="bg-violet-500/20 p-3 rounded-xl border border-violet-500/30">
          <Bot className="w-6 h-6 text-violet-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">AI Assistant</h1>
          <p className="text-outline text-sm">Context-aware AI for debugging and operational support.</p>
        </div>
      </div>

      <div className="flex-1 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === 'user' ? 'bg-primary text-on-primary' : 'bg-violet-500/20 text-violet-500'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-on-primary rounded-tr-sm' 
                  : 'bg-surface-container text-on-background rounded-tl-sm border border-outline-variant/30'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl text-sm bg-surface-container text-on-background rounded-tl-sm border border-outline-variant/30 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex-shrink-0">
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI assistant a question..."
              className="w-full bg-surface-container text-on-background rounded-full pl-6 pr-14 py-4 outline-none border border-outline-variant/50 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-sm"
            />
            <button 
              type="submit"
              disabled={!input.trim() || typing}
              className="absolute right-2 top-2 bottom-2 bg-violet-500 hover:bg-violet-600 disabled:bg-surface-container-highest disabled:text-outline text-white w-10 rounded-full flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          <div className="flex justify-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-outline px-3 py-1 bg-surface-container rounded-full border border-outline-variant/30 cursor-pointer hover:bg-surface-container-highest">"How do I clear the Redis cache?"</span>
            <span className="text-xs text-outline px-3 py-1 bg-surface-container rounded-full border border-outline-variant/30 cursor-pointer hover:bg-surface-container-highest">"Write a MongoDB migration script"</span>
          </div>
        </div>
      </div>
    </div>
  );
}
