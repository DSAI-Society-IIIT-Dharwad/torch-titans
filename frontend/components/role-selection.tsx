"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HandCoins, Wallet, ArrowRight } from "lucide-react"

interface RoleSelectionProps {
  onSelectRole: (role: "borrower" | "lender") => void
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 animate-gradient" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(100,200,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(100,200,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Choose Your Role
            </h1>
            <p className="text-xl text-muted-foreground">
              How would you like to participate in the CredChain ecosystem?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Borrower Card */}
            <Card className="glass border-primary/30 p-8 hover:glow transition-all duration-300 cursor-pointer group">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Wallet className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Borrower</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Request loans, build your trust score, and access decentralized credit
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground text-left">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Submit loan requests
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Build your trust score
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Track repayment history
                  </li>
                </ul>
                <Button
                  onClick={() => onSelectRole("borrower")}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Continue as Borrower
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>

            {/* Lender Card */}
            <Card className="glass border-secondary/30 p-8 hover:glow-violet transition-all duration-300 cursor-pointer group">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <HandCoins className="w-8 h-8 text-secondary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Lender</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Fund loans, earn interest, and help build the credit ecosystem
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground text-left">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Browse loan requests
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Assess borrower risk
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Earn competitive returns
                  </li>
                </ul>
                <Button
                  onClick={() => onSelectRole("lender")}
                  className="w-full bg-gradient-to-r from-secondary to-primary hover:opacity-90"
                >
                  Continue as Lender
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
