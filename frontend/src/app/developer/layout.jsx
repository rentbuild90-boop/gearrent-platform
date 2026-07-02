"use client";

import React, { useState } from "react";
import { DeveloperSidebar } from "@/components/DeveloperSidebar";

export default function DeveloperLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-300">
      <DeveloperSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className={`transition-all duration-300 ${isCollapsed ? "md:ml-[80px]" : "md:ml-[280px]"} min-h-screen`}>
        {children}
      </main>
    </div>
  );
}
