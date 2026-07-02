"use client";

import React, { useState } from "react";
import { HardDrive, Search, Image as ImageIcon, FileText, Video, Trash2, Download } from "lucide-react";

export default function StorageManagerPage() {
  const [activeTab, setActiveTab] = useState("images");

  const storageItems = [
    { name: "equipment_104_front.jpg", type: "image", size: "2.4 MB", date: "10 mins ago" },
    { name: "user_avatar_891.png", type: "image", size: "150 KB", date: "1 hour ago" },
    { name: "invoice_august_2023.pdf", type: "document", size: "1.2 MB", date: "2 hours ago" },
    { name: "kyc_document_user_12.pdf", type: "document", size: "4.5 MB", date: "5 hours ago" },
    { name: "excavator_operation.mp4", type: "video", size: "45.2 MB", date: "1 day ago" },
  ];

  const getFilteredItems = () => {
    return storageItems.filter(item => {
      if (activeTab === "images") return item.type === "image";
      if (activeTab === "documents") return item.type === "document";
      if (activeTab === "videos") return item.type === "video";
      return true;
    });
  };

  const getIcon = (type) => {
    if (type === 'image') return <ImageIcon className="w-5 h-5 text-sky-500" />;
    if (type === 'document') return <FileText className="w-5 h-5 text-rose-500" />;
    if (type === 'video') return <Video className="w-5 h-5 text-purple-500" />;
    return <HardDrive className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500/20 p-3 rounded-xl border border-sky-500/30">
            <HardDrive className="w-6 h-6 text-sky-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-background">Storage Manager</h1>
            <p className="text-outline text-sm">Manage file uploads, S3 buckets, and local storage limits.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-center">
          <p className="text-sm font-semibold text-outline uppercase tracking-wider mb-2">Total Used</p>
          <h3 className="text-3xl font-bold text-on-background">415 <span className="text-xl text-outline">GB</span></h3>
          <div className="w-full bg-surface-container h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-sky-500 h-full w-[41%]"></div>
          </div>
          <p className="text-xs text-outline mt-2">41% of 1 TB Limit</p>
        </div>
        
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
          <p className="text-sm font-semibold text-outline uppercase tracking-wider mb-4">Breakdown</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-on-background"><ImageIcon className="w-4 h-4 text-sky-500" /> Images</span>
              <span className="font-semibold text-on-surface-variant">250 GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-on-background"><Video className="w-4 h-4 text-purple-500" /> Videos</span>
              <span className="font-semibold text-on-surface-variant">120 GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-on-background"><FileText className="w-4 h-4 text-rose-500" /> Documents</span>
              <span className="font-semibold text-on-surface-variant">45 GB</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-center gap-3">
           <button className="w-full py-2 bg-surface-container hover:bg-surface-container-highest text-on-background rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <Trash2 className="w-4 h-4" /> Clear Temp Files
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="flex border-b border-outline-variant/30 bg-surface-container-low flex-wrap">
          {["all", "images", "documents", "videos"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-bold capitalize transition-colors border-b-2 ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-outline hover:text-on-background'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="p-4 bg-surface-container-lowest border-b border-outline-variant/30 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search files..."
              className="w-full bg-surface-container text-on-background text-sm rounded-lg pl-9 pr-4 py-2 outline-none border border-outline-variant/50 focus:border-primary transition-all"
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low text-outline text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold w-12"></th>
              <th className="p-4 font-semibold">File Name</th>
              <th className="p-4 font-semibold">Size</th>
              <th className="p-4 font-semibold">Uploaded</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {getFilteredItems().map((item, i) => (
              <tr key={i} className="border-b border-outline-variant/30 hover:bg-surface-container/30 group">
                <td className="p-4">{getIcon(item.type)}</td>
                <td className="p-4 font-medium text-on-background">{item.name}</td>
                <td className="p-4 text-on-surface-variant font-mono">{item.size}</td>
                <td className="p-4 text-outline">{item.date}</td>
                <td className="p-4 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-primary hover:bg-primary/10 p-2 rounded transition-colors"><Download className="w-4 h-4" /></button>
                  <button className="text-rose-500 hover:bg-rose-500/10 p-2 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
