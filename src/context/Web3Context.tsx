import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  AgentLegendNFT,
  ActivityEvent,
  MarketplaceListing,
  MintTxStep,
  UserMintStatus,
  RarityTier,
  CharacterClass,
} from '../types';
import {
  CONTRACT_ADDRESSES,
  ECOSYSTEM_RULES,
  DEFAULT_CHAIN_ID,
  NETWORKS,
} from '../config/contracts';
import {
  INITIAL_FEATURED_NFTS,
  INITIAL_ACTIVITY_EVENTS,
  INITIAL_MARKETPLACE_LISTINGS,
} from '../data/initialData';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Web3ContextValue {
  // Connection state
  isConnected: boolean;
  address: string | null;
  chainId: number;
  bnbBalance: number;
  legendBalance: number;
  agentId: string | null;
  isConnecting: boolean;
  walletName: string | null;
  connectWallet: (walletType?: string) => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (targetChainId: number) => Promise<void>;
  verifyAgentId: (customId?: string) => Promise<boolean>;

  // User Mint Status
  userMintStatus: UserMintStatus;

  // Collection Stats (Synchronized)
  totalMinted: number;
  freeMinted: number;
  paidMinted: number;
  uniqueHolders: number;
  totalNfts: AgentLegendNFT[];
  ownedNfts: AgentLegendNFT[];

  // 25M Gift Reserve Telemetry
  giftReserveTotal: number;
  freeGiftReserveTotal: number;
  paidGiftReserveTotal: number;
  freeGiftDistributed: number;
  paidGiftDistributed: number;
  totalGiftDistributed: number;

  // Mint Execution
  mintTxStep: MintTxStep;
  mintError: string | null;
  latestTxHash: string | null;
  latestGiftReceived: number;
  resetMintState: () => void;
  executeFreeMint: () => Promise<boolean>;
  executePaidMint: (quantity: number) => Promise<boolean>;

  // NFT Evolution
  upgradeNft: (tokenId: number) => Promise<boolean>;

  // Marketplace
  marketplaceListings: MarketplaceListing[];
  buyMarketplaceItem: (listingId: string) => Promise<boolean>;
  listNftForSale: (tokenId: number, priceBnb: number) => Promise<boolean>;
  cancelListing: (listingId: string) => Promise<boolean>;

  // Live Activity Stream
  activityEvents: ActivityEvent[];
  latestBlock: number;
  isIndexerHealthy: boolean;
}

const Web3Context = createContext<Web3ContextValue | undefined>(undefined);

const STORAGE_KEY = 'agent_legends_state_v2';

const ARTWORK_POOL = [
  '/assets/images/agent_hero_cyber_warrior_1794084223199.jpg',
  '/assets/images/legend_valkyrie_ai_1794084222295.jpg',
  '/assets/images/legend_titan_mech_1794084224724.jpg',
  '/assets/images/legend_phantom_scout_1794084224734.jpg',
];

const CLASSES: CharacterClass[] = [
  'Cyber Operative',
  'Titan Mech',
  'Phantom Scout',
  'Valkyrie Vanguard',
  'Chrono Sentinel',
];

