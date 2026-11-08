import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { AgentLegendNFT, MarketplaceListing } from '../types';
import { formatBnb, shortenAddress, getBscScanAddressUrl } from '../utils/formatting';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import { ShoppingBag, ShieldCheck, Tag, ExternalLink, Zap, Check, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface MarketplaceViewProps {
  onSelectNft: (nft: AgentLegendNFT) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onSelectNft }) => {
  const {
    marketplaceListings,
    buyMarketplaceItem,
    cancelListing,
    address,
    isConnected,
    bnbBalance,
  } = useWeb3();

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleBuy = async (listing: MarketplaceListing) => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first.');
      return;
    }
    setLoadingId(listing.id);
    await buyMarketplaceItem(listing.id);
    setLoadingId(null);
  };

  const handleCancel = async (listingId: string) => {
    setLoadingId(listingId);
    await cancelListing(listingId);
    setLoadingId(null);
  };

  const getRarityBadgeStyle = (rarity: string) => {
    switch (rarity) {
      case 'Mythic':
        return 'text-[#F2C46D] border-[#F2C46D]/40 bg-[#F2C46D]/15';
      case 'Legendary':
        return 'text-[#8957FF] border-[#8957FF]/40 bg-[#8957FF]/15';
      case 'Epic':
        return 'text-[#36BFFF] border-[#36BFFF]/40 bg-[#36BFFF]/15';
      case 'Rare':
        return 'text-emerald-400 border-emerald-400/40 bg-emerald-400/15';
      default:
        return 'text-slate-300 border-slate-700 bg-slate-800/40';
    }
  };

  return (
    <div className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-semibold text-[#8957FF] uppercase tracking-wider">
            Decentralized Agent Exchange
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-1">
            Agent Legends Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-[#8F94AB] mt-1.5 leading-relaxed">
            Non-custodial smart contract escrow on BNB Smart Chain. Trade sovereign Genesis Agents with zero intermediary risk.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#111321] px-4 py-2.5 text-xs text-[#8F94AB] shadow-lg">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="font-medium text-white">Escrow Contract: Verified</span>
        </div>
      </div>

      {/* Network notice */}
      <div className="glass-panel rounded-2xl p-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#8F94AB] border border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
          <span>Settling payments in native BNB on BNB Smart Chain Mainnet (56)</span>
        </div>
        <a
          href={getBscScanAddressUrl(CONTRACT_ADDRESSES.MARKETPLACE)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#36BFFF] hover:underline flex items-center gap-1 font-mono text-[11px]"
        >
          <span>Contract {shortenAddress(CONTRACT_ADDRESSES.MARKETPLACE, 4)}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Listings Grid */}
      {marketplaceListings.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center text-[#8F94AB] space-y-3 border border-white/[0.06]">
          <ShoppingBag className="h-10 w-10 mx-auto text-[#8F94AB]/50" />
          <h3 className="font-display text-lg font-bold text-white">No Active Listings Currently</h3>
          <p className="text-xs text-[#8F94AB]">
            Genesis Agents can be listed for sale directly from your "My Legends" dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {marketplaceListings.map((item) => {
            const isSeller = address && item.seller.toLowerCase() === address.toLowerCase();

            return (
              <div
                key={item.id}
                className="glass-card overflow-hidden rounded-3xl p-3.5 hover:border-[#8957FF]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => {
                      sound.playClick();
                      onSelectNft(item.nft);
                    }}
                    className="relative aspect-square overflow-hidden rounded-2xl bg-[#080910] cursor-pointer group"
                  >
                    <img
                      src={item.nft.image}
                      alt={item.nft.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111321] via-transparent to-transparent opacity-85"></div>

                    <div className="absolute top-3 left-3">
                      <span
                        className={`rounded-xl border px-2.5 py-1 text-[11px] font-bold backdrop-blur-md shadow-md ${getRarityBadgeStyle(
                          item.nft.rarity
                        )}`}
                      >
                        {item.nft.rarity}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="rounded-xl border border-white/20 bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-semibold text-white shadow-md">
                        #{String(item.nft.tokenId).padStart(4, '0')}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] font-semibold text-[#36BFFF] uppercase tracking-wider">
                        {item.nft.characterClass}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-[#F2C46D] flex items-center gap-1">
                        <Zap className="h-3 w-3" /> {item.nft.powerScore} PWR
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-white truncate">
                      {item.nft.name}
                    </h3>

                    <div className="text-xs text-[#8F94AB] flex items-center justify-between pt-1">
                      <span>Seller: {shortenAddress(item.seller, 4)}</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1 font-mono text-[11px]">
                        <Check className="h-3 w-3" /> Escrow Ready
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] mb-4">
                    <div className="text-xs text-[#8F94AB]">Settlement Price</div>
                    <div className="font-mono text-xl font-extrabold text-white tabular-nums">
                      {item.priceBnb} BNB
                    </div>
                  </div>

                  {isSeller ? (
                    <button
                      onClick={() => handleCancel(item.id)}
                      disabled={loadingId === item.id}
                      className="touch-target-min w-full rounded-2xl border border-rose-500/40 bg-rose-500/10 py-3 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      {loadingId === item.id ? 'Cancelling...' : 'Cancel My Listing'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={loadingId === item.id}
                      className="touch-target-min w-full rounded-2xl bg-gradient-to-r from-[#8957FF] to-[#36BFFF] py-3 text-xs font-bold text-white shadow-xl shadow-[#8957FF]/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                    >
                      {loadingId === item.id ? 'Settling with Escrow...' : `Buy for ${item.priceBnb} BNB`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
