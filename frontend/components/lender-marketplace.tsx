"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Zap, Search, TrendingUp, User, ArrowLeftRight } from "lucide-react"

interface LenderMarketplaceProps {
  walletAddress: string
  onNavigate: (view: "borrower" | "lender") => void
  onShowProfile: () => void
}

export function LenderMarketplace({ walletAddress, onNavigate, onShowProfile }: LenderMarketplaceProps) {
  const loanRequests = [
    {
      id: 1,
      borrower: "0x742d...3f8a",
      amount: "500 USDC",
      duration: "30 days",
      purpose: "Business inventory purchase",
      trustScore: 820,
      risk: "low",
      interestRate: "8%",
    },
    {
      id: 2,
      borrower: "0x9a3c...7b2d",
      amount: "1500 USDC",
      duration: "60 days",
      purpose: "Equipment upgrade",
      trustScore: 680,
      risk: "medium",
      interestRate: "12%",
    },
    {
      id: 3,
      borrower: "0x1f5e...4c9b",
      amount: "800 USDC",
      duration: "45 days",
      purpose: "Marketing campaign",
      trustScore: 750,
      risk: "low",
      interestRate: "9%",
    },
    {
      id: 4,
      borrower: "0x6d8a...2e1f",
      amount: "2000 USDC",
      duration: "90 days",
      purpose: "Product development",
      trustScore: 520,
      risk: "high",
      interestRate: "18%",
    },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "high":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getRiskGlow = (risk: string) => {
    switch (risk) {
      case "low":
        return "glow-green"
      case "medium":
        return "glow-yellow"
      case "high":
        return "glow-red"
      default:
        return ""
    }
  }

  const getRiskEmoji = (risk: string) => {
    switch (risk) {
      case "low":
        return "🟢"
      case "medium":
        return "🟡"
      case "high":
        return "🔴"
      default:
        return ""
    }
  }

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
              <p className="text-xs text-muted-foreground">Lender Marketplace</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("borrower")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Switch to Borrower
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowProfile}
              className="text-muted-foreground hover:text-foreground"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Search and Filters */}
        <Card className="glass border-primary/30 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search loan requests..." className="glass pl-10" />
            </div>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <TrendingUp className="w-4 h-4 mr-2" />
              Filter by Risk
            </Button>
          </div>
        </Card>

        {/* Marketplace Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="glass border-primary/30 p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-3xl font-bold">{loanRequests.length}</p>
            </div>
          </Card>
          <Card className="glass border-secondary/30 p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg. Interest Rate</p>
              <p className="text-3xl font-bold">11.75%</p>
            </div>
          </Card>
          <Card className="glass border-primary/30 p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-3xl font-bold">4,800 USDC</p>
            </div>
          </Card>
        </div>

        {/* Loan Requests */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Available Loan Requests</h2>
          <div className="grid gap-4">
            {loanRequests.map((request) => (
              <Card
                key={request.id}
                className={`glass border-border/30 p-6 hover:${getRiskGlow(request.risk)} transition-all duration-300`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-muted-foreground">{request.borrower}</span>
                      </div>
                      <h3 className="text-2xl font-bold">{request.amount}</h3>
                      <p className="text-sm text-muted-foreground">{request.purpose}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getRiskEmoji(request.risk)}</span>
                        <div>
                          <p className="text-sm text-muted-foreground">Trust Score</p>
                          <p className={`text-xl font-bold ${getRiskColor(request.risk)}`}>{request.trustScore}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Duration</p>
                      <p className="font-semibold">{request.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                      <p className="font-semibold text-primary">{request.interestRate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                      <p className={`font-semibold capitalize ${getRiskColor(request.risk)}`}>{request.risk}</p>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-secondary to-primary hover:opacity-90">
                    Offer Loan
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
