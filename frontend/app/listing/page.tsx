"use client"
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const CredChainListings = () => {
  const [activeTab, setActiveTab] = useState<'borrowers' | 'lenders'>('borrowers')
  const [borrowers, setBorrowers] = useState<any[]>([])
  const [lenders, setLenders] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const formatDate = (d: string | null | undefined) => {
    if (!d) return ''
    try {
      return new Date(d).toLocaleString()
    } catch {
      return d
    }
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const loadListings = async () => {
    setLoading(true)
    setError(null)
    try {
      // Loan requests -> Borrowers
      const { data: requests, error: reqErr } = await supabase
        .from('loan_requests')
        .select(`id, borrower_id, amount, repayment_duration_days, status, created_at, borrower:users!loan_requests_borrower_id_fkey(username, name, pfp)`)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50)

      if (reqErr) throw reqErr

      const mappedBorrowers = (requests || []).map((r: any) => {
        const userName = r.borrower?.name || r.borrower?.username || r.borrower_id
        const seedUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`
        const pfp = r.borrower?.pfp
        // accept pfp only if it's an absolute URL or starts with a slash (public/)
        const avatar = (typeof pfp === 'string' && pfp.trim() !== '' && (pfp.startsWith('http') || pfp.startsWith('/')))
          ? pfp
          : seedUrl

        return {
          id: r.id,
          name: userName,
          username: r.borrower?.username ? `@${r.borrower.username}` : formatAddress(r.borrower_id),
          avatar,
          amount: `$${Number(r.amount).toLocaleString()}`,
          createdAt: formatDate(r.created_at)
        }
      })

      setBorrowers(mappedBorrowers)

      // Loan offers -> Lenders
      const { data: offers, error: offersErr } = await supabase
        .from('loan_offers')
        .select(`id, lender_id, amount, interest_rate, repayment_duration, status, created_at, lender:users!loan_offers_lender_id_fkey(username, name, pfp)`)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50)

      if (offersErr) throw offersErr

      const mappedLenders = (offers || []).map((o: any) => {
        const userName = o.lender?.name || o.lender?.username || o.lender_id
        const seedUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`
        const pfp = o.lender?.pfp
        const avatar = (typeof pfp === 'string' && pfp.trim() !== '' && (pfp.startsWith('http') || pfp.startsWith('/')))
          ? pfp
          : seedUrl

        return {
          id: o.id,
          name: userName,
          username: o.lender?.username ? `@${o.lender.username}` : formatAddress(o.lender_id),
          avatar,
          amount: `$${Number(o.amount).toLocaleString()}`,
          interestRate: `${o.interest_rate}%`,
          duration: `${o.repayment_duration} days`,
          createdAt: formatDate(o.created_at)
        }
      })

      setLenders(mappedLenders)
    } catch (e: any) {
      console.error('Error loading listings', e)
      setError(e?.message || String(e))
      // leave borrowers/lenders empty on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadListings()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-950/20 via-black to-purple-950/20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
            CredChain
          </h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest">Decentralized Lending Protocol</p>
        </div>

        {/* Toggle Control */}
        <div className="mb-10 inline-flex rounded-2xl bg-zinc-900/80 backdrop-blur-xl p-1 border border-zinc-800/50 shadow-2xl shadow-black/50">
          <button
            onClick={() => setActiveTab('borrowers')}
            className={`px-10 py-3.5 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'borrowers'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Borrowers
          </button>
          <button
            onClick={() => setActiveTab('lenders')}
            className={`px-10 py-3.5 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'lenders'
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/50'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Lenders
          </button>
        </div>

        {/* Borrowers Table */}
        {activeTab === 'borrowers' && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold mb-8 text-gray-400 uppercase tracking-wider text-sm">Loan Requests</h2>
            
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-6 px-8 py-4 text-xs font-semibold text-gray-600 uppercase tracking-widest">
              <div>Borrower</div>
              <div>Amount</div>
              <div>Created</div>
            </div>

            {/* Table Rows */}
            {borrowers.map((borrower) => (
              <div
                key={borrower.id}
                className="grid grid-cols-3 gap-6 items-center px-8 py-6 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 hover:bg-zinc-900/80 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group shadow-lg shadow-black/20 hover:shadow-blue-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                    <img
                      src={borrower.avatar}
                      alt={borrower.name}
                      className="w-full h-full rounded-full bg-zinc-900"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement
                        // fallback to dicebear using name seed
                        const seed = encodeURIComponent(borrower.name || borrower.username || borrower.id)
                        target.onerror = null
                        target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-base text-white">{borrower.name}</div>
                    <div className="text-sm text-gray-500">{borrower.username}</div>
                  </div>
                </div>
                <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                  {borrower.amount}
                </div>
                <div className="text-gray-400 text-sm">{borrower.createdAt}</div>
              </div>
            ))}
          </div>
        )}

        {/* Lenders Table */}
        {activeTab === 'lenders' && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold mb-8 text-gray-400 uppercase tracking-wider text-sm">Loan Offers</h2>
            
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-6 px-8 py-4 text-xs font-semibold text-gray-600 uppercase tracking-widest">
              <div>Lender</div>
              <div>Amount</div>
              <div>APR</div>
              <div>Duration</div>
              <div>Created</div>
            </div>

            {/* Table Rows */}
            {lenders.map((lender) => (
              <div
                key={lender.id}
                className="grid grid-cols-5 gap-6 items-center px-8 py-6 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 hover:bg-zinc-900/80 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group shadow-lg shadow-black/20 hover:shadow-purple-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 p-0.5 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300">
                    <img
                      src={lender.avatar}
                      alt={lender.name}
                      className="w-full h-full rounded-full bg-zinc-900"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement
                        const seed = encodeURIComponent(lender.name || lender.username || lender.id)
                        target.onerror = null
                        target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-base text-white">{lender.name}</div>
                    <div className="text-sm text-gray-500">{lender.username}</div>
                  </div>
                </div>
                <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                  {lender.amount}
                </div>
                <div className="text-emerald-400 font-semibold text-base">{lender.interestRate}</div>
                <div className="text-gray-400 text-sm">{lender.duration}</div>
                <div className="text-gray-400 text-sm">{lender.createdAt}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CredChainListings;
