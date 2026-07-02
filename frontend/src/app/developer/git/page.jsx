"use client";

import React from "react";
import { GitBranch, GitCommit, GitPullRequest, GitMerge, Clock, ArrowRight } from "lucide-react";

export default function GitIntegrationPage() {
  const commits = [
    { hash: "a1b2c3d", message: "fix: resolve navigation state issue", author: "Rajeev Kumar", time: "2 hours ago", branch: "main" },
    { hash: "f8e7d6c", message: "feat: add developer dashboard sidebar", author: "Amit Singh", time: "5 hours ago", branch: "dev" },
    { hash: "9x8y7z6", message: "chore: update dependencies", author: "Dependabot", time: "1 day ago", branch: "main" },
    { hash: "1a2b3c4", message: "docs: update readme with deployment steps", author: "System Admin", time: "3 days ago", branch: "main" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-orange-500/20 p-3 rounded-xl">
          <GitBranch className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">Git Integration</h1>
          <p className="text-outline text-sm">Source control status, branches, and commit history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
          <GitBranch className="w-8 h-8 text-orange-500" />
          <div>
            <p className="text-sm font-semibold text-outline uppercase tracking-wider">Current Branch</p>
            <h3 className="text-xl font-bold text-on-background mt-1 font-mono">main</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
          <GitCommit className="w-8 h-8 text-sky-500" />
          <div>
            <p className="text-sm font-semibold text-outline uppercase tracking-wider">Latest Commit</p>
            <h3 className="text-xl font-bold text-on-background mt-1 font-mono">a1b2c3d</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
          <GitPullRequest className="w-8 h-8 text-purple-500" />
          <div>
            <p className="text-sm font-semibold text-outline uppercase tracking-wider">Open PRs</p>
            <h3 className="text-xl font-bold text-on-background mt-1">3</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
          <GitMerge className="w-8 h-8 text-emerald-500" />
          <div>
            <p className="text-sm font-semibold text-outline uppercase tracking-wider">Latest Release</p>
            <h3 className="text-xl font-bold text-on-background mt-1">v1.4.2</h3>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
          <h2 className="text-lg font-bold text-on-background">Commit History</h2>
          <button className="text-sm font-semibold text-primary hover:underline">View Repository <ArrowRight className="w-4 h-4 inline"/></button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low text-outline text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Commit</th>
              <th className="p-4 font-semibold">Message</th>
              <th className="p-4 font-semibold">Author</th>
              <th className="p-4 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {commits.map((commit, i) => (
              <tr key={i} className="border-b border-outline-variant/30 hover:bg-surface-container/30">
                <td className="p-4 font-mono text-primary font-bold">{commit.hash}</td>
                <td className="p-4 font-medium text-on-background">{commit.message}</td>
                <td className="p-4 text-on-surface-variant">{commit.author}</td>
                <td className="p-4 text-outline flex items-center gap-2"><Clock className="w-4 h-4"/> {commit.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
