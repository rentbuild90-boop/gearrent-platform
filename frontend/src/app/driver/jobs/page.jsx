"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Calendar, Truck, Check, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function DriverJobsPage() {
  const [jobs, setJobs] = useState([
    {
      id: "JOB-9021",
      equipment: "Tata Hitachi ZAXIS Excavator",
      client: "BuildTech Infrastructure",
      date: "02 Jul 2026",
      time: "08:00 AM - 05:00 PM",
      pickup: "Equipment Depot, Andheri East",
      dropoff: "Site A, BKC",
      payout: 950,
      status: "pending"
    },
    {
      id: "JOB-9022",
      equipment: "Escorts Hydra Crane",
      client: "L&T Projects",
      date: "04 Jul 2026",
      time: "09:00 AM - 06:00 PM",
      pickup: "Yard 4, Navi Mumbai",
      dropoff: "Metro Line 3, Colaba",
      payout: 1200,
      status: "pending"
    }
  ]);

  const [activeJobs, setActiveJobs] = useState([
    {
      id: "JOB-9018",
      equipment: "JCB 3DX Excavator",
      client: "Rajesh Construction",
      date: "Today",
      time: "08:00 AM - 05:00 PM",
      pickup: "Equipment Depot, Andheri East",
      dropoff: "Metro Construction Site, BKC",
      payout: 850,
      status: "active"
    }
  ]);

  const handleAction = (id, action) => {
    if (action === 'accept') {
      const jobToMove = jobs.find(j => j.id === id);
      setJobs(jobs.filter(j => j.id !== id));
      setActiveJobs([...activeJobs, { ...jobToMove, status: 'upcoming', date: 'Upcoming' }]);
      toast.success(`Job ${id} accepted successfully!`);
    } else {
      setJobs(jobs.filter(j => j.id !== id));
      toast.error(`Job ${id} declined.`);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Board</h1>
        <p className="text-muted-foreground mt-1">Review and manage your assigned tasks.</p>
      </div>

      {/* Pending Job Requests */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          New Requests <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">{jobs.length}</span>
        </h2>
        
        <AnimatePresence>
          {jobs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-8 border-2 border-dashed border-border rounded-xl text-muted-foreground"
            >
              No new job requests at the moment.
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  layout
                >
                  <Card className="border-primary/20 shadow-sm relative overflow-hidden h-full flex flex-col">
                    <div className="absolute top-0 right-0 p-4 font-bold text-xl text-primary bg-primary/5 rounded-bl-xl">
                      ₹{job.payout}
                    </div>
                    <CardHeader className="pb-2 pr-20">
                      <CardTitle className="text-lg">{job.equipment}</CardTitle>
                      <CardDescription>{job.client}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" /> {job.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" /> {job.time}
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2 bg-muted/50 p-2 rounded-md">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                        <div>
                          <p><span className="font-medium text-foreground">From:</span> {job.pickup}</p>
                          <p><span className="font-medium text-foreground">To:</span> {job.dropoff}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => handleAction(job.id, 'decline')}
                      >
                        <X className="mr-2 h-4 w-4" /> Decline
                      </Button>
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAction(job.id, 'accept')}
                      >
                        <Check className="mr-2 h-4 w-4" /> Accept
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Active/Upcoming Jobs */}
      <div className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold">Your Schedule</h2>
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {activeJobs.map((job) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-border shadow-sm flex flex-col md:flex-row md:items-center p-4 gap-4">
                  <div className="bg-primary/10 p-4 rounded-xl flex items-center justify-center shrink-0">
                    <Truck className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {job.status === 'active' ? 'Active Now' : 'Upcoming'}
                      </span>
                      <span className="text-sm font-medium text-muted-foreground">{job.id}</span>
                    </div>
                    <h3 className="font-bold text-lg">{job.equipment}</h3>
                    <p className="text-sm text-muted-foreground">{job.client} • {job.date}</p>
                  </div>
                  <div className="md:text-right space-y-2 shrink-0">
                    <p className="font-bold text-xl text-primary">₹{job.payout}</p>
                    <Button variant={job.status === 'active' ? "default" : "outline"} size="sm" className="w-full md:w-auto">
                      {job.status === 'active' ? 'View Details' : 'View Schedule'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
