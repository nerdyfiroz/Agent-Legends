import React, { useState } from 'react';
import { AgentLegendNFT } from '../types';
import { useWeb3 } from '../context/Web3Context';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import { shortenAddress, getBscScanTokenUrl, formatBnb, formatLegend } from '../utils/formatting';
import { X, ExternalLink, Zap, Shield, Sparkles, Tag, Check, Award } from 'lucide-react';
import { sound } from '../utils/audio';

interface NftDetailModalProps {
  nft: AgentLegendNFT | null;
  onClose: () => void;
}

export const NftDetailModal: React.FC<NftDetailModalProps> = ({ nft, onClose }) => {
  const { address, upgradeNft, listNftForSale, legendBalance, buyMarketplaceItem, marketplaceListings } =
    useWeb3();
  const [isListing, setIsListing] = useState(false);
  const [listPrice, setListPrice] = useState('0.15');
  const [actionLoading, setActionLoading] = useState(false);

  if (!nft) return null;

  const isOwner = address && nft.owner.toLowerCase() === address.toLowerCase();
  const activeListing = marketplaceListings.find((l) => l.nft.tokenId === nft.tokenId && l.escrowStatus === 'ACTIVE');

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

  const handleUpgrade = async () => {
    setActionLoading(true);
    await upgradeNft(nft.tokenId);
    setActionLoading(false);
  };

  const handleListForSale = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(listPrice);
    if (isNaN(price) || price <= 0) return;
    setActionLoading(true);
    await listNftForSale(nft.tokenId, price);
    setActionLoading(false);
    setIsListing(false);
  };

  const handleBuy = async () => {
    if (!activeListing) return;
    setActionLoading(true);
    await buyMarketplaceItem(activeListing.id);
    setActionLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.1] bg-[#111321] p-6 sm:p-8 shadow-2xl shadow-black/90">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-6 right-6 rounded-xl p-1.5 text-[#8F94AB] hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: NFT Image and Badges */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/[0.08] bg-[#080910]">
              <img
                src={nft.image}
                alt={nft.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span
                  className={`rounded-xl border px-3 py-1 text-xs font-bold backdrop-blur-md shadow-md ${getRarityBadgeStyle(
                    nft.rarity
                  )}`}
                >
                  {nft.rarity}
                </span>
                <span className="rounded-xl border border-white/20 bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-mono font-semibold text-white shadow-md">
                  Rank #{nft.rank}
                </span>
              </div>
            </div>

            {/* Power Score and Evolution status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/[0.06] bg-[#0C0E1A] p-4 text-center">
                <div className="text-[11px] text-[#8F94AB] font-medium flex items-center justify-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-[#F2C46D]" /> Power Score
                </div>
                <div className="mt-1 font-mono text-xl font-extrabold text-white tabular-nums">
                  {nft.powerScore}
                </div>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-[#0C0E1A] p-4 text-center">
                <div className="text-[11px] text-[#8F94AB] font-medium flex items-center justify-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-[#8957FF]" /> Evolution Tier
                </div>
                <div className="mt-1 font-mono text-xl font-extrabold text-[#8957FF]">
                  Level {nft.evolutionLevel}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Metadata & Traits & Actions */}
          <div className="space-y-5">
            <div>
              <div className="text-xs font-mono font-semibold text-[#36BFFF] uppercase tracking-wider">
                {nft.characterClass}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">{nft.name}</h2>
              <div className="mt-2 flex items-center gap-3 text-xs text-[#8F94AB] font-mono">
                <span>Token #{String(nft.tokenId).padStart(4, '0')}</span>
                <span>·</span>
                <span>Agent ID: {nft.agentId}</span>
              </div>
            </div>

            {/* Owner info */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0C0E1A] p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8F94AB]">Owner:</span>
                <span className="font-mono text-white font-semibold">
                  {isOwner ? 'You (' + shortenAddress(nft.owner) + ')' : shortenAddress(nft.owner, 6)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8F94AB]">Smart Contract:</span>
                <a
                  href={getBscScanTokenUrl(CONTRACT_ADDRESSES.NFT_GENESIS, nft.tokenId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#36BFFF] hover:underline font-mono"
                >
                  <span>ERC-721 Genesis</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Traits */}
            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-white">On-Chain Neural Traits</div>
              <div className="grid grid-cols-2 gap-2.5">
                {nft.traits.map((t, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/[0.04] bg-[#080910] p-3 text-left"
                  >
                    <div className="text-[10px] text-[#8F94AB] font-medium">{t.trait_type}</div>
                    <div className="mt-0.5 text-xs font-semibold text-white truncate">{t.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Actions */}
            <div className="pt-2 border-t border-white/[0.06] space-y-3">
              {isOwner ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleUpgrade}
                      disabled={actionLoading || legendBalance < 15000}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-[#8957FF]/50 bg-[#8957FF]/20 py-3 text-xs font-bold text-white hover:bg-[#8957FF]/30 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 text-[#F2C46D]" />
                      <span>Evolve (15k LEGEND)</span>
                    </button>

                    {!nft.isListed && !isListing ? (
                      <button
                        onClick={() => setIsListing(true)}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-[#36BFFF]/50 bg-[#36BFFF]/20 py-3 text-xs font-bold text-white hover:bg-[#36BFFF]/30 transition-colors cursor-pointer"
                      >
                        <Tag className="h-4 w-4 text-[#36BFFF]" />
                        <span>List for Sale</span>
                      </button>
                    ) : null}
                  </div>

                  {isListing && (
                    <form onSubmit={handleListForSale} className="rounded-2xl border border-white/[0.08] bg-[#080910] p-4 space-y-3">
                      <div className="text-xs font-semibold text-white">List on Marketplace</div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          step="0.001"
                          min="0.001"
                          value={listPrice}
                          onChange={(e) => setListPrice(e.target.value)}
                          className="w-full rounded-xl border border-white/[0.08] bg-[#111321] px-3.5 py-2 text-xs text-white"
                          placeholder="Price in BNB"
                        />
                        <span className="text-xs font-mono font-bold text-[#8F94AB]">BNB</span>
                      </div>
                      <div className="flex items-center justify-end gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsListing(false)}
                          className="px-3 py-1.5 text-xs text-[#8F94AB] hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="rounded-xl bg-[#36BFFF] px-4.5 py-2 text-xs font-bold text-slate-950 hover:bg-[#36BFFF]/90 cursor-pointer"
                        >
                          Confirm Listing
                        </button>
                      </div>
                    </form>
                  )}
                </>
              ) : activeListing ? (
                <div className="rounded-2xl border border-[#36BFFF]/40 bg-[#36BFFF]/10 p-4.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#8F94AB]">Listed on Marketplace</div>
                    <div className="font-mono text-lg font-bold text-white tabular-nums">
                      {activeListing.priceBnb} BNB
                    </div>
                  </div>
                  <button
                    onClick={handleBuy}
                    disabled={actionLoading}
                    className="rounded-2xl bg-gradient-to-r from-[#8957FF] to-[#36BFFF] px-6 py-3 text-xs font-bold text-white shadow-xl shadow-[#8957FF]/30 hover:opacity-95 cursor-pointer"
                  >
                    Buy with Escrow
                  </button>
                </div>
              ) : (
                <div className="text-xs text-[#8F94AB] italic">
                  This NFT is currently in the custody of {shortenAddress(nft.owner)}.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
