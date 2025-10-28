"use client"

import { Button } from "@/components/ui/button"
import { Wallet, TrendingUp, Shield, Zap } from "lucide-react"

interface LandingPageProps {
  onConnectWallet: () => void
}

export function LandingPage({ onConnectWallet }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 animate-gradient" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(100,200,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(100,200,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 glass">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CredChain
              </span>
            </div>
            <Button
              onClick={onConnectWallet}
              className="glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-6xl md:text-7xl font-bold leading-tight text-balance">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                Lend. Borrow.
              </span>
              <br />
              <span className="text-foreground">Build Trust On-Chain.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The future of peer-to-peer micro-lending. Connect your wallet, build your reputation, and access
              decentralized credit markets.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                size="lg"
                onClick={onConnectWallet}
                className="glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 text-lg px-8 py-6"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="glass border-primary/50 hover:bg-primary/10 text-lg px-8 py-6 bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
            <div className="glass rounded-xl p-6 hover:glow transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dynamic Trust Scores</h3>
              <p className="text-muted-foreground leading-relaxed">
                Build your on-chain reputation with every successful transaction and unlock better rates.
              </p>
            </div>

            <div className="glass rounded-xl p-6 hover:glow-violet transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Transparent</h3>
              <p className="text-muted-foreground leading-relaxed">
                Smart contract-powered lending with full transparency and automated enforcement.
              </p>
            </div>

            <div className="glass rounded-xl p-6 hover:glow transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Matching</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with lenders or borrowers instantly through our decentralized marketplace.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
