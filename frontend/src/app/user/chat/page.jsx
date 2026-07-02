"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Phone, MoreVertical, ChevronLeft, Search } from "lucide-react";

import { fetchWithCSRF } from "@/lib/api";
import { toast } from "sonner";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputText, setInputText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const scrollRef = useRef(null);
  const activeConvIdRef = useRef(activeConvId);

  useEffect(() => {
    activeConvIdRef.current = activeConvId;
  }, [activeConvId]);

  // Load User & Conversations
  useEffect(() => {
    async function init() {
      try {
        const userRes = await fetchWithCSRF("/api/user/profile");
        const userData = await userRes.json();
        if (userData?.data) setCurrentUser(userData.data);

        const convRes = await fetchWithCSRF("/api/chat/conversations");
        const convData = await convRes.json();
        if (convData?.data) {
          const formatted = convData.data.map(c => ({
            id: c.id,
            name: c.title || `Conversation #${c.id}`,
            avatar: "https://i.pravatar.cc/150?u=" + c.id,
            lastMessage: c.last_message_preview || "No messages yet.",
            time: c.last_message_at ? new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
            unread: 0,
            online: false,
          }));
          setConversations(formatted);
          if (formatted.length > 0) setActiveConvId(formatted[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    init();
  }, []);

  // WebSocket Connection for Realtime Messages
  useEffect(() => {
    const token = getCookie("access_token");
    if (!token) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = process.env.NEXT_PUBLIC_API_URL 
      ? new URL(process.env.NEXT_PUBLIC_API_URL).host 
      : "localhost:8000";
      
    const wsUrl = `${protocol}//${host}/api/chat/ws?token=${token}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("Connected to chat realtime");
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const convId = msg.conversation_id;

      const newMessage = {
        id: msg.id.toString(),
        senderId: msg.sender_id,
        text: msg.content,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => ({
        ...prev,
        [convId]: [...(prev[convId] || []), newMessage]
      }));

      setConversations(prev => prev.map(c => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: msg.content.length > 50 ? msg.content.substring(0, 50) + "..." : msg.content,
            time: newMessage.time,
            unread: c.id === activeConvIdRef.current ? c.unread : c.unread + 1
          };
        }
        return c;
      }));
    };

    return () => {
      socket.close();
    };
  }, []);

  // Load Messages for active conversation
  useEffect(() => {
    if (!activeConvId) return;
    async function loadMessages() {
      try {
        const res = await fetchWithCSRF(`/api/chat/conversations/${activeConvId}/messages`);
        const data = await res.json();
        if (data?.data) {
          const formattedMsgs = data.data.map(m => ({
            id: m.id.toString(),
            senderId: m.sender_id,
            text: m.content,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));
          setMessages(prev => ({ ...prev, [activeConvId]: formattedMsgs }));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadMessages();
  }, [activeConvId]);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const activeMessages = messages[activeConvId] || [];
  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    const content = inputText.trim();
    setInputText(""); // Optimistic clear

    try {
      const res = await fetchWithCSRF("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: activeConvId,
          content: content,
          message_type: "TEXT"
        })
      });
      const data = await res.json();
      
      if (res.ok && data?.data) {
        const m = data.data;
        const newMessage = {
          id: m.id.toString(),
          senderId: m.sender_id,
          text: m.content,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => ({
          ...prev,
          [activeConvId]: [...(prev[activeConvId] || []), newMessage]
        }));
      } else {
        toast.error("Failed to send message");
      }
    } catch (err) {
      toast.error("Error sending message");
    }
  };

  return (
    <div className="container mx-auto p-2 md:p-6 h-[calc(100vh-80px)] flex flex-col animate-in fade-in duration-500">
      
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground text-sm">Communicate with owners and drivers.</p>
      </div>

      <Card className="flex-1 flex overflow-hidden border-border bg-card shadow-sm min-h-[500px]">
        
        {/* Conversations Sidebar */}
        <div className={`w-full md:w-[320px] lg:w-[380px] border-r border-border flex flex-col ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search messages..." 
                className="pl-9 bg-muted/50 border-none" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left
                    ${activeConvId === conv.id ? 'bg-primary/10' : 'hover:bg-muted/50'}
                  `}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-12 w-12 border border-border/50">
                      <AvatarImage src={conv.avatar} />
                      <AvatarFallback>{conv.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"></span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-semibold text-sm truncate">{conv.name}</h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{conv.time}</span>
                    </div>
                    <p className={`text-sm truncate ${activeConvId === conv.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-1">
                      {conv.unread}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex-col min-w-0 ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Chat Header */}
          <div className="h-16 px-4 md:px-6 border-b border-border flex items-center justify-between bg-card shrink-0">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={() => setActiveConvId(null)}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10 border border-border/50">
                <AvatarImage src={activeConv?.avatar} />
                <AvatarFallback>{activeConv?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">{activeConv?.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {activeConv?.online ? (
                    <><span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span> Online</>
                  ) : (
                    "Offline"
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => toast.info("Calling feature coming soon")}>
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => toast.info("More options coming soon")}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-muted/20"
            ref={scrollRef}
          >
            {activeMessages.length === 0 && (
              <div className="text-center text-muted-foreground pt-10">No messages in this conversation yet.</div>
            )}
            {activeMessages.map((msg) => {
              const isMe = currentUser ? msg.senderId === currentUser.id : false;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex gap-2 max-w-[85%] md:max-w-[70%]">
                    {!isMe && (
                      <Avatar className="h-8 w-8 shrink-0 mt-auto border border-border/50 hidden md:block">
                        <AvatarImage src={activeConv?.avatar} />
                        <AvatarFallback>{activeConv?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className="flex flex-col gap-1">
                      <div 
                        className={`p-3 px-4 rounded-2xl ${
                          isMe 
                            ? 'bg-primary text-primary-foreground rounded-br-sm' 
                            : 'bg-card border border-border rounded-bl-sm shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      <span className={`text-[10px] text-muted-foreground ${isMe ? 'text-right pr-1' : 'pl-1'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-card border-t border-border shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2 items-end relative">
              <div className="flex-1 relative">
                <Input 
                  placeholder="Type a message..." 
                  className="pr-12 py-6 rounded-full bg-muted/50 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                size="icon" 
                className={`rounded-full h-12 w-12 shrink-0 transition-all ${inputText.trim() ? 'scale-100 opacity-100' : 'scale-90 opacity-50'}`}
                disabled={!inputText.trim()}
              >
                <Send className="h-5 w-5 ml-1" />
              </Button>
            </form>
          </div>
          
        </div>
      </Card>
    </div>
  );
}
