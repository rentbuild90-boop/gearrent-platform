"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fetchWithCSRF } from "@/lib/api";
import { User, Truck, Wrench, Shield, Code, ArrowRight, UserCircle2 } from "lucide-react";

export default function RoleSelectionPage() {
  const roles = [
    {
      id: "user",
      title: "Renter",
      description: "Rent heavy equipment for your projects",
      icon: User,
      color: "from-blue-500 to-sky-400",
      bgLight: "bg-blue-500/10",
      textColor: "text-blue-500",
      href: "/auth/login?role=user",
    },
    {
      id: "owner",
      title: "Equipment Owner",
      description: "List and manage your machinery",
      icon: Wrench,
      color: "from-amber-500 to-orange-400",
      bgLight: "bg-amber-500/10",
      textColor: "text-amber-500",
      href: "/auth/login?role=owner",
    },
    {
      id: "driver",
      title: "Operator / Driver",
      description: "Find jobs operating heavy machinery",
      icon: Truck,
      color: "from-emerald-500 to-teal-400",
      bgLight: "bg-emerald-500/10",
      textColor: "text-emerald-500",
      href: "/auth/login?role=driver",
    },
    {
      id: "admin",
      title: "Administrator",
      description: "Manage platform operations",
      icon: Shield,
      color: "from-indigo-500 to-purple-400",
      bgLight: "bg-indigo-500/10",
      textColor: "text-indigo-500",
      href: "/auth/login?role=admin",
    },
    {
      id: "developer",
      title: "Developer",
      description: "Access system tools and logs",
      icon: Code,
      color: "from-rose-500 to-pink-400",
      bgLight: "bg-rose-500/10",
      textColor: "text-rose-500",
      href: "/auth/developer-login",
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4"
          >
            <span className="text-4xl font-black bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">
              GearRent
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-on-background mb-3"
          >
            Choose your account type
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-outline text-lg"
          >
            Select how you'll be using the platform today
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link href={role.href} className="block group">
                <div className="h-full bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 hover:border-outline-variant shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300 ${role.bgLight}`}>
                    <role.icon className={`w-8 h-8 ${role.textColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-on-background mb-2">{role.title}</h3>
                  <p className="text-sm text-outline mb-6">{role.description}</p>
                  
                  <div className="mt-auto flex items-center justify-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                    Continue as {role.title} <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="relative flex items-center py-5 max-w-md mx-auto">
            <div className="flex-grow border-t border-outline-variant/50"></div>
            <span className="flex-shrink-0 mx-4 text-outline text-sm uppercase tracking-widest">Or</span>
            <div className="flex-grow border-t border-outline-variant/50"></div>
          </div>
          
          <Link href="/user" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-background font-semibold transition-colors mt-4">
            <UserCircle2 className="w-5 h-5" />
            Continue as Guest
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

