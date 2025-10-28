"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { RoleSelection } from "@/components/role-selection"
import { BorrowerDashboard } from "@/components/borrower-dashboard"
import { LenderMarketplace } from "@/components/lender-marketplace"
import { ProfileSection } from "@/components/profile-section"

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "role-select" | "borrower" | "lender">("landing")
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [showProfile, setShowProfile] = useState(false)

  const handleConnectWallet = () => {
    // Simulate wallet connection
    const mockAddress = "0x" + Math.random().toString(16).substr(2, 40)
    setWalletAddress(mockAddress)
    setWalletConnected(true)
    setCurrentView("role-select")
  }

  const handleRoleSelect = (role: "borrower" | "lender") => {
    setCurrentView(role)
  }

  const handleNavigate = (view: "borrower" | "lender") => {
    setCurrentView(view)
    setShowProfile(false)
  }

  const handleShowProfile = () => {
    setShowProfile(true)
  }

  if (showProfile) {
    return <ProfileSection walletAddress={walletAddress} onBack={() => setShowProfile(false)} />
  }

  if (currentView === "landing") {
    return <LandingPage onConnectWallet={handleConnectWallet} />
  }

  if (currentView === "role-select") {
    return <RoleSelection onSelectRole={handleRoleSelect} />
  }

  if (currentView === "borrower") {
    return (
      <BorrowerDashboard walletAddress={walletAddress} onNavigate={handleNavigate} onShowProfile={handleShowProfile} />
    )
  }

  if (currentView === "lender") {
    return (
      <LenderMarketplace walletAddress={walletAddress} onNavigate={handleNavigate} onShowProfile={handleShowProfile} />
    )
  }

  return null
}
