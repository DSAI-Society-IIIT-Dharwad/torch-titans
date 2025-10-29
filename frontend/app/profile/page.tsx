"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Copy, Check } from "lucide-react"

// Dummy data
const userData = {
  username: "cryptowhale.eth",
  walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  accountType: "Lender",
  profileImage: "/crypto-avatar.png",
  creditScore: 850,
  totalBorrowed: 0,
  totalLent: 125000,
  transactions: 47,
  joinedDate: "Jan 2024",
}

const borrowRequests = [
  {
    id: 1,
    borrower: "defi_trader",
    amount: 5000,
    interestRate: 8.5,
    creditScore: 720,
    duration: "30 days",
    collateral: "ETH",
  },
  {
    id: 2,
    borrower: "nft_collector",
    amount: 12000,
    interestRate: 7.2,
    creditScore: 780,
    duration: "60 days",
    collateral: "BTC",
  },
  {
    id: 3,
    borrower: "yield_farmer",
    amount: 8500,
    interestRate: 9.0,
    creditScore: 690,
    duration: "45 days",
    collateral: "USDC",
  },
  {
    id: 4,
    borrower: "dao_member",
    amount: 20000,
    interestRate: 6.8,
    creditScore: 820,
    duration: "90 days",
    collateral: "ETH",
  },
]

const borrowedHistory = [
  {
    id: 1,
    lender: "yield_master",
    amount: 5000,
    interestRate: 7.5,
    status: "Active",
    startDate: "Oct 15, 2024",
    dueDate: "Nov 15, 2024",
  },
  {
    id: 2,
    lender: "crypto_fund",
    amount: 8000,
    interestRate: 6.8,
    status: "Completed",
    startDate: "Sep 1, 2024",
    dueDate: "Oct 1, 2024",
  },
  {
    id: 3,
    lender: "defi_protocol",
    amount: 3500,
    interestRate: 8.2,
    status: "Active",
    startDate: "Oct 20, 2024",
    dueDate: "Dec 20, 2024",
  },
]

const lendedHistory = [
  {
    id: 1,
    borrower: "defi_trader",
    amount: 5000,
    interestRate: 8.5,
    status: "Active",
    startDate: "Oct 10, 2024",
    dueDate: "Nov 10, 2024",
  },
  {
    id: 2,
    borrower: "nft_collector",
    amount: 12000,
    interestRate: 7.2,
    status: "Completed",
    startDate: "Aug 15, 2024",
    dueDate: "Oct 15, 2024",
  },
  {
    id: 3,
    borrower: "yield_farmer",
    amount: 8500,
    interestRate: 9.0,
    status: "Active",
    startDate: "Oct 5, 2024",
    dueDate: "Nov 20, 2024",
  },
  {
    id: 4,
    borrower: "dao_member",
    amount: 20000,
    interestRate: 6.8,
    status: "Active",
    startDate: "Sep 20, 2024",
    dueDate: "Dec 20, 2024",
  },
]

