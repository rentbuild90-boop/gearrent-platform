"use client";

import React, { useState } from "react";
import { Bell, Send, Smartphone, Mail, MessageCircle, Play } from "lucide-react";

export default function NotificationsTesterPage() {
  const [activeTab, setActiveTab] = useState("email");
  const [sending, setSending] = useState(false);

  const handleTest = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      alert(`Test ${activeTab} notification sent successfully!`);
    }, 1200);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-fuchsia-500/20 p-3 rounded-xl border border-fuchsia-500/30">
          <Bell className="w-6 h-6 text-fuchsia-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">Notification Tester</h1>
          <p className="text-outline text-sm">Preview templates and send test messages across channels.</p>
        </div>
      </div>

      <div className="flex border-b border-outline-variant/30">
        <button 
          onClick={() => setActiveTab('email')}
          className={`px-6 py-4 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'email' ? 'border-primary text-primary' : 'border-transparent text-outline hover:text-on-background'}`}
        >
          <Mail className="w-4 h-4" /> Email (SMTP)
        </button>
        <button 
          onClick={() => setActiveTab('sms')}
          className={`px-6 py-4 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'sms' ? 'border-primary text-primary' : 'border-transparent text-outline hover:text-on-background'}`}
        >
          <Smartphone className="w-4 h-4" /> SMS (Twilio)
        </button>
        <button 
          onClick={() => setActiveTab('whatsapp')}
          className={`px-6 py-4 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'whatsapp' ? 'border-primary text-primary' : 'border-transparent text-outline hover:text-on-background'}`}
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Editor */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-on-background mb-2">Recipient</label>
            <input 
              type="text" 
              defaultValue={activeTab === 'email' ? 'developer@gearrent.com' : '+91 98765 43210'}
              className="w-full bg-surface-container text-on-background rounded-lg px-4 py-2 outline-none border border-outline-variant/50 focus:border-primary transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-background mb-2">Template Variables (JSON)</label>
            <textarea 
              rows="3"
              defaultValue={'{\n  "user_name": "Rajeev",\n  "booking_id": "BKG-9012"\n}'}
              className="w-full bg-[#1e1e1e] text-green-400 font-mono text-sm border border-outline/30 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
              spellCheck="false"
            ></textarea>
          </div>

          <button 
            onClick={handleTest}
            disabled={sending}
            className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {sending ? "Sending..." : <><Send className="w-4 h-4" /> Send Test Notification</>}
          </button>
        </div>

        {/* Preview */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center min-h-[400px] bg-slate-100 dark:bg-[#0f172a]">
          {activeTab === 'email' && (
            <div className="w-full max-w-sm bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200">
              <div className="bg-primary p-4 text-center">
                <span className="text-xl font-bold text-white">GearRent</span>
              </div>
              <div className="p-6 text-slate-800 space-y-4">
                <p className="font-semibold text-lg">Booking Confirmed!</p>
                <p>Hi Rajeev,</p>
                <p>Your equipment booking BKG-9012 has been confirmed by the owner.</p>
                <button className="w-full bg-primary text-white py-2 rounded font-bold mt-4">View Booking</button>
              </div>
            </div>
          )}

          {activeTab === 'sms' && (
            <div className="w-[300px] bg-white rounded-3xl shadow-xl border-[8px] border-slate-800 p-4 min-h-[500px] flex flex-col justify-end pb-12 relative">
               <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-800 rounded-b-xl"></div>
               <div className="bg-emerald-500 text-white p-3 rounded-2xl rounded-br-sm text-sm self-end max-w-[80%] shadow-sm">
                 GearRent: Hi Rajeev, your booking BKG-9012 is confirmed. Track it here: https://gearrent.com/b/9012
               </div>
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="w-[300px] bg-[#efeae2] rounded-3xl shadow-xl border-[8px] border-slate-800 p-4 min-h-[500px] flex flex-col justify-end pb-12 relative">
               <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-800 rounded-b-xl"></div>
               <div className="bg-[#dcf8c6] text-slate-800 p-3 rounded-xl rounded-tl-none text-sm self-start max-w-[90%] shadow-sm mb-2">
                 ✅ *Booking Confirmed*
                 <br/><br/>
                 Hi Rajeev,
                 <br/>
                 Your booking *BKG-9012* is now active.
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
