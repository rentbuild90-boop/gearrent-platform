"use client";

import React, { useState } from "react";
import { Users, CheckCircle, XCircle, Eye } from "lucide-react";

export default function RolesApprovalPage() {
  const [applications, setApplications] = useState([
    { id: "APP-001", name: "Rahul Sharma", role: "Driver", status: "Pending", submitted: "2 hours ago" },
    { id: "APP-002", name: "ConstructCo Ltd.", role: "Owner", status: "Pending", submitted: "5 hours ago" },
    { id: "APP-003", name: "Amit Singh", role: "Driver", status: "Pending", submitted: "1 day ago" },
  ]);

  const handleAction = (id, action) => {
    setApplications(applications.filter(app => app.id !== id));
    alert(`Application ${id} ${action}d successfully.`);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/20 p-3 rounded-xl">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">Role Approvals</h1>
          <p className="text-outline text-sm">Review and approve new Driver and Owner applications.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30 text-on-surface-variant text-sm font-semibold">
              <th className="p-4">Application ID</th>
              <th className="p-4">Applicant Name</th>
              <th className="p-4">Requested Role</th>
              <th className="p-4">Submitted</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-outline">No pending applications found.</td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="border-b border-outline-variant/30 hover:bg-surface-container/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-on-background">{app.id}</td>
                  <td className="p-4 text-sm font-semibold text-on-background">{app.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      app.role === 'Owner' ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary-container text-on-tertiary-container'
                    }`}>
                      {app.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-outline">{app.submitted}</td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/10 rounded-lg tooltip-trigger" title="View KYC Documents">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleAction(app.id, 'approve')}
                      className="p-2 text-green-600 hover:bg-green-600/10 transition-colors rounded-lg" title="Approve"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleAction(app.id, 'reject')}
                      className="p-2 text-error hover:bg-error/10 transition-colors rounded-lg" title="Reject"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
