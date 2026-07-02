"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

export function MockChart({ title, description, data = [], type = "bar", height = "h-64", valuePrefix = "₹" }) {
  
  const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero

  return (
    <Card className="border-border shadow-sm flex flex-col h-full w-full">
      {(title || description) && (
        <CardHeader className="bg-muted/10 border-b border-border py-4">
          {title && <CardTitle className="text-base font-semibold">{title}</CardTitle>}
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={`p-0 overflow-x-auto ${height}`}>
        <div className="p-6 flex-1 flex items-end gap-2 min-w-[400px] h-full">
          {data.map((item, index) => {
            const heightPercentage = (item.value / maxValue) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] py-1 px-2 rounded absolute -mt-8 pointer-events-none whitespace-nowrap z-10">
                  {valuePrefix}{item.value.toLocaleString()}
                </div>
                
                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.05, ease: "easeOut" }}
                  className={`w-full max-w-[40px] rounded-t-sm transition-colors ${
                    index === data.length - 1 ? 'bg-primary' : 'bg-primary/40 group-hover:bg-primary/60'
                  }`}
                />
                
                {/* Label */}
                <span className="text-[10px] text-muted-foreground font-medium truncate w-full text-center">
                  {item.month || item.day || item.name}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
