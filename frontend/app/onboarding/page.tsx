'use client'

import React, { useState, useEffect } from 'react';
import { Camera, Wallet, User, Check, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  pfp: string | null;
  wallet: string;
  risk_score: number;
  onboarded: boolean;
  created_at?: string;
}

interface FormData {
  name: string;
  username: string;
  pfp: File | null;
}

export default function CredChainOnboarding() {
  const [step, setStep] = useState<number>(1);
  const [wallet, setWallet] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    username: '',
    pfp: null
  });
  const [pfpPreview, setPfpPreview] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isCheckingUser, setIsCheckingUser] = useState<boolean>(false);

  const supabase = createClient();

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        }) as string[];
        
        if (accounts.length > 0) {
          await handleWalletConnected(accounts[0]);
        }
      } catch (err) {
        console.error('Error checking wallet:', err);
      }
    }
  };

  const handleWalletConnected = async (address: string) => {
    setWallet(address);
    setIsCheckingUser(true);
    setError('');

    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', address)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingUser) {
        if (existingUser.onboarded) {
          setStep(4);
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        } else {
          setFormData({
            name: existingUser.name || '',
            username: existingUser.username || '',
            pfp: null
          });
          if (existingUser.pfp) {
            setPfpPreview(existingUser.pfp);
          }
          setStep(2);
        }
      } else {
        setStep(2);
      }
    } catch (err) {
      console.error('Error checking user:', err);
      setError('Failed to check user status. Please try again.');
    } finally {
      setIsCheckingUser(false);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[];
      
      if (accounts.length > 0) {
        await handleWalletConnected(accounts[0]);
      }

      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          handleWalletConnected(accounts[0]);
        } else {
          setWallet('');
          setStep(1);
        }
      });
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handlePfpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({ ...prev, pfp: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPfpPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const uploadImageToSupabase = async (file: File, userId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `pfp/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('user-profiles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from('user-profiles')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .neq('id', wallet);

    if (error) {
      throw error;
    }

    return data.length === 0;
  };

  const handleProfileContinue = async () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!formData.username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const isAvailable = await checkUsernameAvailability(formData.username);
      if (!isAvailable) {
        setError('Username is already taken. Please choose another one.');
        setIsSubmitting(false);
        return;
      }

      setStep(3);
    } catch (err) {
      console.error('Error checking username:', err);
      setError('Failed to verify username. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      let pfpUrl: string | null = null;

      if (formData.pfp) {
        pfpUrl = await uploadImageToSupabase(formData.pfp, wallet);
      }

      const userData: UserProfile = {
        id: wallet,
        name: formData.name.trim(),
        username: formData.username.trim().toLowerCase(),
        pfp: pfpUrl,
        wallet: wallet,
        risk_score: 300,
        onboarded: true,
        created_at: new Date().toISOString()
      };

      const { error: upsertError } = await supabase
        .from('users')
        .upsert(userData, {
          onConflict: 'id'
        });

      if (upsertError) {
        throw upsertError;
      }

      setStep(4);
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (err) {
      console.error('Onboarding error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save profile. Please try again.');
      setIsSubmitting(false);
    }
  };

  const formatAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
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

        {step < 4 && (
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
        )}

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl p-8">
          
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

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
                disabled={isConnecting || isCheckingUser}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isConnecting || isCheckingUser ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    {isCheckingUser ? 'Checking account...' : 'Connecting...'}
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
                  Profile Photo (Optional)
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
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') 
                  }))}
                  placeholder="username"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  maxLength={30}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lowercase letters, numbers, and underscores only
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Wallet Address
                </label>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl px-4 py-3 text-gray-400 text-sm font-mono">
                  {formatAddress(wallet)}
                </div>
              </div>

              <button
                onClick={handleProfileContinue}
                disabled={!formData.name.trim() || !formData.username.trim() || isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Checking...
                  </span>
                ) : (
                  'Continue'
                )}
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
                    <img 
                      src={pfpPreview} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-500" 
                    />
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
                      {formatAddress(wallet)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                    <span className="text-gray-400 text-sm">Initial Risk Score</span>
                    <span className="text-blue-400 font-bold text-lg">300</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-800/50 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-50"
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
                      <Loader2 className="animate-spin" size={20} />
                      Saving...
                    </span>
                  ) : (
                    'Complete Setup'
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
