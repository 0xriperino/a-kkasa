# Mon Bagis

Trust in disaster relief starts with transparency.

**Mon Bagis** is a transparent donation platform built on the Monad blockchain. All donations and fund movements are recorded on-chain for full public accountability.

## Features

- **Full Transparency** — Every donation and fund movement is publicly verifiable on-chain
- **Institutional Verification** — Campaigns are verified with official reference numbers
- **Multi-Token Support** — Donate with native MON or mUSDC stablecoin
- **General Vault System** — Funds from campaigns that don't reach their target are redistributed via community voting
- **Real-Time Tracking** — Progress bars and transaction history update instantly after each donation
- **Admin Panel** — Wallet-gated admin access for campaign verification and organizational approvals

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Monad Testnet (EVM-compatible) |
| Smart Contracts | Solidity, Hardhat, OpenZeppelin |
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, Radix UI |
| Web3 | Wagmi v3, Viem |
| Database | Supabase (PostgreSQL) |
| State | TanStack React Query |

## Smart Contracts

| Contract | Address (Monad Testnet) |
|----------|------------------------|
| MockUSDC | `0x3EcB6722E74edbac426eb3cB6d2ef4A17F225913` |
| MonBagisVault | `0x8cBc65CE9012ABe7a0568529BE9156f628E2ee30` |

### Contract Functions

- `createCampaign(recipient, targetMUSDC, deadline)` — Create a new campaign
- `verifyCampaign(campaignId)` — Verify a campaign (owner only)
- `donateWithMON(campaignId)` — Donate with native MON
- `donateWithMUSDC(campaignId, amount)` — Donate with mUSDC
- `finalizeCampaign(campaignId)` — Finalize campaign (transfer funds if target met, move to general vault otherwise)
- `voteForGeneralVaultAllocation(campaignId)` — Vote for general vault distribution
- `executeGeneralVaultAllocation(campaignId)` — Distribute general vault to the leading campaign

## Setup

### Requirements

- Node.js 18+
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_MOCK_USDC_ADDRESS=0x3EcB6722E74edbac426eb3cB6d2ef4A17F225913
NEXT_PUBLIC_ACIKKASA_VAULT_ADDRESS=0x8cBc65CE9012ABe7a0568529BE9156f628E2ee30
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_ADMIN_WALLET=your-admin-wallet-address
```

### 3. Start Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Database Schema

| Table | Description |
|-------|-------------|
| `organizations` | Verified institutions (disaster relief agencies) |
| `campaigns` | Donation campaigns and metadata |
| `users` | Wallet-based user records |
| `transactions` | All on-chain transaction records |
| `general_vault_votes` | Community votes for general vault distribution |
| `general_vault_movements` | General vault deposit/withdrawal movements |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── campaigns/          # Campaign list and detail
│   ├── create-campaign/    # Campaign creation
│   ├── general-vault/      # General vault and voting
│   ├── transparency/       # Transparency page
│   └── admin/              # Admin panel
├── components/
│   ├── campaigns/          # Campaign components
│   ├── landing/            # Landing page sections
│   ├── layout/             # Header, Footer
│   ├── ui/                 # Radix UI components
│   └── web3/               # Wallet connection components
├── lib/                    # Utilities, contract config
├── providers/              # Wagmi & React Query providers
├── types/                  # TypeScript type definitions
└── data/                   # Mock data (development)

packages/hardhat/
├── contracts/              # Solidity smart contracts
└── scripts/                # Deploy and seed scripts
```

## How It Works

1. **Campaign Created** — An institution or individual starts a donation campaign
2. **Verified** — Admin reviews and verifies the campaign on-chain
3. **Donations Made** — Donors contribute with MON or mUSDC
4. **Funds Transferred** — When the target is reached, the smart contract transfers funds to the recipient
5. **General Vault** — Funds from expired campaigns are redistributed via community vote

## License

MIT