function getRandomRarity(): RarityTier {
  const r = Math.random();
  if (r < 0.01) return 'Mythic';
  if (r < 0.07) return 'Legendary';
  if (r < 0.25) return 'Epic';
  if (r < 0.55) return 'Rare';
  return 'Common';
}

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Wallet state
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [address, setAddress] = useState<string | null>('0x882190A922C09855b3F934f2D15777a83B4628Fa');
  const [chainId, setChainId] = useState<number>(DEFAULT_CHAIN_ID);
  const [bnbBalance, setBnbBalance] = useState<number>(0.485);
  const [legendBalance, setLegendBalance] = useState<number>(35000);
  const [agentId, setAgentId] = useState<string | null>('AGENT-BSC-8821');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [walletName, setWalletName] = useState<string | null>('Binance Web3 Wallet');

  // User Mint record
  const [userMintStatus, setUserMintStatus] = useState<UserMintStatus>({
    hasClaimedFree: false,
    paidMintsCount: 1,
    legendGiftsReceived: 10000,
    verifiedAgentId: 'AGENT-BSC-8821',
  });

  // Supply counts
  const [freeMinted, setFreeMinted] = useState<number>(892);
  const [paidMinted, setPaidMinted] = useState<number>(558);
  const [uniqueHolders, setUniqueHolders] = useState<number>(914);

  // NFTs and Activity
  const [allNfts, setAllNfts] = useState<AgentLegendNFT[]>(INITIAL_FEATURED_NFTS);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(INITIAL_ACTIVITY_EVENTS);
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>(
    INITIAL_MARKETPLACE_LISTINGS
  );
  const [latestBlock, setLatestBlock] = useState<number>(38924210);

  // Mint transaction flow states
  const [mintTxStep, setMintTxStep] = useState<MintTxStep>('IDLE');
  const [mintError, setMintError] = useState<string | null>(null);
  const [latestTxHash, setLatestTxHash] = useState<string | null>(null);
  const [latestGiftReceived, setLatestGiftReceived] = useState<number>(0);

  // Initialize from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.address !== undefined) setAddress(parsed.address);
        if (parsed.isConnected !== undefined) setIsConnected(parsed.isConnected);
        if (parsed.bnbBalance !== undefined) setBnbBalance(parsed.bnbBalance);
        if (parsed.legendBalance !== undefined) setLegendBalance(parsed.legendBalance);
        if (parsed.agentId !== undefined) setAgentId(parsed.agentId);
        if (parsed.userMintStatus) setUserMintStatus(parsed.userMintStatus);
        if (parsed.freeMinted) setFreeMinted(parsed.freeMinted);
        if (parsed.paidMinted) setPaidMinted(parsed.paidMinted);
        if (parsed.uniqueHolders) setUniqueHolders(parsed.uniqueHolders);
        if (parsed.allNfts && Array.isArray(parsed.allNfts)) setAllNfts(parsed.allNfts);
      }
    } catch {
      // LocalStorage access ignore
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        address,
        isConnected,
        bnbBalance,
        legendBalance,
        agentId,
        userMintStatus,
        freeMinted,
        paidMinted,
        uniqueHolders,
        allNfts,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // ignore
    }
  }, [
    address,
    isConnected,
    bnbBalance,
    legendBalance,
    agentId,
    userMintStatus,
    freeMinted,
    paidMinted,
    uniqueHolders,
    allNfts,
  ]);

  // Live Backend SSE Event Stream & Stats Sync
  useEffect(() => {
    // 1. Fetch initial live stats from backend
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.latestBlock) setLatestBlock(data.latestBlock);
        if (data.freeMinted) setFreeMinted(data.freeMinted);
        if (data.paidMinted) setPaidMinted(data.paidMinted);
        if (data.uniqueHolders) setUniqueHolders(data.uniqueHolders);
      })
      .catch(() => {});

    // 2. Subscribe to real-time Server-Sent Events (SSE) stream
    if (typeof window !== 'undefined' && window.EventSource) {
      const eventSource = new EventSource('/api/events/stream');

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'BLOCK_UPDATE' && data.blockNumber) {
            setLatestBlock(data.blockNumber);
          } else if (data.type === 'MINT_FREE' || data.type === 'MINT_PAID' || data.type === 'INSTANT_GIFT') {
            setActivityEvents((prev) => [data, ...prev]);
          }
        } catch {
          // parse error ignore
        }
      };

      return () => {
        eventSource.close();
      };
    } else {
      const timer = setInterval(() => {
        setLatestBlock((prev) => prev + 1);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, []);

  const totalMinted = freeMinted + paidMinted;

  // Gift telemetry
  const freeGiftDistributed = freeMinted * ECOSYSTEM_RULES.FREE_MINT_GIFT_LEGEND;
  const paidGiftDistributed = paidMinted * ECOSYSTEM_RULES.PAID_MINT_GIFT_LEGEND;
  const totalGiftDistributed = freeGiftDistributed + paidGiftDistributed;

  const ownedNfts = useMemo(() => {
    if (!address) return [];
    return allNfts.filter((nft) => nft.owner.toLowerCase() === address.toLowerCase());
  }, [allNfts, address]);

  // Wallet actions
  const connectWallet = useCallback(async (walletType = 'Binance Web3 Wallet') => {
    setIsConnecting(true);
    sound.playClick();
    // Simulate real Web3 connection handshaking
    await new Promise((res) => setTimeout(res, 600));
    const targetAddress = '0x882190A922C09855b3F934f2D15777a83B4628Fa';
    setAddress(targetAddress);
    setIsConnected(true);
    setWalletName(walletType);
    setAgentId('AGENT-BSC-8821');
    setIsConnecting(false);
    sound.playSuccess();
  }, []);

  const disconnectWallet = useCallback(() => {
    sound.playClick();
    setIsConnected(false);
    setAddress(null);
    setAgentId(null);
  }, []);

  const switchNetwork = useCallback(async (targetChainId: number) => {
    sound.playClick();
    if (!NETWORKS[targetChainId]) return;
    setChainId(targetChainId);
  }, []);

  const verifyAgentId = useCallback(async (customId?: string) => {
    sound.playClick();
    await new Promise((res) => setTimeout(res, 800));
    const verified = customId ? customId.toUpperCase() : `AGENT-BSC-${Math.floor(1000 + Math.random() * 9000)}`;
    setAgentId(verified);
    setUserMintStatus((prev) => ({
      ...prev,
      verifiedAgentId: verified,
    }));
    sound.playSuccess();
    return true;
  }, []);

  const resetMintState = useCallback(() => {
    setMintTxStep('IDLE');
    setMintError(null);
    setLatestTxHash(null);
    setLatestGiftReceived(0);
  }, []);

  // Free Mint Pipeline: 1 Free NFT + 5,000 LEGEND Instant Gift
  const executeFreeMint = useCallback(async (): Promise<boolean> => {
    if (!isConnected || !address) {
      setMintError('Please connect your wallet first.');
      return false;
    }
    if (!agentId) {
      setMintError('Verified Binance Agent ID required for Free Mint.');
      return false;
    }
    if (userMintStatus.hasClaimedFree) {
      setMintError('Limit reached: Maximum 1 free mint per canonical Agent ID.');
      return false;
    }
    if (freeMinted >= ECOSYSTEM_RULES.FREE_MINT_ALLOCATION) {
      setMintError('Free mint allocation (1,666 NFTs) is completely exhausted.');
      return false;
    }

    try {
      setMintError(null);
      // State 1: Checking eligibility
      setMintTxStep('CHECKING_ELIGIBILITY');
      sound.playClick();
      await new Promise((res) => setTimeout(res, 800));

      // State 2: Awaiting wallet confirmation
      setMintTxStep('AWAITING_WALLET');
      await new Promise((res) => setTimeout(res, 1000));

      // State 3: Transaction submitted
      setMintTxStep('TRANSACTION_SUBMITTED');
      const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      setLatestTxHash(txHash);
      await new Promise((res) => setTimeout(res, 900));

      // State 4: Transaction pending on-chain
      setMintTxStep('TRANSACTION_PENDING');
      await new Promise((res) => setTimeout(res, 1400));

      // State 5: Transaction confirmed & receipt decoded
      const newBlock = latestBlock + 1;
      setLatestBlock(newBlock);

      const nextTokenId = totalMinted + 1;
      const assignedRarity = getRandomRarity();
      const assignedClass = CLASSES[Math.floor(Math.random() * CLASSES.length)];
      const assignedImage = ARTWORK_POOL[Math.floor(Math.random() * ARTWORK_POOL.length)];

      const newNft: AgentLegendNFT = {
        tokenId: nextTokenId,
        name: `Agent Legend #${String(nextTokenId).padStart(4, '0')}`,
        characterClass: assignedClass,
        rarity: assignedRarity,
        rank: Math.floor(Math.random() * 1000) + 1,
        owner: address,
        agentId: agentId,
        image: assignedImage,
        mintTimestamp: Date.now(),
        evolutionLevel: 1,
        powerScore: 450 + Math.floor(Math.random() * 100),
        autonomousQuestsCompleted: 0,
        traits: [
          { trait_type: 'Core AI Engine', value: `${assignedClass} Kernel` },
          { trait_type: 'Chassis Alloy', value: 'Aerospace Carbonite' },
          { trait_type: 'Optics Array', value: 'Spectral Scanner' },
          { trait_type: 'Mint Allocation', value: 'Free Canonical Mint' },
          { trait_type: 'Instant Gift Status', value: '5,000 LEGEND Transferred' },
        ],
      };

      // Updates
      setFreeMinted((prev) => prev + 1);
      setAllNfts((prev) => [newNft, ...prev]);
      setUserMintStatus((prev) => ({
        ...prev,
        hasClaimedFree: true,
        legendGiftsReceived: prev.legendGiftsReceived + ECOSYSTEM_RULES.FREE_MINT_GIFT_LEGEND,
      }));
      setLegendBalance((prev) => prev + ECOSYSTEM_RULES.FREE_MINT_GIFT_LEGEND);
      setLatestGiftReceived(ECOSYSTEM_RULES.FREE_MINT_GIFT_LEGEND);

      // Activity events
      const mintEvent: ActivityEvent = {
        id: `evt-${Date.now()}-1`,
        type: 'MINT_FREE',
        title: `Free Genesis Mint (#${nextTokenId})`,
        description: `Verified Agent ${agentId} claimed NFT #${nextTokenId} + 5,000 LEGEND Instant Gift`,
        txHash,
        blockNumber: newBlock,
        timestamp: Date.now(),
        to: address,
        tokenId: nextTokenId,
        amountLegend: 5000,
      };

      const giftEvent: ActivityEvent = {
        id: `evt-${Date.now()}-2`,
        type: 'INSTANT_GIFT',
        title: 'Instant LEGEND Gift Transferred',
        description: `5,000 LEGEND transferred from Gift Reserve Vault to ${address.substring(0, 8)}...`,
        txHash,
        blockNumber: newBlock,
        timestamp: Date.now(),
        from: CONTRACT_ADDRESSES.TREASURY_VAULT,
        to: address,
        amountLegend: 5000,
      };

      setActivityEvents((prev) => [giftEvent, mintEvent, ...prev]);

      setMintTxStep('TRANSACTION_CONFIRMED');
      sound.playSuccess();
      sound.playLegendGift();

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8957FF', '#36BFFF', '#F2C46D'],
      });

      return true;
    } catch {
      setMintTxStep('TRANSACTION_FAILED');
      setMintError('Transaction failed on-chain or rejected by user.');
      return false;
    }
  }, [
    isConnected,
    address,
    agentId,
    userMintStatus.hasClaimedFree,
    freeMinted,
    latestBlock,
    totalMinted,
  ]);

  // Paid Mint Pipeline: 0.001 BNB per NFT, up to 6 Paid Mints + 10,000 LEGEND Instant Gift per NFT
  const executePaidMint = useCallback(
    async (quantity: number): Promise<boolean> => {
      if (!isConnected || !address) {
        setMintError('Please connect your wallet first.');
        return false;
      }
      if (!agentId) {
        setMintError('Verified Binance Agent ID required for Paid Mint.');
        return false;
      }
      if (quantity < 1 || quantity > ECOSYSTEM_RULES.MAX_PAID_MINTS_PER_AGENT) {
        setMintError(`Select between 1 and ${ECOSYSTEM_RULES.MAX_PAID_MINTS_PER_AGENT} NFTs.`);
        return false;
      }
      const remainingPaidQuota = ECOSYSTEM_RULES.MAX_PAID_MINTS_PER_AGENT - userMintStatus.paidMintsCount;
      if (quantity > remainingPaidQuota) {
        setMintError(`Limit exceeded: You have ${remainingPaidQuota} paid mints remaining (max 6 per Agent ID).`);
        return false;
      }
      const costBnb = quantity * ECOSYSTEM_RULES.PAID_MINT_PRICE_BNB;
      if (bnbBalance < costBnb) {
        setMintError(`Insufficient BNB balance. Required: ${costBnb} BNB, Balance: ${bnbBalance} BNB.`);
        return false;
      }
      if (paidMinted + quantity > ECOSYSTEM_RULES.PAID_MINT_ALLOCATION) {
        setMintError(`Only ${ECOSYSTEM_RULES.PAID_MINT_ALLOCATION - paidMinted} paid mints remaining.`);
        return false;
      }

      try {
        setMintError(null);
        setMintTxStep('CHECKING_ELIGIBILITY');
        sound.playClick();
        await new Promise((res) => setTimeout(res, 800));

        setMintTxStep('AWAITING_WALLET');
        await new Promise((res) => setTimeout(res, 1100));

        setMintTxStep('TRANSACTION_SUBMITTED');
        const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        setLatestTxHash(txHash);
        await new Promise((res) => setTimeout(res, 900));

        setMintTxStep('TRANSACTION_PENDING');
        await new Promise((res) => setTimeout(res, 1600));

        const newBlock = latestBlock + 1;
        setLatestBlock(newBlock);

        const totalGift = quantity * ECOSYSTEM_RULES.PAID_MINT_GIFT_LEGEND;
        const newNfts: AgentLegendNFT[] = [];

        for (let i = 0; i < quantity; i++) {
          const tokenId = totalMinted + 1 + i;
          const assignedRarity = getRandomRarity();
          const assignedClass = CLASSES[Math.floor(Math.random() * CLASSES.length)];
          const assignedImage = ARTWORK_POOL[(totalMinted + i) % ARTWORK_POOL.length];

          newNfts.push({
            tokenId,
            name: `Agent Legend #${String(tokenId).padStart(4, '0')}`,
            characterClass: assignedClass,
            rarity: assignedRarity,
            rank: Math.floor(Math.random() * 1000) + 1,
            owner: address,
            agentId: agentId,
            image: assignedImage,
            mintTimestamp: Date.now(),
            evolutionLevel: 1,
            powerScore: 500 + Math.floor(Math.random() * 120),
            autonomousQuestsCompleted: 0,
            traits: [
              { trait_type: 'Core AI Engine', value: `${assignedClass} Kernel v2` },
              { trait_type: 'Chassis Alloy', value: 'Reinforced Adamantine' },
              { trait_type: 'Optics Array', value: 'Thermal Quantum Sight' },
              { trait_type: 'Mint Allocation', value: 'Paid Allocation (0.001 BNB)' },
              { trait_type: 'Instant Gift Status', value: '10,000 LEGEND Transferred' },
            ],
          });
        }

        // Deduct BNB & Add Gifts
        setBnbBalance((prev) => Math.max(0, Number((prev - costBnb).toFixed(4))));
        setLegendBalance((prev) => prev + totalGift);
        setPaidMinted((prev) => prev + quantity);
        setAllNfts((prev) => [...newNfts, ...prev]);
        setUserMintStatus((prev) => ({
          ...prev,
          paidMintsCount: prev.paidMintsCount + quantity,
          legendGiftsReceived: prev.legendGiftsReceived + totalGift,
        }));
        setLatestGiftReceived(totalGift);

        // Activity Events
        const mintEvent: ActivityEvent = {
          id: `evt-${Date.now()}-1`,
          type: 'MINT_PAID',
          title: `Paid Genesis Mint (${quantity} NFT${quantity > 1 ? 's' : ''})`,
          description: `Verified Agent ${agentId} minted ${quantity} NFT(s) + ${totalGift.toLocaleString()} LEGEND Gift`,
          txHash,
          blockNumber: newBlock,
          timestamp: Date.now(),
          to: address,
          amountBnb: costBnb,
          amountLegend: totalGift,
        };

        const giftEvent: ActivityEvent = {
          id: `evt-${Date.now()}-2`,
          type: 'INSTANT_GIFT',
          title: 'Instant LEGEND Gift Transferred',
          description: `${totalGift.toLocaleString()} LEGEND transferred from Gift Reserve Vault to ${address.substring(0, 8)}...`,
          txHash,
          blockNumber: newBlock,
          timestamp: Date.now(),
          from: CONTRACT_ADDRESSES.TREASURY_VAULT,
          to: address,
          amountLegend: totalGift,
        };

        setActivityEvents((prev) => [giftEvent, mintEvent, ...prev]);
        setMintTxStep('TRANSACTION_CONFIRMED');
        sound.playSuccess();
        sound.playLegendGift();

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#8957FF', '#36BFFF', '#F2C46D'],
        });

        return true;
      } catch {
        setMintTxStep('TRANSACTION_FAILED');
        setMintError('Transaction failed on-chain or rejected by user.');
        return false;
      }
    },
    [
      isConnected,
      address,
      agentId,
      userMintStatus.paidMintsCount,
      bnbBalance,
      paidMinted,
      latestBlock,
      totalMinted,
    ]
  );

  // Upgrade NFT Evolution level
  const upgradeNft = useCallback(
    async (tokenId: number): Promise<boolean> => {
      const upgradeCost = 15000;
      if (legendBalance < upgradeCost) {
        alert(`Insufficient LEGEND balance. Upgrading costs ${upgradeCost.toLocaleString()} LEGEND.`);
        return false;
      }
      sound.playClick();
      await new Promise((res) => setTimeout(res, 900));

      setLegendBalance((prev) => prev - upgradeCost);
      setAllNfts((prev) =>
        prev.map((nft) => {
          if (nft.tokenId === tokenId) {
            return {
              ...nft,
              evolutionLevel: nft.evolutionLevel + 1,
              powerScore: nft.powerScore + 150,
            };
          }
          return nft;
        })
      );

      const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      const evEvent: ActivityEvent = {
        id: `evt-${Date.now()}`,
        type: 'EVOLUTION',
        title: `Agent #${tokenId} Evolution Upgrade`,
        description: `Upgraded to Evolution Level. Burned ${upgradeCost.toLocaleString()} LEGEND.`,
        txHash,
        blockNumber: latestBlock + 1,
        timestamp: Date.now(),
        to: address || '',
        tokenId,
        amountLegend: upgradeCost,
      };
      setActivityEvents((prev) => [evEvent, ...prev]);
      sound.playSuccess();
      return true;
    },
    [legendBalance, latestBlock, address]
  );

  // Marketplace actions
  const buyMarketplaceItem = useCallback(
    async (listingId: string): Promise<boolean> => {
      const listing = marketplaceListings.find((l) => l.id === listingId);
      if (!listing) return false;
      if (!isConnected || !address) {
        alert('Please connect wallet first.');
        return false;
      }
      if (bnbBalance < listing.priceBnb) {
        alert(`Insufficient BNB balance. Price: ${listing.priceBnb} BNB`);
        return false;
      }

      sound.playClick();
      await new Promise((res) => setTimeout(res, 1200));

      // Settle escrow
      setBnbBalance((prev) => Number((prev - listing.priceBnb).toFixed(4)));
      setAllNfts((prev) =>
        prev.map((item) => {
          if (item.tokenId === listing.nft.tokenId) {
            return { ...item, owner: address, isListed: false };
          }
          return item;
        })
      );
      setMarketplaceListings((prev) => prev.filter((l) => l.id !== listingId));

      const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      const saleEvent: ActivityEvent = {
        id: `evt-${Date.now()}`,
        type: 'SALE',
        title: 'Marketplace Settlement',
        description: `${listing.nft.name} purchased for ${listing.priceBnb} BNB`,
        txHash,
        blockNumber: latestBlock + 1,
        timestamp: Date.now(),
        from: listing.seller,
        to: address,
        tokenId: listing.nft.tokenId,
        amountBnb: listing.priceBnb,
      };
      setActivityEvents((prev) => [saleEvent, ...prev]);
      sound.playSuccess();
      return true;
    },
    [marketplaceListings, isConnected, address, bnbBalance, latestBlock]
  );

  const listNftForSale = useCallback(
    async (tokenId: number, priceBnb: number): Promise<boolean> => {
      const targetNft = allNfts.find((n) => n.tokenId === tokenId);
      if (!targetNft || !address) return false;

      sound.playClick();
      await new Promise((res) => setTimeout(res, 800));

      const newListing: MarketplaceListing = {
        id: `list-${Date.now()}`,
        nft: targetNft,
        seller: address,
        sellerAgentId: agentId || 'AGENT-BSC-UNVERIFIED',
        priceBnb,
        listedAt: Date.now(),
        escrowStatus: 'ACTIVE',
      };

      setMarketplaceListings((prev) => [newListing, ...prev]);
      setAllNfts((prev) =>
        prev.map((item) => {
          if (item.tokenId === tokenId) {
            return { ...item, isListed: true, listingPriceBnb: priceBnb };
          }
          return item;
        })
      );

      const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      const listEvent: ActivityEvent = {
        id: `evt-${Date.now()}`,
        type: 'LISTING',
        title: 'New NFT Listed',
        description: `${targetNft.name} listed on Marketplace for ${priceBnb} BNB`,
        txHash,
        blockNumber: latestBlock + 1,
        timestamp: Date.now(),
        from: address,
        tokenId,
        amountBnb: priceBnb,
      };
      setActivityEvents((prev) => [listEvent, ...prev]);
      sound.playSuccess();
      return true;
    },
    [allNfts, address, agentId, latestBlock]
  );

  const cancelListing = useCallback(
    async (listingId: string): Promise<boolean> => {
      const listing = marketplaceListings.find((l) => l.id === listingId);
      if (!listing) return false;

      sound.playClick();
      await new Promise((res) => setTimeout(res, 700));

      setMarketplaceListings((prev) => prev.filter((l) => l.id !== listingId));
      setAllNfts((prev) =>
        prev.map((item) => {
          if (item.tokenId === listing.nft.tokenId) {
            return { ...item, isListed: false, listingPriceBnb: undefined };
          }
          return item;
        })
      );
      sound.playSuccess();
      return true;
    },
    [marketplaceListings]
  );

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        address,
        chainId,
        bnbBalance,
        legendBalance,
        agentId,
        isConnecting,
        walletName,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        verifyAgentId,
        userMintStatus,
        totalMinted,
        freeMinted,
        paidMinted,
        uniqueHolders,
        totalNfts: allNfts,
        ownedNfts,
        giftReserveTotal: ECOSYSTEM_RULES.TOTAL_GIFT_RESERVE_LEGEND,
        freeGiftReserveTotal: ECOSYSTEM_RULES.FREE_MINT_GIFT_RESERVE,
        paidGiftReserveTotal: ECOSYSTEM_RULES.PAID_MINT_GIFT_RESERVE,
        freeGiftDistributed,
        paidGiftDistributed,
        totalGiftDistributed,
        mintTxStep,
        mintError,
        latestTxHash,
        latestGiftReceived,
        resetMintState,
        executeFreeMint,
        executePaidMint,
        upgradeNft,
        marketplaceListings,
        buyMarketplaceItem,
        listNftForSale,
        cancelListing,
        activityEvents,
        latestBlock,
        isIndexerHealthy: true,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
