'use client'
import React, { useState } from 'react';

const CredChainListings = () => {
  const [activeTab, setActiveTab] = useState('borrowers');

  // Dummy data for borrowers
  //
  const borrowers = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      username: '@sarahm',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      amount: '5,000 USDC',
      createdAt: '2 hours ago'
    },
    {
      id: 2,
      name: 'James Chen',
      username: '@jameschen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      amount: '12,500 USDC',
      createdAt: '5 hours ago'
    },
    {
      id: 3,
      name: 'Maria Rodriguez',
      username: '@mariarodz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      amount: '8,000 USDC',
      createdAt: '1 day ago'
    },
    {
      id: 4,
      name: 'Alex Thompson',
      username: '@alexthompson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      amount: '3,500 USDC',
      createdAt: '1 day ago'
    },
    {
      id: 5,
      name: 'Priya Patel',
      username: '@priyap',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      amount: '15,000 USDC',
      createdAt: '2 days ago'
    }
  ];

  // Dummy data for lenders
  const lenders = [
    {
      id: 1,
      name: 'David Kim',
      username: '@davidkim',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      amount: '50,000 USDC',
      interestRate: '8.5%',
      duration: '12 months',
      createdAt: '3 hours ago'
    },
    {
      id: 2,
      name: 'Emma Watson',
      username: '@emmaw',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      amount: '100,000 USDC',
      interestRate: '7.2%',
      duration: '24 months',
      createdAt: '6 hours ago'
    },
    {
      id: 3,
      name: 'Michael Zhang',
      username: '@mzhang',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      amount: '25,000 USDC',
      interestRate: '9.0%',
      duration: '6 months',
      createdAt: '1 day ago'
    },
    {
      id: 4,
      name: 'Sophie Anderson',
      username: '@sophiea',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
      amount: '75,000 USDC',
      interestRate: '6.8%',
      duration: '18 months',
      createdAt: '1 day ago'
    },
    {
      id: 5,
      name: 'Carlos Martinez',
      username: '@carlosm',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      amount: '30,000 USDC',
      interestRate: '8.0%',
      duration: '12 months',
      createdAt: '2 days ago'
    }
  ];

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
