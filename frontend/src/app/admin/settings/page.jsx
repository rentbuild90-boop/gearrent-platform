"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const handleSave = () => {
    toast.success("Platform settings updated successfully");
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-24 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground mt-1">Manage global configurations for the GearRent platform.</p>
        </div>
        <Button onClick={handleSave} className="w-full sm:w-auto">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Platform Details</CardTitle>
              <CardDescription>Update the basic identity and support information for the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform Name</label>
                <Input defaultValue="GearRent" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Support Email</label>
                <Input defaultValue="support@gearrent.com" type="email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Support Phone</label>
                <Input defaultValue="+91 1800 123 4567" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>Disable access to the platform for scheduled maintenance.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-between p-6 border rounded-lg bg-muted/20">
              <div className="space-y-0.5">
                <label className="text-base font-medium">Enable Maintenance Mode</label>
                <p className="text-sm text-muted-foreground">Only administrators will be able to log in.</p>
              </div>
              <Switch />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Fee Structure</CardTitle>
              <CardDescription>Configure the commission rates taken by the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Standard Platform Fee (%)</label>
                <Input defaultValue="10" type="number" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Driver Matching Fee (Flat ₹)</label>
                <Input defaultValue="150" type="number" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Verification Requirements</CardTitle>
              <CardDescription>Set the minimum verification required for platform participants.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-row items-center justify-between p-4 border rounded-lg bg-muted/20">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Require KYC for Owners</label>
                  <p className="text-xs text-muted-foreground">Owners cannot list equipment until verified.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex flex-row items-center justify-between p-4 border rounded-lg bg-muted/20">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Require Background Check for Drivers</label>
                  <p className="text-xs text-muted-foreground">Drivers cannot accept jobs until cleared.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
