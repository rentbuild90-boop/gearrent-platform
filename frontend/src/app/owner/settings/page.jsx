"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, Building, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

export default function OwnerSettingsPage() {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Profile settings updated successfully!");
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and business profile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Card */}
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle>Business Profile</CardTitle>
            <CardDescription>This information will be displayed to clients booking your equipment.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-6 mb-6 items-center sm:items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder-company.jpg" />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">OC</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <Button variant="outline">Change Logo</Button>
                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" /> Company Name
                  </label>
                  <Input defaultValue="Omega Construction Equipment" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" /> Email Address
                  </label>
                  <Input type="email" defaultValue="contact@omegaequip.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" /> Phone Number
                  </label>
                  <Input type="tel" defaultValue="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" /> Registered Address
                  </label>
                  <Input defaultValue="Andheri East, Mumbai, MH" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Business Registration / GSTIN</label>
                  <Input defaultValue="27AADCB2230M1Z2" />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose what updates you want to receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "New Booking Requests", desc: "Get notified when a client requests equipment." },
              { title: "Payment Updates", desc: "Receive alerts for successful and failed payments." },
              { title: "Driver Updates", desc: "Notifications when a driver starts or completes a job." },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">{pref.title}</label>
                  <p className="text-xs text-muted-foreground">{pref.desc}</p>
                </div>
                <div className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary outline-none transition-colors">
                  <span className="translate-x-2 bg-background shadow-sm pointer-events-none block h-4 w-4 rounded-full transition-transform"></span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
