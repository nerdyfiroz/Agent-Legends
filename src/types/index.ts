export type RarityTier = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export type CharacterClass =
  | 'Cyber Operative'
  | 'Titan Mech'
  | 'Phantom Scout'
  | 'Valkyrie Vanguard'
  | 'Chrono Sentinel';

export interface Trait {
  trait_type: string;
  value: string | number;
  rarityScore?: number;
}

export interface AgentLegendNFT {
  tokenId: number;
  name: string;
  characterClass: CharacterClass;
  rarity: RarityTier;
  rank: number;
  owner: string;
  agentId: string;
  image: string;
  mintTimestamp: number;
  evolutionLevel: number;
  powerScore: number;
  autonomousQuestsCompleted: number;
  traits: Trait[];
  isListed?: boolean;
  listingPriceBnb?: number;
}

export interface ActivityEvent {
  id: string;
  type: 'MINT_FREE' | 'MINT_PAID' | 'INSTANT_GIFT' | 'TRANSFER' | 'EVOLUTION' | 'LISTING' | 'SALE';
  title: string;
  description: string;
  txHash: string;
  blockNumber: number;
  timestamp: number;
  from?: string;
  to?: string;
  tokenId?: number;
  amountBnb?: number;
  amountLegend?: number;
}

export interface MarketplaceListing {
  id: string;
  nft: AgentLegendNFT;
  seller: string;
  sellerAgentId: string;
  priceBnb: number;
  listedAt: number;
  escrowStatus: 'ACTIVE' | 'SETTLING' | 'SETTLED' | 'CANCELLED';
}

export type MintTxStep =
  | 'IDLE'
  | 'CHECKING_ELIGIBILITY'
  | 'AWAITING_WALLET'
  | 'TRANSACTION_SUBMITTED'
  | 'TRANSACTION_PENDING'
  | 'TRANSACTION_CONFIRMED'
  | 'TRANSACTION_FAILED';

export interface UserMintStatus {
  hasClaimedFree: boolean;
  paidMintsCount: number;
  legendGiftsReceived: number;
  verifiedAgentId: string | null;
}
