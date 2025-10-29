"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Copy, Check, Loader2, TrendingUp, Wallet, DollarSign, Activity } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface UserData {
  id: string
  name: string
  username: string
  pfp: string | null
  wallet: string
  risk_score: number
  onboarded: boolean
  created_at: string
  max_loan: number
}

interface LoanOffer {
  id: string
  lender_id: string
  amount: number
  interest_rate: number
  repayment_duration: number
  status: string
  created_at: string
  lender?: {
    username: string
    pfp: string | null
  }
}

interface LoanRequest {
  id: string
  borrower_id: string
  amount: number
  status: string
  created_at: string
  borrower?: {
    username: string
    pfp: string | null
    risk_score: number
  }
}

interface Loan {
  id: string
  lender_id: string
  borrower_id: string
  principal_amount: number
  interest_rate: number
  total_repayment_amount: number
  repayment_duration_days: number
  start_date: string
  due_date: string
  status: string
  lender?: {
    username: string
  }
  borrower?: {
    username: string
  }
}

export default function ProfileDashboard() {
  const router = useRouter()
  const supabase = createClient()
  
  const [wallet, setWallet] = useState<string>("")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [borrowed, setBorrowed] = useState<Loan[]>([])
  const [lended, setLended] = useState<Loan[]>([])
  const [loanOffers, setLoanOffers] = useState<LoanOffer[]>([])
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([])
  
  const [borrowModalOpen, setBorrowModalOpen] = useState(false)
  const [lendModalOpen, setLendModalOpen] = useState(false)
  const [borrowAmount, setBorrowAmount] = useState("")
  const [copied, setCopied] = useState(false)
  const [historyTab, setHistoryTab] = useState<"borrowed" | "lended">("borrowed")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    checkWalletAndLoadData()
  }, [])

  const checkWalletAndLoadData = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        router.push('/onboarding')
        return
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      }) as string[]

      if (accounts.length === 0) {
        router.push('/onboarding')
        return
      }

      const walletAddress = accounts[0]
      setWallet(walletAddress)

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', walletAddress)
        .single()

      if (error || !user) {
        router.push('/onboarding')
        return
      }

      if (!user.onboarded) {
        router.push('/onboarding')
        return
      }

      setUserData(user)
      await loadTransactionData(walletAddress)
      
    } catch (error) {
      console.error('Error checking wallet:', error)
      router.push('/onboarding')
    } finally {
      setLoading(false)
    }
  }

  const loadTransactionData = async (walletAddress: string) => {
    try {
      const { data: borrowedLoans } = await supabase
        .from('loans')
        .select(`
          *,
          lender:users!loans_lender_id_fkey(username)
        `)
        .eq('borrower_id', walletAddress)
        .order('created_at', { ascending: false })

      if (borrowedLoans) {
        setBorrowed(borrowedLoans as Loan[])
      }

      const { data: lendedLoans } = await supabase
        .from('loans')
        .select(`
          *,
          borrower:users!loans_borrower_id_fkey(username)
        `)
        .eq('lender_id', walletAddress)
        .order('created_at', { ascending: false })

      if (lendedLoans) {
        setLended(lendedLoans as Loan[])
      }

      const { data: offers } = await supabase
        .from('loan_offers')
        .select(`
          *,
          lender:users!loan_offers_lender_id_fkey(username, pfp)
        `)
        .eq('status', 'active')
        .neq('lender_id', walletAddress)
        .order('created_at', { ascending: false })
        .limit(10)

      if (offers) {
        setLoanOffers(offers as LoanOffer[])
      }

      const { data: requests } = await supabase
        .from('loan_requests')
        .select(`
          *,
          borrower:users!loan_requests_borrower_id_fkey(username, pfp, risk_score)
        `)
        .eq('status', 'active')
        .neq('borrower_id', walletAddress)
        .order('created_at', { ascending: false })
        .limit(10)

      if (requests) {
        setLoanRequests(requests as LoanRequest[])
      }

    } catch (error) {
      console.error('Error loading transaction data:', error)
    }
  }

  const copyAddress = () => {
    if (userData?.wallet) {
      navigator.clipboard.writeText(userData.wallet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleBorrowSubmit = async () => {
    if (!borrowAmount || !userData) return
    
    setIsSubmitting(true)
    try {
      const amount = parseInt(borrowAmount)
      
      if (amount > userData.max_loan) {
        alert(`Maximum loan amount is $${userData.max_loan}`)
        setIsSubmitting(false)
        return
      }

      const { error } = await supabase
        .from('loan_requests')
        .insert({
          borrower_id: userData.id,
          amount: amount,
          status: 'active'
        })

      if (error) throw error

      alert('Loan request submitted successfully!')
      setBorrowModalOpen(false)
      setBorrowAmount("")
      await loadTransactionData(userData.id)
      
    } catch (error) {
      console.error('Error submitting borrow request:', error)
      alert('Failed to submit loan request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLendToUser = async (offerId: string) => {
    if (!userData) return
    
    setIsSubmitting(true)
    try {
      const offer = loanOffers.find(o => o.id === offerId)
      if (!offer) return

      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + offer.repayment_duration)

      const totalRepayment = Math.floor(
        offer.amount * (1 + offer.interest_rate / 100)
      )

      const { error: loanError } = await supabase
        .from('loans')
        .insert({
          lender_id: userData.id,
          borrower_id: offer.lender_id,
          principal_amount: offer.amount,
          interest_rate: offer.interest_rate,
          total_repayment_amount: totalRepayment,
          repayment_duration_days: offer.repayment_duration,
          start_date: new Date().toISOString(),
          due_date: dueDate.toISOString(),
          status: 'active'
        })

      if (loanError) throw loanError

      await supabase
        .from('loan_offers')
        .update({ status: 'accepted' })
        .eq('id', offerId)

      alert('Successfully lent to user!')
      setLendModalOpen(false)
      await loadTransactionData(userData.id)
      
    } catch (error) {
      console.error('Error lending to user:', error)
      alert('Failed to process lending')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getProfileImage = (pfp: string | null | undefined, username: string): string => {
    // Check if pfp exists and is a valid string
    if (pfp && typeof pfp === 'string' && pfp.trim() !== '') {
      // If it's a relative URL, you might need to prefix it with your domain
      // For now, return as is
      return pfp
    }
    // Fallback to dicebear avatar
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`
  }

  const getInitials = (name: string): string => {
    return name.slice(0, 2).toUpperCase()
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const calculateStats = () => {
    const totalBorrowed = borrowed
      .filter(l => l.status === 'active')
      .reduce((sum, loan) => sum + loan.principal_amount, 0)
    
    const totalLent = lended
      .filter(l => l.status === 'active')
      .reduce((sum, loan) => sum + loan.principal_amount, 0)
    
    const transactions = borrowed.length + lended.length

    return { totalBorrowed, totalLent, transactions }
  }

  const getRiskScoreColor = (score: number): string => {
    if (score >= 700) return "text-green-500"
    if (score >= 500) return "text-yellow-500"
    return "text-red-500"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  const stats = calculateStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
            Welcome back, {userData.name}
          </h1>
          <p className="text-muted-foreground text-lg">Manage your crypto lending and borrowing activities</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <Avatar className="relative h-32 w-32 border-4 border-primary/30 shadow-xl">
                    <AvatarImage 
                      src={getProfileImage(userData.pfp, userData.username)} 
                      alt={userData.username}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-primary text-3xl font-bold">
                      {userData.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1">
                  {userData.name}
                </Badge>
              </div>

              {/* User Info Section */}
              <div className="flex-1 space-y-6 w-full">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-3">@{userData.username}</h2>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <code className="bg-muted/70 px-4 py-2 rounded-lg font-mono text-sm border border-border/50 backdrop-blur-sm">
                      {formatAddress(userData.wallet)}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 hover:bg-primary/10" 
                      onClick={copyAddress}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Member since {formatDate(userData.created_at)}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowDownRight className="h-4 w-4 text-blue-500" />
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Borrowed</p>
                      </div>
                      <p className="text-2xl font-bold text-foreground">${stats.totalBorrowed.toLocaleString()}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 hover:border-green-500/40 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Lent</p>
                      </div>
                      <p className="text-2xl font-bold text-foreground">${stats.totalLent.toLocaleString()}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Transactions</p>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stats.transactions}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Risk Score</p>
                      </div>
                      <p className={`text-2xl font-bold ${getRiskScoreColor(userData.risk_score)}`}>
                        {userData.risk_score}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button
            size="lg"
            className="h-16 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            onClick={() => setBorrowModalOpen(true)}
          >
            <ArrowDownRight className="mr-2 h-6 w-6" />
            Borrow Crypto
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-16 text-lg font-semibold border-2 border-primary/50 hover:bg-primary/10 text-foreground bg-transparent shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            onClick={() => setLendModalOpen(true)}
          >
            <ArrowUpRight className="mr-2 h-6 w-6" />
            Lend to Earn
          </Button>
        </div>

        {/* Transaction History */}
        <Card className="border-2 border-border/50 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Activity className="h-6 w-6 text-primary" />
                  Transaction History
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  View your borrowing and lending activities
                </CardDescription>
              </div>

              <div className="flex gap-2 bg-muted/50 p-1 rounded-lg w-fit border border-border/50">
                <Button
                  variant={historyTab === "borrowed" ? "default" : "ghost"}
                  size="sm"
                  className={`transition-all duration-200 ${
                    historyTab === "borrowed"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setHistoryTab("borrowed")}
                >
                  Borrowed
                </Button>
                <Button
                  variant={historyTab === "lended" ? "default" : "ghost"}
                  size="sm"
                  className={`transition-all duration-200 ${
                    historyTab === "lended"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setHistoryTab("lended")}
                >
                  Lended
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left py-4 px-6 text-muted-foreground font-semibold">
                      {historyTab === "borrowed" ? "Lender" : "Borrower"}
                    </th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-semibold">Amount</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-semibold">Interest</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-semibold">Status</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-semibold">Start Date</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-semibold">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(historyTab === "borrowed" ? borrowed : lended).map((transaction) => (
                    <tr 
                      key={transaction.id} 
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-4 px-6 text-foreground font-medium">
                        {historyTab === "borrowed" 
                          ? transaction.lender?.username || 'Unknown'
                          : transaction.borrower?.username || 'Unknown'
                        }
                      </td>
                      <td className="py-4 px-6 text-foreground font-bold">
                        ${transaction.principal_amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-green-500 font-semibold">
                        {transaction.interest_rate}%
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          variant={transaction.status === "active" ? "default" : "secondary"}
                          className={`${
                            transaction.status === "active"
                              ? "bg-green-500/20 text-green-500 border-green-500/30"
                              : "bg-muted/50 text-muted-foreground border-border/50"
                          }`}
                        >
                          {transaction.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {formatDate(transaction.start_date)}
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {formatDate(transaction.due_date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(historyTab === "borrowed" ? borrowed : lended).length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                  <Wallet className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-lg">No {historyTab} transactions yet</p>
                <p className="text-muted-foreground/70 text-sm mt-1">
                  Start by {historyTab === "borrowed" ? "borrowing" : "lending"} crypto
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Borrow Modal */}
        <Dialog open={borrowModalOpen} onOpenChange={setBorrowModalOpen}>
          <DialogContent className="border-2 border-primary/20 shadow-2xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <ArrowDownRight className="h-6 w-6 text-primary" />
                Borrow Crypto
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter the amount you wish to borrow
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-foreground text-base">
                  Amount (USD)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(e.target.value)}
                  className="bg-muted/50 border-border text-foreground h-12 text-lg"
                  max={userData.max_loan}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum loan amount: <span className="font-semibold text-primary">${userData.max_loan.toLocaleString()}</span>
                </p>
              </div>

              <div className="bg-gradient-to-br from-muted/50 to-muted/30 p-5 rounded-xl space-y-3 border border-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Your Risk Score</span>
                  <span className={`font-bold text-lg ${getRiskScoreColor(userData.risk_score)}`}>
                    {userData.risk_score}/800
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">
                    Pending Review
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-border text-foreground bg-transparent hover:bg-muted h-11"
                onClick={() => setBorrowModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground h-11 shadow-lg"
                onClick={handleBorrowSubmit}
                disabled={!borrowAmount || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Lend Modal */}
        <Dialog open={lendModalOpen} onOpenChange={setLendModalOpen}>
          <DialogContent className="border-2 border-primary/20 shadow-2xl max-w-4xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <ArrowUpRight className="h-6 w-6 text-primary" />
                Lending Marketplace
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Choose an offer to accept and start earning interest
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {loanOffers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-lg">No active loan offers available</p>
                  <p className="text-muted-foreground/70 text-sm mt-1">Check back later for new opportunities</p>
                </div>
              ) : (
                loanOffers.map((offer) => (
                  <Card key={offer.id} className="border-2 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-card to-card/30">
                    <CardContent className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-primary/30 shadow-md">
                              <AvatarImage 
                                src={getProfileImage(
                                  offer.lender?.pfp || null, 
                                  offer.lender?.username || 'User'
                                )} 
                              />
                              <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-primary text-sm font-bold">
                                {(offer.lender?.username || 'U').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-foreground text-lg">
                                @{offer.lender?.username || 'Unknown'}
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                {offer.repayment_duration} days duration
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-3 rounded-lg border border-blue-500/20">
                              <p className="text-xs text-muted-foreground mb-1">Amount</p>
                              <p className="font-bold text-foreground text-lg">
                                ${offer.amount.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-3 rounded-lg border border-green-500/20">
                              <p className="text-xs text-muted-foreground mb-1">Interest</p>
                              <p className="font-bold text-green-500 text-lg">{offer.interest_rate}%</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-3 rounded-lg border border-purple-500/20">
                              <p className="text-xs text-muted-foreground mb-1">Posted</p>
                              <p className="font-semibold text-foreground text-sm">
                                {formatDate(offer.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button
                          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground lg:w-auto w-full h-11 shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => handleLendToUser(offer.id)}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <ArrowUpRight className="mr-2 h-4 w-4" />
                              Accept Offer
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
