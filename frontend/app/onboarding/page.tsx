'use client'
import React, { useState } from 'react';
import { Camera, Wallet, User, Check } from 'lucide-react';

export default function CredChainOnboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    id: 'privy_' + Math.random().toString(36).substr(2, 9),
    name: '',
    username: '',
    pfp: null,
    wallet: '',
    risk_score: 300,
    onboarded: false
  });
  const [pfpPreview, setPfpPreview] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    setTimeout(() => {
      const mockWallet = '0x' + Math.random().toString(16).substr(2, 40);
      setFormData(prev => ({ ...prev, wallet: mockWallet }));
      setIsConnecting(false);
      setStep(2);
    }, 1500);
  };

  const handlePfpUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, pfp: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPfpPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToStorage = async (file, userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Uploading to: images/pfp/${userId}.jpg`);
        resolve(`images/pfp/${userId}.jpg`);
      }, 1000);
    });
  };

  const saveUserToDB = async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Saving user data:', userData);
        resolve(true);
      }, 1000);
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      let pfpUrl = null;
      if (formData.pfp) {
        pfpUrl = await uploadImageToStorage(formData.pfp, formData.id);
      }

      const userData = {
        id: formData.id,
        name: formData.name,
        username: formData.username,
        pfp: pfpUrl,
        wallet: formData.wallet,
        risk_score: formData.risk_score,
        onboarded: true,
        created_at: new Date().toISOString()
      };

      await saveUserToDB(userData);

      setStep(4);
      
      setTimeout(() => {
        console.log('Redirecting to dashboard...');
      }, 2000);

    } catch (error) {
      console.error('Onboarding error:', error);
      setIsSubmitting(false);
    }
  };

  const handleProfileContinue = () => {
    if (formData.name && formData.username) {
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
            CredChain
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-wider">
            Decentralized Lending Protocol
          </p>
        </div>

        <div className="flex justify-center items-center mb-8 gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                step >= s 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-800 text-gray-500'
              }`}>
                {step > s ? <Check size={16} /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 transition-colors ${
                  step > s ? 'bg-blue-500' : 'bg-slate-800'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl p-8">
          
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="text-blue-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Connect Your Wallet
                </h2>
                <p className="text-gray-400 text-sm">
                  Connect your wallet to get started with CredChain
                </p>
              </div>

              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isConnecting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connecting...
                  </span>
                ) : (
                  'Connect Wallet'
                )}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-blue-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Create Your Profile
                </h2>
                <p className="text-gray-400 text-sm">
                  Tell us about yourself
                </p>
              </div>

              <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-gray-300 mb-3">
                  Profile Photo
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePfpUpload}
                    className="hidden"
                    id="pfp-upload"
                  />
                  <label
                    htmlFor="pfp-upload"
                    className="w-24 h-24 rounded-full bg-slate-800/50 border-2 border-dashed border-slate-700 hover:border-blue-500 flex items-center justify-center cursor-pointer transition-all group overflow-hidden"
                  >
                    {pfpPreview ? (
                      <img src={pfpPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="text-gray-500 group-hover:text-blue-400 transition-colors" size={28} />
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/\s/g, '') }))}
                  placeholder="@username"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Wallet Address
                </label>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl px-4 py-3 text-gray-400 text-sm font-mono">
                  {formData.wallet.slice(0, 6)}...{formData.wallet.slice(-4)}
                </div>
              </div>

              <button
                onClick={handleProfileContinue}
                disabled={!formData.name || !formData.username}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Continue
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Review Your Information
                </h2>
                <p className="text-gray-400 text-sm">
                  Make sure everything looks correct
                </p>
              </div>

              <div className="space-y-4">
                {pfpPreview && (
                  <div className="flex justify-center">
                    <img src={pfpPreview} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-blue-500" />
                  </div>
                )}

                <div className="bg-slate-800/30 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Name</span>
                    <span className="text-white font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Username</span>
                    <span className="text-white font-medium">@{formData.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Wallet</span>
                    <span className="text-white font-mono text-sm">
                      {formData.wallet.slice(0, 6)}...{formData.wallet.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                    <span className="text-gray-400 text-sm">Initial Risk Score</span>
                    <span className="text-blue-400 font-bold text-lg">{formData.risk_score}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-slate-800/50 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </span>
                  ) : (
                    'Save & Continue'
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Check className="text-green-400" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Welcome to CredChain!
              </h2>
              <p className="text-gray-400 mb-6">
                Your profile has been created successfully
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Redirecting to dashboard...
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          By continuing, you agree to CredChain's Terms of Service
        </p>
      </div>
    </div>
  );
}
