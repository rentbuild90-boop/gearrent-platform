"use client";

import React, { useState, useRef, useEffect } from "react";
import { TerminalSquare, ChevronRight, X, Play } from "lucide-react";

export default function TerminalPage() {
  const [history, setHistory] = useState([
    { type: "sys", text: "GearRent Server Administration Console v2.0" },
    { type: "sys", text: "Connected to worker-node-04 (192.168.1.104)" },
    { type: "sys", text: "Type 'help' for available commands." },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const cmd = input.trim();
    setHistory(prev => [...prev, { type: "cmd", text: cmd }]);
    setInput("");

    setTimeout(() => {
      let response = "";
      switch(cmd.toLowerCase()) {
        case "help":
          response = "Available commands: help, clear, status, restart [service], ping, deploy";
          break;
        case "clear":
          setHistory([]);
          return;
        case "status":
          response = "All systems operational. Load average: 0.12, 0.05, 0.01";
          break;
        case "ping":
          response = "Pong! 12ms";
          break;
        default:
          response = `Command not found: ${cmd}`;
      }
      setHistory(prev => [...prev, { type: "res", text: response }]);
    }, 400);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-6 flex-shrink-0">
        <div className="bg-slate-700/50 p-3 rounded-xl border border-slate-600">
          <TerminalSquare className="w-6 h-6 text-slate-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">Terminal UI</h1>
          <p className="text-outline text-sm">Direct command-line access to the host machine.</p>
        </div>
      </div>

      <div className="flex-1 bg-[#0a0a0a] rounded-xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden font-mono">
        {/* Terminal Header */}
        <div className="bg-[#1a1a1a] p-3 border-b border-slate-800 flex items-center gap-2 flex-shrink-0">
          <div className="flex gap-1.5 px-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <div className="text-slate-400 text-xs ml-4 font-semibold tracking-wider">root@gearrent-production:~</div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 overflow-auto p-4 space-y-2 text-sm">
          {history.map((entry, idx) => (
            <div key={idx} className={`${
              entry.type === 'sys' ? 'text-slate-400' :
              entry.type === 'cmd' ? 'text-white flex gap-2' :
              'text-emerald-400'
            }`}>
              {entry.type === 'cmd' && <ChevronRight className="w-4 h-4 text-sky-400 mt-0.5" />}
              <span>{entry.text}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Terminal Input */}
        <div className="p-4 bg-[#111] border-t border-slate-800 flex items-center gap-2 text-sm flex-shrink-0">
          <ChevronRight className="w-5 h-5 text-sky-400" />
          <form onSubmit={handleCommand} className="flex-1">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-transparent text-white outline-none font-mono placeholder:text-slate-700"
              placeholder="Enter command..."
              autoFocus
              spellCheck="false"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
