"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { TrustScoreCard } from "@/components/trust-score-card"
import { Zap, Plus, Clock, CheckCircle2, User, ArrowLeftRight } from "lucide-react"

interface BorrowerDashboardProps {
  walletAddress: string
  onNavigate: (view: "borrower" | "lender") => void
  onShowProfile: () => void
}

export function BorrowerDashboard({ walletAddress, onNavigate, onShowProfile }: BorrowerDashboardProps) {
  const [showLoanForm, setShowLoanForm] = useState(false)
  const [loanAmount, setLoanAmount] = useState("")
  const [loanDuration, setLoanDuration] = useState("")
  const [loanPurpose, setLoanPurpose] = useState("")

  const trustScore = 742
  const activeLoans = [
    { id: 1, amount: "500 USDC", duration: "30 days", dueDate: "2025-11-28", progress: 60, status: "active" },
    { id: 2, amount: "1000 USDC", duration: "60 days", dueDate: "2025-12-28", progress: 30, status: "active" },
  ]

  const pastLoans = [
    { id: 3, amount: "300 USDC", duration: "30 days", completedDate: "2025-10-15", status: "completed" },
    { id: 4, amount: "750 USDC", duration: "45 days", completedDate: "2025-09-20", status: "completed" },
  ]

  const handleSubmitLoan = () => {
    // Handle loan submission
    setShowLoanForm(false)
    setLoanAmount("")
    setLoanDuration("")
    setLoanPurpose("")
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
              <p className="text-xs text-muted-foreground">Borrower Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("lender")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Switch to Lender
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
        {/* Trust Score Section */}
        <TrustScoreCard score={trustScore} />

        {/* Loan Request Form */}
        <Card className="glass border-primary/30 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Request a Loan</h2>
              <p className="text-sm text-muted-foreground">Submit a new loan request to the marketplace</p>
            </div>
            <Button
              onClick={() => setShowLoanForm(!showLoanForm)}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>

          {showLoanForm && (
            <div className="space-y-4 border-t border-border/50 pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Loan Amount (USDC)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="1000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="30"
                    value={loanDuration}
                    onChange={(e) => setLoanDuration(e.target.value)}
                    className="glass"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Loan Purpose</Label>
                <Textarea
                  id="purpose"
                  placeholder="Describe what you'll use this loan for..."
                  value={loanPurpose}
                  onChange={(e) => setLoanPurpose(e.target.value)}
                  className="glass min-h-24"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitLoan}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Submit Request
                </Button>
                <Button variant="outline" onClick={() => setShowLoanForm(false)} className="glass">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Active Loans */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Active Loans</h2>
          <div className="grid gap-4">
            {activeLoans.map((loan) => (
              <Card key={loan.id} className="glass border-primary/30 p-6 hover:glow transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-lg">{loan.amount}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Due: {loan.dueDate}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">Active</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Repayment Progress</span>
                    <span className="font-medium">{loan.progress}%</span>
                  </div>
                  <Progress value={loan.progress} className="h-2" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Loans */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Loan History</h2>
          <div className="grid gap-4">
            {pastLoans.map((loan) => (
              <Card key={loan.id} className="glass border-border/30 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-lg">{loan.amount}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Completed: {loan.completedDate}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                    Completed
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
