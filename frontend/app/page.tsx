"use client"

import { Button } from "@/components/ui/button"
import { Wallet, TrendingUp, Shield, LogIn } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
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
            onClick={() => router.push('/onboarding')}
            size="lg"
            className="glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 text-lg px-8 py-6"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="glass rounded-xl p-6 hover:glow transition-all duration-300">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow mb-4 mx-auto">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center">Dynamic Trust Scores</h3>
          <p className="text-muted-foreground text-center">
            Build your on-chain reputation with every successful transaction and unlock better rates.
          </p>
        </div>

        <div className="glass rounded-xl p-6 hover:glow transition-all duration-300">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow mb-4 mx-auto">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center">Secure & Transparent</h3>
          <p className="text-muted-foreground text-center">
            Smart contract-powered lending with full transparency and automated enforcement.
          </p>
        </div>

        <div className="glass rounded-xl p-6 hover:glow transition-all duration-300">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow mb-4 mx-auto">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center">Instant Matching</h3>
          <p className="text-muted-foreground text-center">
            Connect with lenders or borrowers instantly through our decentralized marketplace.
          </p>
        </div>
      </section>
    </div>
  )
}