export default function ProfileDashboard() {
  const [borrowModalOpen, setBorrowModalOpen] = useState(false)
  const [lendModalOpen, setLendModalOpen] = useState(false)
  const [borrowAmount, setBorrowAmount] = useState("")
  const [copied, setCopied] = useState(false)
  const [historyTab, setHistoryTab] = useState<"borrowed" | "lended">("borrowed")

  const copyAddress = () => {
    navigator.clipboard.writeText(userData.walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBorrowSubmit = () => {
    console.log("Borrow request submitted:", borrowAmount)
    setBorrowModalOpen(false)
    setBorrowAmount("")
  }

  const handleLendToUser = (requestId: number) => {
    console.log("Lending to request:", requestId)
    setLendModalOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-background">

      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Manage your lending and borrowing activities</p>
        </div>

        <Card className="glass-card mb-6 border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-start">
              <Avatar className="h-24 w-24 border-2 border-primary/50 flex-shrink-0">
                <AvatarImage src={userData.profileImage || "/placeholder.svg"} alt={userData.username} />
                <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                  {userData.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                {/* User Info */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-foreground">{userData.username}</h2>
                    <Badge variant="secondary" className="w-fit bg-primary/20 text-primary border-primary/30">
                      {userData.accountType}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <code className="bg-muted/50 px-3 py-1 rounded-md font-mono">
                      {userData.walletAddress.slice(0, 20)}...
                    </code>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyAddress}>
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground">Member since {userData.joinedDate}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Borrowed</p>
                    <p className="text-xl font-bold text-foreground">${userData.totalBorrowed.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Lent</p>
                    <p className="text-xl font-bold text-chart-1">${userData.totalLent.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Transactions</p>
                    <p className="text-xl font-bold text-foreground">{userData.transactions}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Credit Score</p>
                    <p className="text-xl font-bold text-primary">{userData.creditScore}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Button
            size="lg"
            className="h-16 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setBorrowModalOpen(true)}
          >
            <ArrowDownRight className="mr-2 h-5 w-5" />
            Borrow Crypto
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-16 text-lg font-semibold border-primary/50 hover:bg-primary/10 text-foreground bg-transparent"
            onClick={() => setLendModalOpen(true)}
          >
            <ArrowUpRight className="mr-2 h-5 w-5" />
            Lend to Earn
          </Button>
        </div>

        <Card className="glass-card border-border/50">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Transaction History</CardTitle>
                <CardDescription className="text-muted-foreground">
                  View your borrowing and lending activities
                </CardDescription>
              </div>

              {/* Toggle Buttons */}
              <div className="flex gap-2 bg-muted/30 p-1 rounded-lg w-fit">
                <Button
                  variant={historyTab === "borrowed" ? "default" : "ghost"}
                  size="sm"
                  className={`${
                    historyTab === "borrowed"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setHistoryTab("borrowed")}
                >
                  Borrowed
                </Button>
                <Button
                  variant={historyTab === "lended" ? "default" : "ghost"}
                  size="sm"
                  className={`${
                    historyTab === "lended"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setHistoryTab("lended")}
                >
                  Lended
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Transaction Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold">
                      {historyTab === "borrowed" ? "Lender" : "Borrower"}
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Interest Rate</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Start Date</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(historyTab === "borrowed" ? borrowedHistory : lendedHistory).map((transaction: any) => (
                    <tr key={transaction.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 text-foreground font-medium">
                        {historyTab === "borrowed" ? transaction.lender : transaction.borrower}
                      </td>
                      <td className="py-3 px-4 text-foreground font-semibold">
                        ${transaction.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-chart-1 font-semibold">{transaction.interestRate}%</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={transaction.status === "Active" ? "default" : "secondary"}
                          className={`${
                            transaction.status === "Active"
                              ? "bg-primary/20 text-primary border-primary/30"
                              : "bg-muted/50 text-muted-foreground border-border/50"
                          }`}
                        >
                          {transaction.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{transaction.startDate}</td>
                      <td className="py-3 px-4 text-muted-foreground">{transaction.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {(historyTab === "borrowed" ? borrowedHistory : lendedHistory).length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No {historyTab} transactions yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Borrow Modal */}
        <Dialog open={borrowModalOpen} onOpenChange={setBorrowModalOpen}>
          <DialogContent className="glass-card border-border/50 text-foreground">
            <DialogHeader>
              <DialogTitle className="text-2xl">Borrow Crypto</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter the amount you wish to borrow. Your credit score: {userData.creditScore}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-foreground">
                  Amount (USD)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(e.target.value)}
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>

              <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Interest Rate</span>
                  <span className="font-semibold text-foreground">7.5% APR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Collateral Required</span>
                  <span className="font-semibold text-foreground">120%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-border text-foreground bg-transparent"
                onClick={() => setBorrowModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleBorrowSubmit}
                disabled={!borrowAmount}
              >
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Lend Modal */}
        <Dialog open={lendModalOpen} onOpenChange={setLendModalOpen}>
          <DialogContent className="glass-card border-border/50 max-w-3xl text-foreground">
            <DialogHeader>
              <DialogTitle className="text-2xl">Lending Marketplace</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Choose a borrower to lend to and earn interest
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {borrowRequests.map((request) => (
                <Card key={request.id} className="glass-card border-border/50">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-primary/30">
                            <AvatarFallback className="bg-primary/20 text-primary text-sm">
                              {request.borrower.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">{request.borrower}</p>
                            <p className="text-sm text-muted-foreground">{request.duration}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Amount</p>
                            <p className="font-semibold text-foreground">${request.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Interest</p>
                            <p className="font-semibold text-chart-1">{request.interestRate}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Credit Score</p>
                            <p className="font-semibold text-foreground">{request.creditScore}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Collateral</p>
                            <p className="font-semibold text-foreground">{request.collateral}</p>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground sm:w-auto w-full"
                        onClick={() => handleLendToUser(request.id)}
                      >
                        Lend Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
