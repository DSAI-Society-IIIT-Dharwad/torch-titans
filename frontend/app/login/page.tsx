'use client'

import React, { useState, useEffect } from 'react';
import { AlertCircle, Wallet, TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const P2PLendingPlatform = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [activeTab, setActiveTab] = useState<'borrow' | 'lend' | 'myloans'>('borrow');
  const [loans, setLoans] = useState<any[]>([]);
  const [myLoans, setMyLoans] = useState<any[]>([]);
  
  // Form states
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [duration, setDuration] = useState('');
  const [purpose, setPurpose] = useState('');

  useEffect(() => {
    checkWalletConnection();
    loadLoans();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          getBalance(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        getBalance(accounts[0]);
        
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          setAccount(accounts[0] || null);
          if (accounts[0]) getBalance(accounts[0]);
        });
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask to use this platform.');
    }
  };

  const getBalance = async (address: string) => {
    try {
      const eth = window.ethereum;
      if (!eth) return;
      const balanceHex = await eth.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      const balanceEth = parseInt(balanceHex, 16) / 1e18;
      setBalance(balanceEth.toFixed(4));
    } catch (err: unknown) {
      const e = err as any;
      console.error('Error getting balance:', e.message ?? e);
    }
  };

  const loadLoans = async () => {
    try {
      // Fetch active loan requests from Supabase
      const { data: requests, error } = await supabase
        .from('loan_requests')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Error fetching loan requests:', error)
        setLoans([])
      } else {
        // Map DB rows to the UI shape used in this page
        const mapped = (requests || []).map((r: any) => ({
          id: r.id,
          borrower: r.borrower_id,
          amount: r.amount,
          interestRate: 0,
          duration: r.repayment_duration_days,
          purpose: r.purpose || '',
          status: r.status,
          createdAt: r.created_at
        }))
        setLoans(mapped)
      }
    } catch (e) {
      console.error('No loans yet or error loading:', e)
      setLoans([])
    }

    // Also refresh my loans view
    await loadMyLoans();
  };

  const loadMyLoans = async () => {
    if (!account) return;

    try {
      // Fetch loans where the user is borrower or lender
      const { data: loansData, error } = await supabase
        .from('loans')
        .select('*')
        .or(`borrower_id.eq.${account},lender_id.eq.${account}`)
        .order('start_date', { ascending: false })
        .limit(200)

      if (error) {
        console.error('Error fetching user loans:', error)
        setMyLoans([])
      } else {
        const mapped = (loansData || []).map((l: any) => ({
          id: l.id,
          borrower: l.borrower_id,
          lender: l.lender_id,
          amount: l.principal_amount,
          interestRate: l.interest_rate,
          duration: l.repayment_duration_days,
          status: l.status,
          createdAt: l.start_date
        }))
        setMyLoans(mapped)
      }
    } catch (e) {
      console.error('Error loading my loans:', e)
      setMyLoans([])
    }
  };

  const createLoanRequest = async () => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }
    if (!loanAmount || !duration) {
      alert('Please fill in amount and duration');
      return;
    }

    try {
      const id = `lr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
      const { error } = await supabase
        .from('loan_requests')
        .insert({
          id,
          borrower_id: account,
          amount: parseFloat(loanAmount),
          repayment_duration_days: parseInt(duration),
          status: 'active',
          created_at: new Date().toISOString()
        })

      if (error) throw error

      alert('Loan request created successfully!')
      setLoanAmount('')
      setInterestRate('')
      setDuration('')
      setPurpose('')
      await loadLoans()
    } catch (err: any) {
      console.error('Error creating loan request:', err)
      alert('Failed to create loan request')
    }
  };

  const fundLoan = async (loan: any) => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }
    if (loan.borrower.toLowerCase() === account.toLowerCase()) {
      alert('You cannot fund your own loan request');
      return;
    }

    try {
      // Send ETH transaction
      const eth = window.ethereum
      if (!eth) throw new Error('Ethereum provider not found')

      const amountWei = '0x' + Math.floor(loan.amount * 1e18).toString(16)

      const txHash = await eth.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: account,
            to: loan.borrower,
            value: amountWei
          }
        ]
      })

      // Create a loan record in Supabase
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + (loan.duration || 0))

      const { error: insertErr } = await supabase.from('loans').insert({
        lender_id: account,
        borrower_id: loan.borrower,
        principal_amount: loan.amount,
        interest_rate: loan.interestRate || 0,
        total_repayment_amount: Math.floor(loan.amount * (1 + (loan.interestRate || 0) / 100)),
        repayment_duration_days: loan.duration,
        start_date: new Date().toISOString(),
        due_date: dueDate.toISOString(),
        status: 'active'
      })

      if (insertErr) throw insertErr

      // Mark original loan request as closed
      await supabase.from('loan_requests').update({ status: 'closed' }).eq('id', loan.id)

      alert(`Transaction sent! Hash: ${String(txHash).slice(0, 10)}...`)
      await loadLoans()
      await loadMyLoans()
    } catch (err: any) {
      console.error('Error funding loan:', err)
      alert('Transaction failed: ' + (err?.message ?? String(err)))
    }
  };

  const repayLoan = async (loan: any) => {
    if (!account || loan.borrower.toLowerCase() !== account.toLowerCase()) {
      alert('Only the borrower can repay this loan');
      return;
    }
    const totalRepayment = loan.amount * (1 + (loan.interestRate || 0) / 100)

    try {
      const amountWei = '0x' + Math.floor(totalRepayment * 1e18).toString(16)

      const eth = window.ethereum
      if (!eth) throw new Error('Ethereum provider not found')

      const txHash = await eth.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: account,
            to: loan.lender,
            value: amountWei
          }
        ]
      })

      // Update loan status in Supabase
      const { error } = await supabase.from('loans').update({ status: 'closed' }).eq('id', loan.id)
      if (error) throw error

      alert(`Repayment sent! Hash: ${String(txHash).slice(0, 10)}...`)
      await loadMyLoans()
    } catch (err: any) {
      console.error('Error repaying loan:', err)
      alert('Repayment failed: ' + (err?.message ?? String(err)))
    }
  };

  const formatAddress = (addr?: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const calculateRepayment = (amount: number, rate: number) => {
    return (amount * (1 + rate / 100)).toFixed(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">LendChain</h1>
          </div>
          
          {account ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Balance</div>
                <div className="font-semibold">{balance} ETH</div>
              </div>
              <div className="bg-indigo-100 px-4 py-2 rounded-lg">
                <div className="text-xs text-indigo-600">Connected</div>
                <div className="font-mono text-sm">{formatAddress(account)}</div>
              </div>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              <Wallet className="w-5 h-5" />
              Connect MetaMask
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!account ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <Wallet className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Welcome to LendChain</h2>
            <p className="text-gray-600 mb-6">Connect your MetaMask wallet to start lending or borrowing</p>
            <button
              onClick={connectWallet}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('borrow')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === 'borrow' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                Request Loan
              </button>
              <button
                onClick={() => setActiveTab('lend')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === 'lend' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                Browse Loans
              </button>
              <button
                onClick={() => setActiveTab('myloans')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === 'myloans' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                My Loans
              </button>
            </div>

            {/* Borrow Tab */}
            {activeTab === 'borrow' && (
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Create Loan Request</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Loan Amount (ETH)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.5"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="5"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (days)</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="30"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Purpose (optional)</label>
                      <textarea
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Business expansion, education, etc."
                      rows={3}
                    />
                  </div>

                  {loanAmount && interestRate && (
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Total Repayment Amount</div>
                      <div className="text-2xl font-bold text-indigo-600">
                        {calculateRepayment(parseFloat(loanAmount), parseFloat(interestRate))} ETH
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={createLoanRequest}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                  >
                    Create Loan Request
                  </button>
                </div>
              </div>
            )}

            {/* Lend Tab */}
            {activeTab === 'lend' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Available Loan Requests</h2>
                
                {loans.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No loan requests available at the moment</p>
                  </div>
                ) : (
                  loans.map((loan) => (
                    <div key={loan.id} className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Borrower</div>
                          <div className="font-mono text-sm">{formatAddress(loan.borrower)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-indigo-600">{loan.amount} ETH</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">Interest Rate</div>
                          <div className="font-semibold">{loan.interestRate}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Duration</div>
                          <div className="font-semibold">{loan.duration} days</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Repayment</div>
                          <div className="font-semibold">{calculateRepayment(loan.amount, loan.interestRate)} ETH</div>
                        </div>
                      </div>
                      
                      {loan.purpose && (
                        <div className="mb-4">
                          <div className="text-sm text-gray-500">Purpose</div>
                          <div>{loan.purpose}</div>
                        </div>
                      )}
                      
                      <button
                        onClick={() => fundLoan(loan)}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        Fund This Loan
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* My Loans Tab */}
            {activeTab === 'myloans' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">My Loans</h2>
                
                {myLoans.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">You don't have any active loans yet</p>
                  </div>
                ) : (
                  myLoans.map((loan) => (
                    <div key={loan.id} className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                            loan.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                            loan.status === 'active' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {loan.status.toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {loan.borrower.toLowerCase() === account.toLowerCase() ? 'You are borrowing' : 'You are lending'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">{loan.amount} ETH</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">Interest Rate</div>
                          <div className="font-semibold">{loan.interestRate}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Repayment Amount</div>
                          <div className="font-semibold">{calculateRepayment(loan.amount, loan.interestRate)} ETH</div>
                        </div>
                      </div>

                      {loan.status === 'active' && loan.borrower.toLowerCase() === account.toLowerCase() && (
                        <button
                          onClick={() => repayLoan(loan)}
                          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                          Repay Loan ({calculateRepayment(loan.amount, loan.interestRate)} ETH)
                        </button>
                      )}

                      {loan.status === 'repaid' && (
                        <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                          <CheckCircle className="w-5 h-5" />
                          Loan Repaid
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>Note:</strong> This is a demo platform. All loan data is shared publicly for demonstration purposes. 
              Transactions are real and use your actual ETH. Always verify transaction details before confirming.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default P2PLendingPlatform;
