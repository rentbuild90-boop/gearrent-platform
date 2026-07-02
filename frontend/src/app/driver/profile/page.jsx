"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, User, MapPin, Phone, Mail, Award, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function DriverProfilePage() {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Driver Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information and documents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          {/* Identity Card */}
          <Card className="shadow-sm border-border text-center overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/80 to-accent"></div>
            <CardContent className="pt-0 relative px-4 pb-6">
              <Avatar className="h-24 w-24 mx-auto -mt-12 border-4 border-background bg-background shadow-md">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="text-2xl font-bold text-primary">RK</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mt-4">Ravi Kumar</h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 shadow-none border-none">
                  Verified Driver
                </Badge>
              </div>
              <div className="flex items-center justify-center gap-4 mt-6 border-t border-border pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-xs text-muted-foreground uppercase flex items-center gap-1 justify-center"><Award className="h-3 w-3" /> Rating</p>
                </div>
                <div className="w-px h-8 bg-border"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold">142</p>
                  <p className="text-xs text-muted-foreground uppercase flex items-center gap-1 justify-center"><CheckCircle className="h-3 w-3" /> Trips</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experience Card */}
          <Card className="shadow-sm border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Excavators</Badge>
                <Badge variant="secondary">Cranes</Badge>
                <Badge variant="secondary">Loaders</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                8+ years of experience operating heavy machinery in urban environments.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your contact details and address.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" /> Full Name
                    </label>
                    <Input defaultValue="Ravi Kumar" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" /> Mobile Number
                    </label>
                    <Input type="tel" defaultValue="+91 98765 12345" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" /> Email Address
                    </label>
                    <Input type="email" defaultValue="ravi.kumar@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" /> Address
                    </label>
                    <Input defaultValue="Navi Mumbai, Maharashtra" />
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

          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle>Licenses & Documents</CardTitle>
              <CardDescription>Your verified operational licenses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Heavy Motor Vehicle License", exp: "Valid till 2030", status: "Verified" },
                { title: "Crane Operator Certification", exp: "Valid till 2028", status: "Verified" },
                { title: "Background Verification", exp: "Completed Jan 2026", status: "Verified" },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">{doc.title}</label>
                    <p className="text-xs text-muted-foreground">{doc.exp}</p>
                  </div>
                  <Badge variant="default" className="bg-green-500/10 text-green-600 shadow-none border-none">
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
