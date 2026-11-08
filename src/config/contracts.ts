/**
 * Canonical Smart Contract & Blockchain Configuration for Agent Legends
 * BNB Smart Chain (BSC) Mainnet & Testnet
 */

export interface NetworkConfig {
  chainId: number;
  name: string;
  currency: string;
  rpcUrl: string;
  explorerUrl: string;
  isTestnet: boolean;
}

export const NETWORKS: Record<number, NetworkConfig> = {
  56: {
    chainId: 56,
    name: 'BNB Smart Chain Mainnet',
    currency: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    explorerUrl: 'https://bscscan.com',
    isTestnet: false,
  },
  97: {
    chainId: 97,
    name: 'BNB Smart Chain Testnet',
    currency: 'tBNB',
    rpcUrl: 'https://data-seed-pre-sc-1-s1.binance.org:8545/',
    explorerUrl: 'https://testnet.bscscan.com',
    isTestnet: true,
  },
};

export const DEFAULT_CHAIN_ID = 56;

export const CONTRACT_ADDRESSES = {
  // ERC-721 Genesis NFT Contract
  NFT_GENESIS: '0x71AeF19C8B2c5a0443194B40Bcb1F894E27c4906',
  // BEP-20 LEGEND Ecosystem Token
  LEGEND_TOKEN: '0x4296bE2E409EBcb381284E2900c436D25455644C',
  // Binance Agent ID Verifier & Registry
  AGENT_REGISTRY: '0x892a09f874f6Ac0a7C9Ac507B69C256110f6074F',
  // Genesis Mint Engine with Instant Gift Distribution
  MINT_ENGINE: '0x2b80C75d5a6438D3FEA6615A630A7712df85eEB0',
  // Decentralized Marketplace & Escrow
  MARKETPLACE: '0xD8661603FeD2B82463F822606554F86f4a8e268A',
  // Multiverse Treasury & Gift Reserve Vault
  TREASURY_VAULT: '0x5391a30F6C9545465EBb87D525a62d108B733075',
} as const;

export const ECOSYSTEM_RULES = {
  // NFT Supply
  TOTAL_NFT_SUPPLY: 3333,
  FREE_MINT_ALLOCATION: 1666,
  PAID_MINT_ALLOCATION: 1667,
  PAID_MINT_PRICE_BNB: 0.001,

  // Limits per verified canonical Agent ID
  MAX_FREE_MINTS_PER_AGENT: 1,
  MAX_PAID_MINTS_PER_AGENT: 6,

  // Instant LEGEND Gift Rules
  FREE_MINT_GIFT_LEGEND: 5000,
  PAID_MINT_GIFT_LEGEND: 10000,

  // 25M LEGEND Gift Reserve
  TOTAL_GIFT_RESERVE_LEGEND: 25000000,
  FREE_MINT_GIFT_RESERVE: 8330000, // 1,666 * 5,000 = 8.33M
  PAID_MINT_GIFT_RESERVE: 16670000, // 1,667 * 10,000 = 16.67M

  // BEP-20 LEGEND Token
  TOTAL_LEGEND_SUPPLY: 1000000000, // 1,000,000,000 (1B)
} as const;

export const TOKENOMICS_BREAKDOWN = [
  {
    name: 'Community Rewards & Gifts',
    amount: 300000000,
    percentage: 30,
    description: 'Includes the dedicated 25M LEGEND Instant Gift Reserve (8.33M Free + 16.67M Paid), ecosystem gameplay rewards, and agent task bounties.',
    vesting: '25M unlocked at genesis for instant mint gifts; remainder 24-month linear stream',
    released: 25000000,
    locked: 275000000,
    contract: CONTRACT_ADDRESSES.TREASURY_VAULT,
    color: '#8957FF',
  },
  {
    name: 'Liquidity Pools (PancakeSwap & CEX)',
    amount: 200000000,
    percentage: 20,
    description: 'Initial DEX pairing with BNB on PancakeSwap v3 and tier-1 centralized exchange liquidity.',
    vesting: '100% unlocked at TGE, LP tokens locked in Unicrypt vault for 24 months',
    released: 200000000,
    locked: 0,
    contract: CONTRACT_ADDRESSES.LEGEND_TOKEN,
    color: '#36BFFF',
  },
  {
    name: 'Ecosystem & Autonomous Grants',
    amount: 200000000,
    percentage: 20,
    description: 'Funding AI agent developer SDKs, autonomous agent hosting nodes, and compute infrastructure grants.',
    vesting: '3-month cliff, 36-month linear vesting managed by DAO governance',
    released: 20000000,
    locked: 180000000,
    contract: CONTRACT_ADDRESSES.TREASURY_VAULT,
    color: '#F2C46D',
  },
  {
    name: 'NFT Holders Staking & Utility',
    amount: 150000000,
    percentage: 15,
    description: 'Dedicated staking rewards, agent reputation staking, and fee rebate pools for Agent Legends NFT holders.',
    vesting: 'Emissions over 48 months tied to Agent Evolution level and staking weight',
    released: 18750000,
    locked: 131250000,
    contract: CONTRACT_ADDRESSES.NFT_GENESIS,
    color: '#4ADE80',
  },
  {
    name: 'Development & Marketing',
    amount: 100000000,
    percentage: 10,
    description: 'Continuous protocol engineering, smart contract audits, agent intelligence fine-tuning, and global marketing.',
    vesting: '6-month cliff, 24-month linear vesting',
    released: 15000000,
    locked: 85000000,
    contract: CONTRACT_ADDRESSES.TREASURY_VAULT,
    color: '#FB7185',
  },
  {
    name: 'Core Team & Contributors',
    amount: 50000000,
    percentage: 5,
    description: 'Founding AI research engineers, Solidity security specialists, and core protocol architects.',
    vesting: '12-month cliff, 24-month quarterly unlock',
    released: 0,
    locked: 50000000,
    contract: '0x991E09F36eB6849bCd0d25A932EaEcA6e5e8E885',
    color: '#A855F7',
  },
] as const;

export const CONTRACT_ABIS = {
  ERC721: [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address owner) view returns (uint256)',
    'function ownerOf(uint256 tokenId) view returns (address)',
    'function tokenURI(uint256 tokenId) view returns (string)',
    'function freeMint(bytes signature) returns (uint256)',
    'function paidMint(uint256 quantity) payable returns (uint256[])',
    'function hasClaimedFree(address user) view returns (bool)',
    'function paidMintsCount(address user) view returns (uint256)',
    'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
    'event Minted(address indexed minter, uint256 indexed tokenId, bool isFree, uint256 legendGift)',
  ],
  BEP20: [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 value) returns (bool)',
    'function approve(address spender, uint256 value) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
  ],
} as const;
