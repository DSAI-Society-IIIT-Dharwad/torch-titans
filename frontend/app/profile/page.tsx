"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Zap,
  Copy,
  CheckCircle2,
  Clock,
  HandCoins,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

// This is now a "page" component, so it's a default export
// and doesn't receive the 'walletAddress' or 'onNavigate' props.
export default function DashboardPage() {
  const [copied, setCopied] = useState(false)

  // --- Mock Data ---
  // Since props are removed, we use mock data for the page.
  // In a real app, this would come from a wallet connection hook or API.
  const walletAddress = "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b"
  const trustScore = 742

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // This function replaces the 'onNavigate' prop.
  // In a real Next.js app, you'd use:
  // import { useRouter } from 'next/navigation'
  // const router = useRouter()
  // router.push(`/${view}`)
  const handleNavigate = (view: "loan-request" | "marketplace") => {
    console.log(`Navigating to: ${view}`)
    // alert(`Navigating to: ${view}`) // or use alert for testing
  }

  const activityStats = {
    totalBorrowed: "3,200 USDC",
    totalLent: "5,400 USDC",
    activeLoans: 2,
    completedLoans: 12,
    onTimeRate: 98,
  }

  const recentActivity = [
    {
      id: 1,
      type: "borrowed",
      amount: "500 USDC",
      date: "2025-10-25",
      status: "active",
      dueDate: "2025-11-28",
    },
    {
      id: 2,
      type: "lent",
      amount: "1000 USDC",
      date: "2025-10-20",
      status: "active",
      borrower: "0x742d...3f8a",
    },
    {
      id: 3,
      type: "borrowed",
      amount: "300 USDC",
      date: "2025-10-15",
      status: "completed",
      completedDate: "2025-10-28",
    },
    {
      id: 4,
      type: "lent",
      amount: "750 USDC",
      date: "2025-09-20",
      status: "completed",
      borrower: "0x9a3c...7b2d",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CredChain
              </span>
              <p className="text-xs text-muted-foreground">Profile Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
        {/* Profile Header with Wallet & Trust Score */}
        <Card className="glass border-primary/30 p-8">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <div className="flex items-center gap-2">
                  {/* Uses the local walletAddress state */}
                  <span className="font-mono text-sm text-muted-foreground">
                    {walletAddress}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-6 w-6 p-0"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Trust Score Section */}
            <div className="space-y-4 p-6 rounded-lg glass border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Trust Score
                  </p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {trustScore}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Next Tier</p>
                  <p className="text-3xl font-bold">800</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Progress to next tier
                  </span>
                  <span className="font-medium">
                    {Math.round((trustScore / 800) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(trustScore / 800) * 100}
                  className="h-3 glow"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons - Borrow & Lend */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="glass border-primary/30 p-8 hover:glow transition-all duration-300 cursor-pointer group"
            // Updated to use local navigation handler
            onClick={() => handleNavigate("loan-request")}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Borrow</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Request a loan and get matched with lenders based on your
                  trust score
                </p>
              </div>
              <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Request Loan
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          <Card
            className="glass border-secondary/30 p-8 hover:glow-violet transition-all duration-300 cursor-pointer group"
            // Updated to use local navigation handler
            onClick={() => handleNavigate("marketplace")}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HandCoins className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Lend</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Browse loan requests and fund borrowers to earn competitive
                  returns
                </p>
              </div>
              <Button className="w-full bg-gradient-to-r from-secondary to-primary hover:opacity-90">
                View Marketplace
                <ArrowDownRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Activity Stats */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Activity Overview</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="glass border-primary/30 p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ArrowUpRight className="w-4 h-4" />
                  <p className="text-sm">Total Borrowed</p>
                </div>
                <p className="text-2xl font-bold">
                  {activityStats.totalBorrowed}
                </p>
              </div>
            </Card>
            <Card className="glass border-secondary/30 p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ArrowDownRight className="w-4 h-4" />
                  <p className="text-sm">Total Lent</p>
                </div>
                <p className="text-2xl font-bold">{activityStats.totalLent}</p>
              </div>
            </Card>
            <Card className="glass border-primary/30 p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <p className="text-sm">Active Loans</p>
                </div>
                <p className="text-2xl font-bold">{activityStats.activeLoans}</p>
              </div>
            </Card>
            <Card className="glass border-secondary/30 p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <p className="text-sm">On-Time Rate</p>
                </div>
                <p className="text-2xl font-bold text-green-500">
                  {activityStats.onTimeRate}%
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activity & Repayment Outcomes */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Recent Activity</h2>
          <Card className="glass border-border/30 p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-lg glass border border-border/30 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    {activity.type === "borrowed" ? (
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <ArrowUpRight className="w-5 h-5 text-primary" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                        <ArrowDownRight className="w-5 h-5 text-secondary" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold capitalize">{activity.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.date}
                      </p>
                      {activity.type === "lent" && activity.borrower && (
                        <p className="text-xs text-muted-foreground font-mono">
                          To: {activity.borrower}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{activity.amount}</p>
                    {activity.status === "active" ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
