"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, ArrowDownToLine, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { MockChart } from "@/components/MockChart";
import { GlobalModal } from "@/components/GlobalModal";
import { toast } from "sonner";
import chartsData from "@/mock/charts.json";

export default function OwnerWalletPage() {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");

  const handleWithdraw = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`Withdrawal request for ₹${amount} initiated successfully.`);
      setIsWithdrawOpen(false);
      setAmount("");
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground mt-1">Manage your earnings and payouts.</p>
        </div>
        <Button onClick={() => setIsWithdrawOpen(true)} size="lg" className="w-full sm:w-auto shadow-sm px-8">
          <ArrowDownToLine className="mr-2 h-4 w-4" /> Withdraw Funds
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <Card className="shadow-sm border-border md:col-span-1 bg-gradient-to-br from-primary/10 via-background to-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Wallet className="h-4 w-4 text-primary" /> Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight mt-2">₹1,24,500</div>
            <p className="text-sm text-muted-foreground mt-4 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" /> ₹8,400 pending clearance
            </p>
          </CardContent>
        </Card>

        {/* Income Chart */}
        <div className="md:col-span-2 h-[250px]">
          <MockChart 
            title="Income Trend" 
            data={chartsData.revenue.slice(0, 5)} 
            height="h-[150px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle>Recent Payouts</CardTitle>
            <CardDescription>Your recent withdrawal history.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "TXN-001", amount: 50000, date: "24 Jun 2026", status: "Completed" },
                { id: "TXN-002", amount: 25000, date: "15 Jun 2026", status: "Completed" },
                { id: "TXN-003", amount: 12000, date: "02 Jun 2026", status: "Completed" },
              ].map((txn) => (
                <div key={txn.id} className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">Bank Transfer (HDFC)</p>
                    <p className="text-xs text-muted-foreground">{txn.date} • {txn.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-destructive">-₹{txn.amount.toLocaleString()}</p>
                    <p className="text-xs text-green-500 font-medium">{txn.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle>Recent Earnings</CardTitle>
            <CardDescription>Income from completed bookings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { eq: "JCB 3DX", client: "Rajesh Construction", amount: 45000, date: "Today" },
                { eq: "Tata Crane", client: "L&T Projects", amount: 12000, date: "Yesterday" },
                { eq: "Escorts Hydra", client: "MegaBuilders Inc", amount: 8400, date: "2 days ago" },
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
        title="Withdraw Funds"
        description="Transfer your available balance to your registered bank account."
        primaryActionLabel={loading ? "Processing..." : "Confirm Withdrawal"}
        onPrimaryAction={handleWithdraw}
      >
        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted/50 rounded-lg border border-border flex justify-between items-center">
            <span className="text-sm font-medium">Available to withdraw:</span>
            <span className="text-xl font-bold text-primary">₹1,24,500</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount to Withdraw (₹)</label>
            <Input 
              type="number" 
              placeholder="Enter amount" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg py-6"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium text-muted-foreground">Select Bank Account</label>
            <div className="border border-primary bg-primary/5 p-3 rounded-md flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-background rounded shadow-sm flex items-center justify-center font-bold text-xs">
                  HDFC
                </div>
                <div>
                  <p className="text-sm font-medium">HDFC Bank</p>
                  <p className="text-xs text-muted-foreground">•••• 4589</p>
                </div>
              </div>
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </GlobalModal>

    </div>
  );
}
