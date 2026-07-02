"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, Database, Server, LogOut, Code2, Rocket, GitBranch, 
  TerminalSquare, Box, HeartPulse, PieChart, Shield, Lock, 
  HardDrive, History, FileText, Bot, Webhook, Key, Bell, 
  AlertOctagon, ToggleRight, Fingerprint, Layers, Cpu, Cloud,
  ChevronDown, ChevronRight, ChevronLeft
} from "lucide-react";

const navGroups = [
  {
    title: "Core & Health",
    items: [
      { name: "System Overview", href: "/developer/overview", icon: Cpu },
      { name: "Service Manager", href: "/developer/services", icon: Layers },
      { name: "Health Center", href: "/developer/health", icon: HeartPulse },
      { name: "Analytics", href: "/developer/analytics", icon: PieChart },
    ]
  },
  {
    title: "Code & Deploy",
    items: [
      { name: "Terminal UI", href: "/developer/terminal", icon: TerminalSquare },
      { name: "Deployment", href: "/developer/deployment", icon: Rocket },
      { name: "Git Integration", href: "/developer/git", icon: GitBranch },
      { name: "Env Variables", href: "/developer/environment", icon: Box },
      { name: "Feature Flags", href: "/developer/features", icon: ToggleRight },
    ]
  },
  {
    title: "Database & Data",
    items: [
      { name: "DB Editor", href: "/developer/database", icon: Database },
      { name: "Redis Monitor", href: "/developer/redis", icon: Server },
      { name: "Storage", href: "/developer/storage", icon: HardDrive },
      { name: "Backups", href: "/developer/backups", icon: Cloud },
    ]
  },
  {
    title: "Monitoring & Logs",
    items: [
      { name: "Live Monitoring", href: "/developer/monitoring", icon: Activity },
      { name: "Logs Viewer", href: "/developer/logs", icon: FileText },
      { name: "Queue Monitor", href: "/developer/queue", icon: Layers },
      { name: "Audit Logs", href: "/developer/audit", icon: History },
    ]
  },
  {
    title: "Tools & Simulators",
    items: [
      { name: "AI Assistant", href: "/developer/ai", icon: Bot },
      { name: "API Explorer", href: "/developer/api-explorer", icon: Webhook },
      { name: "User Simulator", href: "/developer/simulator", icon: Fingerprint },
      { name: "Webhook Tester", href: "/developer/webhooks", icon: Webhook },
    ]
  },
  {
    title: "Security & Access",
    items: [
      { name: "Security", href: "/developer/security", icon: Shield },
      { name: "API Keys", href: "/developer/api-keys", icon: Key },
      { name: "Notifications", href: "/developer/notifications", icon: Bell },
      { name: "Maintenance", href: "/developer/maintenance", icon: AlertOctagon },
    ]
  }
];

export function DeveloperSidebar({ isCollapsed, setIsCollapsed }) {
  const pathname = usePathname();
  // Open first two groups by default, close others to save space
  const [openGroups, setOpenGroups] = useState({
    "Core & Health": true,
    "Code & Deploy": true,
  });

  const toggleGroup = (title) => {
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <nav className={`h-screen transition-all duration-300 fixed left-0 top-0 border-r border-[#1e293b] shadow-2xl flex flex-col py-4 bg-[#0f172a] z-50 hidden md:flex ${
      isCollapsed ? "w-[80px]" : "w-[280px]"
    }`}>
      {/* Sidebar Header */}
      <div className={`text-white font-extrabold text-2xl pb-6 pt-4 border-b border-[#1e293b] flex items-center flex-shrink-0 transition-all duration-300 ${
        isCollapsed ? "px-2 flex-col gap-4 justify-center" : "px-6 justify-between"
      }`}>
        <div className="flex items-center gap-3">
          <Code2 className="w-8 h-8 text-sky-500 flex-shrink-0" />
          {!isCollapsed && (
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-500 whitespace-nowrap">
              DevTools
            </span>
          )}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800 transition-colors flex items-center justify-center"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Navigation Groups */}
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar py-2">
        {navGroups.map((group, groupIdx) => {
          const isOpen = openGroups[group.title];
          
          return (
            <div key={group.title} className="mb-2">
              {isCollapsed ? (
                // Divider in collapsed mode
                groupIdx > 0 && <div className="border-t border-slate-800/80 mx-4 my-2"></div>
              ) : (
                <button 
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
                >
                  {group.title}
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              )}
              
              {(isOpen || isCollapsed) && (
                <div className="mt-1 flex flex-col gap-1">
                  {group.items.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    
                    return (
                      <Link 
                        key={link.href} 
                        href={link.href} 
                        title={isCollapsed ? link.name : ""}
                        className={`py-2 px-3 mx-2 rounded-lg flex items-center transition-all duration-200 ${
                          isCollapsed ? "justify-center" : "px-6 gap-3"
                        } ${
                          isActive 
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" 
                            : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent"
                        }`}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                        {!isCollapsed && <span>{link.name}</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Sidebar Footer */}
      <div className={`mt-auto pt-4 border-t border-slate-800 flex flex-col gap-4 flex-shrink-0 transition-all duration-300 ${
        isCollapsed ? "px-2" : "px-6"
      }`}>
        <Link 
          href="/admin"
          title={isCollapsed ? "Exit Developer Mode" : ""}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm font-semibold"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" /> 
          {!isCollapsed && <span>Exit Developer Mode</span>}
        </Link>
      </div>
    </nav>
  );
}
