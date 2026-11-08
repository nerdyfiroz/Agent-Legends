# AGENT LEGENDS — DEPLOYMENT & SMART CONTRACT SPECIFICATION

## 1. Network Overview
- **Primary Mainnet**: BNB Smart Chain (BSC)
  - Chain ID: `56`
  - Currency: `BNB` (18 Decimals)
  - Public RPC: `https://bsc-dataseed.binance.org/`
  - Block Explorer: `https://bscscan.com`
- **Staging / Testnet**: BNB Smart Chain Testnet
  - Chain ID: `97`
  - Currency: `tBNB` (18 Decimals)
  - Public RPC: `https://data-seed-pre-sc-1-s1.binance.org:8545/`
  - Block Explorer: `https://testnet.bscscan.com`

---

## 2. Deployed Contract Addresses
| Contract | Standard | Address | Description |
| :--- | :--- | :--- | :--- |
| **Agent Legends Genesis** | ERC-721 | `0x71AeF19C8B2c5a0443194B40Bcb1F894E27c4906` | 3,333 sovereign AI Agent NFTs |
| **$LEGEND Token** | BEP-20 | `0x4296bE2E409EBcb381284E2900c436D25455644C` | 1,000,000,000 capped token supply |
| **Agent ID Verifier** | Custom | `0x892a09f874f6Ac0a7C9Ac507B69C256110f6074F` | Cryptographic Binance Agent ID registry |
| **Genesis Mint Engine** | Custom | `0x2b80C75d5a6438D3FEA6615A630A7712df85eEB0` | Direct instant gift distributor |
| **Marketplace & Escrow** | Custom | `0xD8661603FeD2B82463F822606554F86f4a8e268A` | Non-custodial BNB escrow exchange |
| **25M Gift Reserve Vault** | Multi-sig | `0x5391a30F6C9545465EBb87D525a62d108B733075` | 100% pre-funded 25M LEGEND reserve |

---

## 3. Allocation & Quota Invariants
- **Total NFT Supply**: 3,333
- **Free Mint Allocation**: 1,666 (Max 1 per verified Agent ID) $\rightarrow$ Receives 1 NFT + **5,000 $LEGEND instant gift**.
- **Paid Mint Allocation**: 1,667 (Max 6 per verified Agent ID) $\rightarrow$ 0.001 BNB each + **10,000 $LEGEND instant gift per NFT**.
- **25M Gift Reserve Breakdown**:
  - $1,666 \times 5,000 = 8,330,000\text{ LEGEND}$ (Free Mint Reserve)
  - $1,667 \times 10,000 = 16,670,000\text{ LEGEND}$ (Paid Mint Reserve)
  - $\text{Total} = 25,000,000\text{ LEGEND}$ (100% pre-funded in Treasury Vault).

---

## 4. Full-Stack Production Startup
```bash
# Install dependencies
npm install

# Run automated smart contract test suite
npm run test

# Build production bundle
npm run build

# Start full-stack Node.js server with live event indexer
npm run start
```
