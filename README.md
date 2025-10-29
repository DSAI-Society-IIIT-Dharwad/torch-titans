<<<<<<< HEAD
# CredChain - Complete User Guide

## Table of Contents
1. [What is CredChain?](#what-is-credchain)
2. [Getting Started](#getting-started)
3. [Creating Your Account](#creating-your-account)
4. [Understanding Your Dashboard](#understanding-your-dashboard)
5. [How to Borrow Money](#how-to-borrow-money)
6. [How to Lend Money](#how-to-lend-money)
7. [Understanding Risk Scores](#understanding-risk-scores)
8. [Managing Your Profile](#managing-your-profile)
9. [Transaction History](#transaction-history)
10. [Troubleshooting](#troubleshooting)

---

## What is CredChain?

**CredChain** is like a digital marketplace where people can lend and borrow money directly from each other, without banks. Think of it as:

- 🤝 **A meeting place** for people who need money and people who want to lend
- 🔒 **Super secure** using blockchain technology (like a digital lock)
- 📊 **Transparent** - everyone can see loan terms clearly
- ⚡ **Fast** - no waiting for bank approvals

### How It's Different from Banks:
- **No middleman** - You deal directly with other people
- **Better rates** - Lenders can earn more, borrowers can pay less
- **Your wallet is your ID** - No lengthy paperwork
- **Global** - Connect with anyone, anywhere

---

## Getting Started

### What You'll Need:

1. **A Computer or Smartphone** with internet connection
2. **A Digital Wallet** (like MetaMask) - Think of it as your digital purse
3. **5 Minutes** to set everything up

### Step-by-Step Setup:

#### Step 1: Install MetaMask (Your Digital Wallet)

1. Go to [metamask.io](https://metamask.io)
2. Click "Download"
3. Add it to your browser (Chrome, Firefox, etc.)
4. Create a new wallet
5. **IMPORTANT:** Write down your secret recovery phrase on paper and keep it safe!

#### Step 2: Visit CredChain

```bash
# If you're running it locally:
# Open your terminal and type:
cd credchain/frontend
pnpm dev

# Then open your browser and go to:
http://localhost:3000
```

Or visit the live website (if deployed).

---

## Creating Your Account

### The Login Process (Super Simple!)

1. **Click "Connect Wallet"** on the homepage
2. **MetaMask will pop up** asking for permission
3. **Click "Connect"** - This is like showing your ID
4. **You're in!** No passwords to remember

### First-Time Setup (Onboarding)

After connecting your wallet, you'll be asked to complete your profile:

#### Basic Information:
- **Full Name** - Your real name (keeps things trustworthy)
- **Email Address** - For important notifications
- **Phone Number** - Optional, but helps with verification

#### Profile Picture:
You have two options:

1. **Upload Your Own Photo**
   - Click the camera icon
   - Choose a photo (PNG, JPG, or JPEG)
   - Maximum size: 5MB
   
2. **Use Auto-Generated Avatar**
   - Don't have a photo? No problem!
   - The system creates a unique cartoon avatar for you
   - Based on your wallet address (so it's always the same)

```typescript
// Technical Detail: How avatars are generated
// The system uses Dicebear API to create unique avatars
const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${walletAddress}`;
```

#### Financial Information (For Your Risk Score):
- **Monthly Income** - How much you earn per month
- **Employment Status** - Employed, Self-employed, Student, etc.
- **Credit History** - Previous loans, if any
- **Existing Debts** - What you currently owe

**Why we ask this:** This helps calculate your "Risk Score" - a number that tells lenders how reliable you are.

---

## Understanding Your Dashboard

When you log in, you'll see your main dashboard. Here's what everything means:

### Top Section: Your Quick Stats

| Element | Value | Description |
|---------|-------|-------------|
| 👤 Your Name | - | Your profile name |
| Risk Score | 750 | Your trustworthiness rating |
| 💰 Available Balance | $5,000 | Money ready to use |
| 📊 Active Loans | 2 | Current ongoing loans |
| ⏰ Pending Requests | 1 | Waiting for approval |

- **Risk Score** (0-1000): Higher = More trustworthy
  - 800-1000: Excellent
  - 600-799: Good
  - 400-599: Fair
  - Below 400: Needs improvement

- **Available Balance**: Money you have ready to lend or borrow
- **Active Loans**: Loans you're currently repaying or earning from
- **Pending Requests**: Loan requests waiting for approval

### Navigation Menu:

- **🏠 Home** - Your main dashboard
- **📋 Listings** - Browse available loans
- **➕ Create Loan** - Start lending or borrowing
- **👤 Profile** - Manage your account
- **📜 History** - See all your transactions

---

## How to Borrow Money

Need money for an emergency, education, or business? Here's how to borrow:

### Step 1: Go to "Browse Loans"

Click on the "Listings" tab to see available loan offers from lenders.

### Step 2: Filter Loans

Use the filters to find what you need:

**Available Filters:**
- **Loan Amount:** $1,000 - $10,000 (adjustable range)
- **Interest Rate:** 5% - 15% (per year)
- **Duration:** 3 - 24 months
- **Minimum Risk Score:** 0 - 1000

Click "Apply Filters" to see matching loans.

### Step 3: Review Loan Offers

Each loan card shows:

**Loan Offer Card:**
- **Lender:** John Doe (Risk Score: 820)
- **💰 Amount:** $5,000
- **📈 Interest:** 8% per year
- **⏰ Duration:** 12 months
- **💵 Monthly Payment:** $434
- **[Request This Loan]** button

**What this means:**
- You'll borrow $5,000
- You'll pay back $5,200 total (8% interest)
- In 12 monthly payments of $434 each
- Lender's risk score is 820 (very reliable)

### Step 4: Request the Loan

1. Click "Request This Loan"
2. Review the terms carefully
3. Check the repayment schedule:

**Repayment Schedule:**
- Month 1: $434
- Month 2: $434
- Month 3: $434
- ...continuing...
- Month 12: $434
- **Total:** $5,200 ($5,000 principal + $200 interest)

4. Click "Confirm Request"
5. Approve the transaction in your wallet

### Step 5: Wait for Approval

- The lender will review your request
- They'll check your risk score
- You'll get a notification when approved
- Usually takes 24-48 hours

### Step 6: Receive Your Money

Once approved:
- Money is sent directly to your wallet
- You'll see it in your "Active Loans"
- Repayment schedule starts
- Set up automatic payments (recommended!)

---

## How to Lend Money

Have extra money? Earn interest by lending to others!

### Step 1: Click "Create Loan Offer"

From your dashboard, click the "+" button or "Create Loan" option.

### Step 2: Set Your Terms

Fill in the loan details:

```
Create Your Loan Offer
┌──────────────────────────────────────┐
│ Loan Amount: $________               │
│ (How much you want to lend)          │
│                                      │
│ Interest Rate: ____%                 │
│ (What you'll earn annually)          │
│                                      │
│ Loan Duration: ___ months            │
│ (How long until full repayment)      │
│                                      │
│ Minimum Risk Score: ___              │
│ (Only show to borrowers above this)  │
│                                      │
│         [Create Offer]               │
└──────────────────────────────────────┘
```

**Example:**
- Loan Amount: $5,000
- Interest Rate: 10%
- Duration: 12 months
- Minimum Risk Score: 600

This means:
- You lend $5,000
- You'll earn $500 in interest
- You'll get back $5,500 total
- Only borrowers with risk score 600+ can see your offer

### Step 3: Review Your Offer

The system calculates everything for you:

```
Your Loan Summary
─────────────────────────────
Amount Lending:     $5,000
Interest Earned:      $500
Total Return:       $5,500
Monthly Income:       $458
Return on Investment: 10%
Risk Level:          Medium
─────────────────────────────
[Looks Good] [Edit] [Cancel]
```

### Step 4: Publish Your Offer

1. Click "Looks Good"
2. Approve the transaction in your wallet
3. Your offer goes live immediately
4. Borrowers can now see and request it

### Step 5: Review Borrower Requests

When someone wants your loan:

```
New Loan Request!
┌──────────────────────────────────────┐
│ Borrower: Sarah Smith               │
│ Risk Score: 720 (Good)               │
│                                      │
│ Requesting: $5,000                   │
│ Purpose: Home Renovation             │
│                                      │
│ Borrower History:                    │
│ ✅ 3 loans completed on time         │
│ ✅ Never missed a payment            │
│ ✅ Member since: Jan 2024            │
│                                      │
│      [Approve] [Reject]              │
└──────────────────────────────────────┘
```

**What to check:**
- ✅ Risk score (higher is better)
- ✅ Loan history (completed loans = good sign)
- ✅ Purpose (seems reasonable?)
- ✅ Your gut feeling

### Step 6: Approve and Fund

1. Click "Approve" if you trust the borrower
2. Money is automatically transferred from your wallet
3. You start earning interest immediately
4. Track repayments in your dashboard

### Step 7: Earn Your Returns

```
Your Active Loan
┌──────────────────────────────────────┐
│ Borrower: Sarah Smith               │
│ Amount: $5,000                       │
│ Progress: ████████░░ 80%             │
│                                      │
│ Received so far: $4,400              │
│ Next payment: Dec 15 ($458)          │
│ Remaining: 2 months                  │
│                                      │
│         [View Details]               │
└──────────────────────────────────────┘
```

Payments come automatically each month. You can track everything in real-time!

---

## Understanding Risk Scores

Your Risk Score is like a report card for lending. Here's how it works:

### What Affects Your Score:

```python
# Technical Detail: Risk Score Calculation

def calculate_risk_score(user_data):
    score = 0
    
    # Payment history (40% of score)
    if on_time_payments >= 95%:
        score += 400
    
    # Income stability (25% of score)
    if steady_income:
        score += 250
    
    # Debt-to-Income ratio (20% of score)
    if total_debt < 30% of income:
        score += 200
    
    # Credit history length (10% of score)
    score += (months_as_member * 1.5)
    
    # Current loan load (5% of score)
    if active_loans < 3:
        score += 50
    
    return min(score, 1000)  # Max score is 1000
```

### In Simple Terms:

1. **Payment History (40%)**
   - Do you pay on time?
   - Have you ever missed a payment?
   - **Pro tip:** Set up auto-pay!

2. **Income (25%)**
   - Do you have steady income?
   - Is it enough to cover loans?
   - **Pro tip:** Update your income info regularly

3. **Debt Level (20%)**
   - How much do you already owe?
   - Can you handle more debt?
   - **Pro tip:** Keep debts under 30% of income

4. **History (10%)**
   - How long have you been a member?
   - Do you have a track record?
   - **Pro tip:** Start small to build history

5. **Current Loans (5%)**
   - How many active loans do you have?
   - Are you managing them well?
   - **Pro tip:** Don't take too many at once

### Score Ranges:

```
Excellent (800-1000)
██████████ 🌟
- Best interest rates
- Highest loan amounts
- Approved quickly

Good (600-799)
████████░░ ✅
- Good interest rates
- Standard loan amounts
- Usually approved

Fair (400-599)
██████░░░░ ⚠️
- Higher interest rates
- Smaller loan amounts
- May need collateral

Poor (0-399)
████░░░░░░ ❌
- Very high interest rates
- Limited loan options
- Need to improve score first
```

### How to Improve Your Score:

1. **Pay on Time**
   - Set calendar reminders
   - Use auto-pay features
   - Pay a day early to be safe

2. **Complete Small Loans**
   - Start with small amounts
   - Pay them back fully
   - Build your reputation

3. **Update Your Info**
   - Keep income info current
   - Add new employment details
   - Verify your email and phone

4. **Reduce Debt**
   - Pay off existing loans
   - Don't take unnecessary loans
   - Keep debt under 30% of income

5. **Be Patient**
   - Scores improve over time
   - Consistency matters most
   - Good behavior is rewarded

---

## Managing Your Profile

Your profile is your identity on CredChain. Keep it updated!

### Accessing Your Profile:

1. Click your name/avatar in the top right
2. Select "Profile" from the dropdown

### Profile Sections:

#### 1. Personal Information

```
Personal Details
┌──────────────────────────────────────┐
│ Full Name: [John Doe]               │
│ Email: [john@example.com]            │
│ Phone: [+1 234-567-8900]            │
│ Wallet: [0x742d...89Ab]              │
│                                      │
│         [Edit] [Save]                │
└──────────────────────────────────────┘
```

**Edit these when:**
- You change your email
- You get a new phone number
- You want to update your name

#### 2. Profile Picture

**Upload New Picture:**
```typescript
// Technical Detail: Profile Picture Upload
const uploadProfilePicture = async (file: File) => {
  // 1. Validate file
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    alert('Please upload PNG, JPG, or JPEG only');
    return;
  }
  
  if (file.size > maxSize) {
    alert('File too large. Max 5MB');
    return;
  }
  
  // 2. Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('profile-pictures')
    .upload(`${userId}/${file.name}`, file);
  
  // 3. Update user profile with new URL
  await supabase
    .from('users')
    .update({ profile_picture: data.path })
    .eq('id', userId);
};
```

**Steps:**
1. Click on your current picture
2. Click "Change Picture"
3. Select a new photo from your device
4. Crop if needed
5. Click "Save"

**Fallback Avatar:**
If you don't upload a picture, you get an auto-generated avatar based on your wallet address.

#### 3. Financial Information

```
Financial Profile
┌──────────────────────────────────────┐
│ Monthly Income: [$5,000]             │
│ Employment: [Full-time]              │
│ Current Debts: [$2,000]              │
│ Debt-to-Income: [40%]                │
│                                      │
│ ⚠️ Tip: Lower debt improves score    │
│                                      │
│         [Update Info]                │
└──────────────────────────────────────┘
```

**Keep this updated because:**
- It affects your risk score
- Lenders review this info
- Accurate info = better loan terms

#### 4. Verification Status

```
Verification Checklist
┌──────────────────────────────────────┐
│ ✅ Email Verified                    │
│ ✅ Wallet Connected                  │
│ ⏳ Phone Verification Pending        │
│ ❌ Identity Documents                │
│                                      │
│ More verification = Higher trust     │
│                                      │
│      [Complete Verification]         │
└──────────────────────────────────────┘
```

**Why verify?**
- Higher risk score
- Better loan terms
- More lender trust
- Access to larger loans

---

## Transaction History

Track every loan, payment, and transaction in one place.

### Accessing History:

Dashboard → "History" tab

### What You'll See:

```
Transaction History
┌────────────────────────────────────────────────┐
│ Date       │ Type      │ Amount  │ Status     │
├────────────┼───────────┼─────────┼────────────┤
│ Dec 1      │ Payment   │ -$434   │ ✅ Complete│
│ Nov 1      │ Payment   │ -$434   │ ✅ Complete│
│ Oct 15     │ Loan Recv │ +$5,000 │ ✅ Complete│
│ Oct 1      │ Interest  │ +$50    │ ✅ Complete│
│ Sep 20     │ Payment   │ -$434   │ ✅ Complete│
└────────────┴───────────┴─────────┴────────────┘

[Export CSV] [Print] [Filter]
```

### Filter Options:

1. **By Type:**
   - Loans Borrowed
   - Loans Lent
   - Payments Made
   - Payments Received
   - Interest Earned

2. **By Date:**
   - Last 30 days
   - Last 6 months
   - Last year
   - Custom range

3. **By Status:**
   - Completed
   - Pending
   - Failed
   - Canceled

### Transaction Details:

Click any transaction to see full details:

```
Transaction #12345
┌──────────────────────────────────────┐
│ Type: Loan Repayment                 │
│ Date: December 1, 2024               │
│ Time: 2:30 PM                        │
│                                      │
│ Amount: $434.00                      │
│ ├─ Principal: $400.00                │
│ └─ Interest: $34.00                  │
│                                      │
│ From: Your Wallet                    │
│ To: John Doe (Lender)                │
│                                      │
│ Transaction Hash:                    │
│ 0x8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c  │
│                                      │
│ Status: ✅ Confirmed                 │
│                                      │
│ [View on Blockchain] [Download PDF]  │
└──────────────────────────────────────┘
```

### Export Your Data:

```typescript
// Technical Detail: Export Transaction History
const exportTransactions = async (format: 'csv' | 'pdf') => {
  // 1. Fetch all user transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  // 2. Format data
  if (format === 'csv') {
    const csv = transactions.map(t => 
      `${t.date},${t.type},${t.amount},${t.status}`
    ).join('\n');
    
    // 3. Download file
    downloadFile(csv, 'transactions.csv');
  }
};
```

**Export steps:**
1. Click "Export CSV" or "Print"
2. Choose date range
3. Select transactions to include
4. Download or print

---

## Troubleshooting

### Common Issues and Solutions:

#### 1. Can't Connect Wallet

**Problem:** MetaMask not connecting

**Solutions:**
```
Step 1: Check MetaMask is installed
- Look for fox icon in browser toolbar
- If not there, install from metamask.io

Step 2: Unlock MetaMask
- Click the MetaMask icon
- Enter your password
- Try connecting again

Step 3: Check network
- Make sure you're on the correct network
- Look for network name in MetaMask

Step 4: Refresh page
- Press F5 or Ctrl+R
- Try connecting again
```

#### 2. Profile Picture Won't Upload

**Problem:** Photo upload fails

**Solutions:**
```
Check file format:
✅ PNG, JPG, JPEG only
❌ No GIF, BMP, WEBP

Check file size:
✅ Under 5MB
❌ Compress large images first

Try these steps:
1. Right-click image → Properties
2. Check file size and type
3. Use online compressor if needed
4. Try uploading again
```

#### 3. Risk Score Not Updating

**Problem:** Score stays the same after payment

**Solutions:**
```python
# Scores update automatically, but may take time

# Technical Detail: Score Update Process
def update_risk_scores():
    # Runs every 24 hours
    for user in all_users:
        new_score = calculate_risk_score(user)
        update_database(user.id, new_score)

# Your score updates within 24 hours of:
# - Making a payment
# - Completing a loan
# - Updating financial info
```

**If still not updating:**
1. Check you've completed the action (payment confirmed)
2. Wait 24 hours for system update
3. Contact support if still stuck

#### 4. Loan Request Rejected

**Problem:** Lender rejected your request

**Possible reasons:**
```
❌ Risk score too low
   → Solution: Build history with smaller loans

❌ Too much existing debt
   → Solution: Pay off some current loans

❌ Incomplete profile
   → Solution: Add missing information

❌ Lender chose someone else
   → Solution: Try other loan offers
```

#### 5. Payment Failed

**Problem:** Monthly payment didn't go through

**Solutions:**
```
Check 1: Wallet balance
- Do you have enough funds?
- Include gas fees (transaction costs)

Check 2: Network issues
- Is your internet working?
- Is MetaMask connected?

Check 3: Transaction settings
- Gas fee too low?
- Try increasing gas fee

Fix steps:
1. Add funds to wallet if needed
2. Try payment again
3. Contact lender if issue persists
4. Check transaction history
```

#### 6. Can't See Loan Offers

**Problem:** Listings page is empty

**Solutions:**
```
Reason 1: Risk score too low
- Some lenders set minimum scores
- Improve your score first
- Look for "New Borrower Friendly" loans

Reason 2: Filters too strict
- Reset all filters
- Broaden your search criteria

Reason 3: No loans in your amount range
- Try different loan amounts
- Check back later for new offers

Reason 4: Technical issue
- Refresh the page (F5)
- Clear browser cache
- Try different browser
```

---

## Security Tips

### Protect Your Account:

1. **Never Share Your Seed Phrase**
   ```
   ❌ Don't share with anyone
   ❌ Don't type it online
   ❌ Don't take screenshots
   ✅ Write it on paper
   ✅ Store in safe place
   ✅ Make backup copy
   ```

2. **Use Strong Wallet Password**
   ```
   ✅ At least 12 characters
   ✅ Mix letters, numbers, symbols
   ✅ Unique password
   ❌ Don't use "password123"
   ❌ Don't use same password everywhere
   ```

3. **Be Careful of Scams**
   ```
   🚨 Red flags:
   - "Give me your seed phrase"
   - "Send money to verify"
   - "Too good to be true" offers
   - Urgent requests
   - Suspicious links
   
   ✅ Always:
   - Verify URLs
   - Double-check addresses
   - Take your time
   - Ask questions
   ```

4. **Keep Software Updated**
   ```
   Update regularly:
   - MetaMask extension
   - Web browser
   - Operating system
   - Antivirus software
   ```

---

## Tips for Success

### For Borrowers:

1. **Start Small**
   - First loan: $500-$1,000
   - Build trust gradually
   - Pay back on time

2. **Be Realistic**
   - Only borrow what you need
   - Make sure you can repay
   - Factor in interest

3. **Communicate**
   - Having trouble? Tell your lender early
   - Most lenders are understanding
   - Work out payment plans

4. **Build Your Score**
   - Pay every loan on time
   - Complete what you start
   - Keep debts manageable

### For Lenders:

1. **Diversify**
   - Don't lend everything to one person
   - Spread risk across multiple loans
   - Mix of risk levels

2. **Check Borrowers**
   - Review risk scores
   - Check history
   - Read loan purpose

3. **Start Conservative**
   - Begin with smaller amounts
   - Learn the platform
   - Gradually increase

4. **Set Clear Terms**
   - Clear interest rates
   - Realistic durations
   - Fair requirements

---

## Getting Help

### Support Options:

1. **Documentation**
   - Read this guide
   - Check FAQ section
   - Watch video tutorials

2. **Community**
   - Join Discord server
   - Ask in forums
   - Learn from others

3. **Contact Support**
   ```
   📧 Email: support@credchain.com
   💬 Live Chat: Available in app
   🐦 Twitter: @CredChain
   📱 Discord: discord.gg/credchain
   ```

4. **Report Issues**
   ```
   Bug reports:
   - Describe the problem
   - Include screenshots
   - Note what you were doing
   - Share error messages
   ```

---

## Quick Reference

### Key Terms:

- **Wallet**: Your digital account/purse
- **Risk Score**: Your trustworthiness rating (0-1000)
- **Principal**: The original loan amount
- **Interest**: Extra money paid for borrowing
- **APR**: Annual Percentage Rate (yearly interest)
- **Collateral**: Something valuable you promise if you can't pay
- **Default**: Failing to repay a loan
- **Blockchain**: The secure technology behind CredChain

### Important Numbers:

```
Risk Score Ranges:
800-1000: Excellent
600-799: Good
400-599: Fair
0-399: Poor

Typical Interest Rates:
Excellent score: 5-8%
Good score: 8-12%
Fair score: 12-20%
Poor score: 20%+

Loan Amounts:
First loan: $500-$2,000
Good history: $2,000-$10,000
Excellent history: $10,000+
```

### Quick Actions:

```
To borrow:
Home → Listings → Filter → Request Loan

To lend:
Home → Create Loan → Set Terms → Publish

To pay:
Home → Active Loans → Make Payment

To check score:
Home → Profile → Risk Score

To see history:
Home → History → Filter
```

---

## Conclusion

CredChain makes lending and borrowing simple, secure, and fair. Remember:

✅ **Start small** and build trust
✅ **Pay on time** to improve your score
✅ **Be honest** in your profile
✅ **Communicate** with lenders/borrowers
✅ **Stay secure** - never share seed phrases
✅ **Ask for help** when you need it

**Ready to get started?** Connect your wallet and begin your CredChain journey today!

---

## Technical Reference

For developers and technical users, here's the key code structure:

### Frontend Architecture:
```typescript
// Next.js 16.0.0 with TypeScript
credchain/frontend/
├── app/
│   ├── listing/          // Loan marketplace
│   ├── login/            // Web3 authentication
│   ├── onboarding/       // User setup
│   └── profile/          // User management
├── components/           // Reusable UI
└── lib/supabase/         // Database client
```

### Backend Services:
```python
# Python-based risk assessment
credchain/backend/
├── loan_calculator.py    # Loan calculations
├── scoring_logic.py      # Risk scoring
├── seed.py              # Database setup
└── update_scores.py      # Automated updates
```

### Database Schema:
```sql
-- Supabase PostgreSQL
users (
  id uuid PRIMARY KEY,
  wallet_address text UNIQUE,
  risk_score integer,
  profile_picture text,
  created_at timestamp
)

loans (
  id uuid PRIMARY KEY,
  lender_id uuid REFERENCES users,
  borrower_id uuid REFERENCES users,
  amount decimal,
  interest_rate decimal,
  duration integer,
  status text
)

transactions (
  id uuid PRIMARY KEY,
  loan_id uuid REFERENCES loans,
  amount decimal,
  type text,
  created_at timestamp
)
```

### Web3 Integration:
```typescript
// RainbowKit + Viem for wallet connection
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';

const config = createConfig({
  connectors: connectorsForWallets([...]),
  transports: {
    mainnet: http(),
  },
});
```

### Environment Setup:
```bash
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_DICEBEAR_API_KEY=your_dicebear_key

# Run Development:
cd frontend && pnpm dev          # Port 3000
cd backend && python loan_calculator.py
```

---

*Last Updated: October 2024*
*Version: 1.0*
*For questions: support@credchain.com*
=======
# CredChain - Decentralized P2P Lending Platform

CredChain is a decentralized peer-to-peer lending platform that connects borrowers and lenders directly through blockchain technology. It leverages smart contracts to facilitate secure, transparent, and efficient lending transactions.

## Features

- 🔐 Secure wallet authentication
- 💰 P2P lending and borrowing
- 📊 Risk score assessment
- 💼 Transaction history tracking
- 🌐 Real-time updates
- 🎯 Personalized loan offers
- 📱 Responsive design

## Tech Stack

### Frontend
- **Framework:** Next.js 16.0.0
- **Language:** TypeScript
- **UI Components:** 
  - Radix UI
  - Tailwind CSS
  - Shadcn/ui
- **Web3:**
  - RainbowKit
  - Viem
- **State Management:** React Query
- **Database:** Supabase
- **Authentication:** Web3 + Supabase

### Backend
- **Language:** Python
- **Risk Assessment:** Custom scoring algorithm
- **Data Processing:** Automated score updates

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- PNPM
- MetaMask or any Web3 wallet
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/DSAI-Society-IIIT-Dharwad/torch-titans.git
cd credchain
```

2. Install frontend dependencies:
```bash
cd frontend
pnpm install
```

3. Set up environment variables:

Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Install backend dependencies:
```bash
cd ../backend
pip install -r requirements.txt
```

## Development

1. Start the frontend development server:
```bash
cd frontend
pnpm dev
```
The frontend will be available at `http://localhost:3000`

2. Run the backend server:
```bash
cd backend
python loan_calculator.py
```

## Project Structure

```
credchain/
├── backend/
│   ├── loan_calculator.py
│   ├── scoring_logic.py
│   ├── seed.py
│   └── update_scores.py
├── frontend/
│   ├── app/
│   │   ├── listing/
│   │   ├── login/
│   │   ├── onboarding/
│   │   └── profile/
│   ├── components/
│   ├── lib/
│   └── public/
└── README.md
```

## Features in Detail

### User Authentication
- Connect using Web3 wallet
- Profile creation and management
- Risk score calculation

### Lending
- Create loan offers
- Set interest rates and terms
- View borrower profiles
- Track lending history

### Borrowing
- Submit loan requests
- View loan offers
- Track borrowing history
- Monitor risk score

### Profile Management
- View transaction history
- Monitor risk score
- Track active loans
- Update profile information

## Contributing

1. Fork the repository
2. Create your feature branch:
```bash
git checkout -b feature/your-feature-name
```
3. Commit your changes:
```bash
git commit -m 'Add some feature'
```
4. Push to the branch:
```bash
git push origin feature/your-feature-name
```
5. Create a Pull Request

## Development Guidelines

- Follow TypeScript best practices
- Write clean, documented code
- Follow the existing code style
- Test your changes thoroughly
- Update documentation as needed

## Testing

```bash
# Run frontend tests
cd frontend
pnpm lint

# Run backend tests (if available)
cd backend
python -m pytest
```

## Deployment

1. Build the frontend:
```bash
cd frontend
pnpm build
```

2. Deploy to your hosting platform of choice (Vercel recommended for Next.js)

3. Set up the backend on a suitable Python hosting platform

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Created by DSAI Society IIIT Dharwad - feel free to contact us!

## Acknowledgments

- Thanks to all contributors
- Built during [Your Hackathon/Event Name]
- Special thanks to mentors and advisors
>>>>>>> origin/contri
