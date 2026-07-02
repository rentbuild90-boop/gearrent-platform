"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowDownToLine, ArrowUpRight, Clock, Building2 } from "lucide-react";
import { MockChart } from "@/components/MockChart";
import { GlobalModal } from "@/components/GlobalModal";
import { toast } from "sonner";
import chartsData from "@/mock/charts.json";

export default function DriverIncomePage() {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Income & Wallet</h1>
          <p className="text-muted-foreground mt-1">Track your earnings and withdraw to your bank.</p>
        </div>
        <Button onClick={() => setIsWithdrawOpen(true)} size="lg" className="w-full sm:w-auto shadow-sm">
          <ArrowDownToLine className="mr-2 h-4 w-4" /> Withdraw Funds
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-border md:col-span-1 bg-gradient-to-br from-primary/10 via-background to-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Wallet className="h-4 w-4 text-primary" /> Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight mt-2">₹12,450</div>
            <p className="text-sm text-muted-foreground mt-4 flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-500" /> Next auto-payout in 3 days
            </p>
          </CardContent>
        </Card>

        <div className="md:col-span-2 h-[250px]">
          <MockChart 
            title="Weekly Earnings" 
            data={[
              { name: "Mon", value: 850 },
              { name: "Tue", value: 1200 },
              { name: "Wed", value: 900 },
              { name: "Thu", value: 1450 },
              { name: "Fri", value: 850 },
              { name: "Sat", value: 0 },
              { name: "Sun", value: 0 },
            ]} 
            valuePrefix="₹"
            height="h-[150px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle>Recent Payouts</CardTitle>
            <CardDescription>Transfers made to your bank account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "TXN-8091", amount: 14000, date: "24 Jun 2026", status: "Completed" },
                { id: "TXN-8042", amount: 12500, date: "17 Jun 2026", status: "Completed" },
                { id: "TXN-7988", amount: 15200, date: "10 Jun 2026", status: "Completed" },
              ].map((txn) => (
                <div key={txn.id} className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded-full"><Building2 className="h-4 w-4" /></div>
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-xs text-muted-foreground">{txn.date} • {txn.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">₹{txn.amount.toLocaleString()}</p>
                    <p className="text-xs text-green-500 font-medium">{txn.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle>Recent Job Earnings</CardTitle>
            <CardDescription>Income from recently completed trips.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { eq: "JCB 3DX", client: "Rajesh Construction", amount: 850, date: "Today" },
                { eq: "Tata Crane", client: "L&T Projects", amount: 1100, date: "Yesterday" },
                { eq: "Escorts Hydra", client: "MegaBuilders", amount: 1450, date: "2 days ago" },
              ].map((earn, i) => (
                <div key={i} className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{earn.eq}</p>
                    <p className="text-xs text-muted-foreground">{earn.client} • {earn.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-500 flex items-center justify-end">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" /> +₹{earn.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <GlobalModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        title="Withdraw Earnings"
        description="Transfer your wallet balance directly to your bank account. Transfers usually take 1-2 business days."
        primaryActionLabel="Confirm Withdrawal"
        onPrimaryAction={() => {
          toast.success("Withdrawal initiated successfully!");
          setIsWithdrawOpen(false);
        }}
      >
        <div className="space-y-4 py-4 text-center">
          <p className="text-sm text-muted-foreground">Amount to withdraw</p>
          <p className="text-5xl font-bold tracking-tighter text-primary">₹12,450</p>
          <div className="pt-4 border-t border-border flex justify-between items-center text-sm">
            <span className="text-muted-foreground">To Bank Account:</span>
            <span className="font-medium">SBI •••• 9012</span>
          </div>
        </div>
      </GlobalModal>

    </div>
  );
}
