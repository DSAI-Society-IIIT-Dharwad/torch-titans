"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp } from "lucide-react"

interface TrustScoreCardProps {
  score: number
}

export function TrustScoreCard({ score }: TrustScoreCardProps) {
  const maxScore = 850
  const percentage = (score / maxScore) * 100

  const getScoreColor = () => {
    if (score >= 750) return "from-green-500 to-emerald-500"
    if (score >= 650) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-orange-500"
  }

  const getScoreGlow = () => {
    if (score >= 750) return "glow-green"
    if (score >= 650) return "glow-yellow"
    return "glow-red"
  }

  return (
    <Card className={`glass border-primary/30 p-8 ${getScoreGlow()}`}>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Your Trust Score</p>
            <h2 className={`text-6xl font-bold bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent`}>
              {score}
            </h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">+15 this month</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Score Progress</span>
            <span className="font-medium">{Math.round(percentage)}%</span>
          </div>
          <Progress value={percentage} className="h-3" />
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Loans Completed</p>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">On-Time Rate</p>
            <p className="text-2xl font-bold text-green-500">98%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Borrowed</p>
            <p className="text-2xl font-bold">8.5K</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
