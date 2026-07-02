"use client";

import React from "react";
import { Layers, Clock, AlertCircle, CheckCircle2, RotateCcw, XCircle } from "lucide-react";

export default function QueueMonitorPage() {
  const jobs = [
    { id: "job_091", name: "ProcessInvoicePdf", status: "running", attempt: 1, time: "2 mins ago" },
    { id: "job_090", name: "SendSmsNotification", status: "failed", attempt: 3, time: "15 mins ago" },
    { id: "job_089", name: "SendEmailVerification", status: "completed", attempt: 1, time: "1 hour ago" },
    { id: "job_088", name: "SyncStripePayments", status: "completed", attempt: 1, time: "2 hours ago" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30">
          <Layers className="w-6 h-6 text-indigo-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">Queue Monitor</h1>
          <p className="text-outline text-sm">Background jobs, workers, and task scheduling (Celery/BullMQ).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
          <div className="bg-sky-500/20 p-3 rounded-full"><Clock className="w-6 h-6 text-sky-500" /></div>
          <div>
            <p className="text-sm font-semibold text-outline uppercase tracking-wider">Pending</p>
            <h3 className="text-2xl font-bold text-on-background mt-1">12</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
          <div className="bg-amber-500/20 p-3 rounded-full"><RotateCcw className="w-6 h-6 text-amber-500" /></div>
          <div>
            <p className="text-sm font-semibold text-outline uppercase tracking-wider">Running</p>
            <h3 className="text-2xl font-bold text-on-background mt-1">4</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
          <div className="bg-emerald-500/20 p-3 rounded-full"><CheckCircle2 className="w-6 h-6 text-emerald-500" /></div>
          <div>
            <p className="text-sm font-semibold text-outline uppercase tracking-wider">Completed</p>
            <h3 className="text-2xl font-bold text-on-background mt-1">1,204</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
          <div className="bg-rose-500/20 p-3 rounded-full"><XCircle className="w-6 h-6 text-rose-500" /></div>
          <div>
            <p className="text-sm font-semibold text-outline uppercase tracking-wider">Failed</p>
            <h3 className="text-2xl font-bold text-on-background mt-1">3</h3>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
          <h2 className="text-lg font-bold text-on-background">Recent Jobs</h2>
          <div className="flex gap-2">
            <select className="bg-surface-container text-on-background text-sm rounded-lg px-4 py-2 outline-none border border-outline-variant/50 focus:border-indigo-500 transition-all">
              <option>All Queues</option>
              <option>emails</option>
              <option>default</option>
              <option>critical</option>
            </select>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low text-outline text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Job ID</th>
              <th className="p-4 font-semibold">Task Name</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Attempt</th>
              <th className="p-4 font-semibold">Time</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-outline-variant/30 hover:bg-surface-container/30">
                <td className="p-4 font-mono text-outline text-xs">{job.id}</td>
                <td className="p-4 font-semibold text-on-background">{job.name}</td>
                <td className="p-4">
                  {job.status === "completed" && <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded text-xs font-bold uppercase">Completed</span>}
                  {job.status === "running" && <span className="text-amber-500 bg-amber-500/10 px-2 py-1 rounded text-xs font-bold uppercase animate-pulse">Running</span>}
                  {job.status === "failed" && <span className="text-rose-500 bg-rose-500/10 px-2 py-1 rounded text-xs font-bold uppercase">Failed</span>}
                </td>
                <td className="p-4 text-on-surface-variant text-center">{job.attempt}</td>
                <td className="p-4 text-on-surface-variant flex items-center gap-2 mt-1"><Clock className="w-3 h-3"/> {job.time}</td>
                <td className="p-4 text-right space-x-2">
                  <button className="text-sky-500 hover:bg-sky-500/10 px-3 py-1.5 rounded text-xs font-semibold transition-colors">Details</button>
                  {job.status === 'failed' && (
                    <button className="text-rose-500 hover:bg-rose-500/10 px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1 inline-flex">
                      <RotateCcw className="w-3 h-3"/> Retry
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
