"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation2 } from "lucide-react";

export function MockMapCard({ title = "Live Location", height = "h-64", points = [] }) {
  return (
    <Card className="border-border shadow-sm overflow-hidden flex flex-col h-full">
      {title && (
        <CardHeader className="bg-muted/30 border-b border-border py-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Navigation2 className="h-4 w-4 text-primary" /> {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0 flex-1 relative bg-[#e5e3df] dark:bg-[#1a1c19]">
        {/* Fake Map Background Pattern */}
        <div 
          className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.4) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
        <div className="absolute inset-0 opacity-5 dark:opacity-[0.02] pointer-events-none">
          <svg width="100%" height="100%">
            <path d="M0 50 Q 150 10 250 100 T 500 50" fill="none" stroke="black" strokeWidth="15" strokeLinecap="round"/>
            <path d="M100 0 Q 150 200 50 400" fill="none" stroke="black" strokeWidth="10" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Map Pins */}
        {points.length > 0 ? (
          points.map((point, i) => (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
              <div className="bg-primary text-primary-foreground px-2 py-1 rounded shadow-md text-xs font-bold">
                {point.label || "Marker"}
              </div>
              <div className="w-2 h-2 rotate-45 -mt-1 shadow-sm bg-primary"></div>
            </div>
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/80 backdrop-blur px-4 py-2 rounded-full border border-border text-sm font-medium text-muted-foreground flex items-center gap-2 shadow-sm">
              <MapPin className="h-4 w-4" /> Map Placeholder
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
