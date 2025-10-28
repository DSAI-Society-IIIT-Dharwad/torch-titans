"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Zap, ArrowLeft, Copy, CheckCircle2, Clock, XCircle } from "lucide-react"
import { useState } from "react"

interface ProfileSectionProps {
  walletAddress: string
  onBack: () => void
}

export function ProfileSection({ walletAddress, onBack }: ProfileSectionProps) {
  const [copied, setCopied] = useState(false)
  const trustScore = 742

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const transactions = [
    {
      id: 1,
      type: "Loan Repayment",
      amount: "+50 USDC",
      date: "2025-10-28",
      status: "completed",
      impact: "+5 points",
    },
    {
      id: 2,
      type: "Loan Funded",
      amount: "500 USDC",
      date: "2025-10-25",
      status: "completed",
      impact: "+10 points",
    },
    {
      id: 3,
      type: "Loan Request",
      amount: "1000 USDC",
      date: "2025-10-20",
      status: "active",
      impact: "Pending",
    },
    {
      id: 4,
      type: "Loan Repayment",
      amount: "+100 USDC",
      date: "2025-10-15",
      status: "completed",
      impact: "+8 points",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "active":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CredChain
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="glass border-primary/30 p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">{walletAddress}</span>
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 w-6 p-0">
                    {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Trust Score Progress */}
            <div className="space-y-4 p-6 rounded-lg glass border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Trust Score</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {trustScore}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Next Tier</p>
                  <p className="text-2xl font-bold">800</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress to next tier</span>
                  <span className="font-medium">{Math.round((trustScore / 800) * 100)}%</span>
                </div>
                <Progress value={(trustScore / 800) * 100} className="h-3 glow" />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Loans Completed</p>
                  <p className="text-xl font-bold">12</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">On-Time Rate</p>
                  <p className="text-xl font-bold text-green-500">98%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Volume</p>
                  <p className="text-xl font-bold">8.5K USDC</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Transaction History */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Transaction History</h2>
          <Card className="glass border-border/30 p-6">
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-lg glass border border-border/30 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(tx.status)}
                    <div>
                      <p className="font-semibold">{tx.type}</p>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{tx.amount}</p>
                    <p className="text-sm text-primary">{tx.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="glass border-primary/30 p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Active Loans</p>
              <p className="text-3xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">1,500 USDC total</p>
            </div>
          </Card>
          <Card className="glass border-secondary/30 p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="text-3xl font-bold">Aug 2025</p>
              <p className="text-xs text-muted-foreground">3 months active</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
