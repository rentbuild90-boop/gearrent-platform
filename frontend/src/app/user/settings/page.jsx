"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, Bell, Shield, Key, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchWithCSRF } from "@/lib/api";
import { SecuritySettings } from "@/components/security/SecuritySettings";

// Simple accessible toggle switch component
function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between cursor-pointer w-full py-2">
      <span className="text-sm font-medium text-foreground pr-4">{label}</span>
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted border border-border'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-4' : ''}`}></div>
      </div>
    </label>
  );
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [notifications, setNotifications] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    promotional_emails: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetchWithCSRF("/api/user/profile");
        const data = await res.json();
        if (res.ok && data?.data) {
          const u = data.data;
          setProfileData({
            name: `${u.first_name || ""} ${u.last_name || ""}`.trim(),
            email: u.email || "",
            phone: `${u.country_code || ""}${u.phone || ""}` || ""
          });
        }
        
        const prefsRes = await fetchWithCSRF("/api/user/preferences");
        const prefsData = await prefsRes.json();
        if (prefsRes.ok && prefsData?.data) {
          setNotifications(prev => ({ ...prev, ...prefsData.data }));
        }
      } catch (err) {
        toast.error("Failed to load profile.");
      } finally {
        setInitialLoad(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const parts = profileData.name.trim().split(" ");
      const first_name = parts[0] || "";
      const last_name = parts.slice(1).join(" ") || "";
      
      const res = await fetchWithCSRF("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, last_name })
      });
      
      if (res.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to update settings.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      const res = await fetchWithCSRF("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications })
      });
      if (res.ok) {
        toast.success("Preferences saved successfully!");
      } else {
        toast.error("Failed to update preferences.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetchWithCSRF("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          current_password: passwordData.currentPassword, 
          new_password: passwordData.newPassword 
        })
      });
      if (res.ok) {
        toast.success("Password updated successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const data = await res.json();
        toast.error(data?.detail || "Failed to update password.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24 md:pb-8 max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and configurations.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6 bg-muted/50 rounded-lg p-1">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6 outline-none">
          <Card className="border-border shadow-sm">
            <CardHeader className="border-b border-border bg-muted/20">
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {initialLoad ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
              <div className="flex flex-col md:flex-row gap-8 items-start">
                
                <div className="flex flex-col items-center gap-3">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-2 border-primary/20">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-2xl">JD</AvatarFallback>
                    </Avatar>
                    <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-6 w-6 text-white" />
                    </button>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">Change Photo</Button>
                </div>

                <form className="flex-1 space-y-4 w-full" onSubmit={handleSave}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input 
                      value={profileData.name} 
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input 
                      type="email" 
                      value={profileData.email} 
                      readOnly
                      className="bg-muted/50 text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input 
                      type="tel" 
                      value={profileData.phone} 
                      readOnly
                      className="bg-muted/50 text-muted-foreground"
                    />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={loading} className="w-full md:w-auto px-8">
                      {loading ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                    </Button>
                  </div>
                </form>

              </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6 outline-none">
          <Card className="border-border shadow-sm">
            <CardHeader className="border-b border-border bg-muted/20">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" /> Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-2 divide-y divide-border">
              <ToggleSwitch 
                label="Email Notifications (Booking updates, receipts)" 
                checked={notifications.email_notifications} 
                onChange={() => setNotifications({...notifications, email_notifications: !notifications.email_notifications})} 
              />
              <ToggleSwitch 
                label="Push Notifications (Messages, live updates)" 
                checked={notifications.push_notifications} 
                onChange={() => setNotifications({...notifications, push_notifications: !notifications.push_notifications})} 
              />
              <ToggleSwitch 
                label="SMS Notifications (Urgent alerts only)" 
                checked={notifications.sms_notifications} 
                onChange={() => setNotifications({...notifications, sms_notifications: !notifications.sms_notifications})} 
              />
              <ToggleSwitch 
                label="Marketing & Promotional Offers" 
                checked={notifications.promotional_emails} 
                onChange={() => setNotifications({...notifications, promotional_emails: !notifications.promotional_emails})} 
              />
              <div className="pt-6 flex justify-end">
                <Button onClick={handleSaveNotifications} className="w-full md:w-auto px-8">
                  <Save className="mr-2 h-4 w-4" /> Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6 outline-none">
          <Card className="border-border shadow-sm mb-6">
            <CardHeader className="border-b border-border bg-muted/20">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Password & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Password</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-muted/50" 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-muted/50" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-muted/50" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                </div>
                <div className="pt-2">
                  <Button type="submit" disabled={loading} className="w-full md:w-auto">
                    {loading ? "Updating..." : <><Key className="mr-2 h-4 w-4" /> Update Password</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <SecuritySettings />
          
          <Card className="border-destructive/20 shadow-sm overflow-hidden">
            <CardContent className="p-6 bg-destructive/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-destructive">Delete Account</h3>
                <p className="text-sm text-muted-foreground mt-1">Permanently remove your account and all data.</p>
              </div>
              <Button variant="destructive" onClick={() => toast.error("Action not permitted in demo mode.")}>
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>
    </motion.div>
  );
}
