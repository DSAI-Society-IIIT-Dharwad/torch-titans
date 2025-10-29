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