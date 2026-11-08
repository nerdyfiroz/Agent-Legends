import React from 'react';
import { AgentLegendNFT } from '../types';
import { useWeb3 } from '../context/Web3Context';
import { shortenAddress } from '../utils/formatting';
import { Sparkles, Eye, ShieldCheck, Zap, ArrowRight, Fingerprint, Cpu, Radio } from 'lucide-react';
import { sound } from '../utils/audio';

interface FeaturedLegendsProps {
  onSelectNft: (nft: AgentLegendNFT) => void;
  onViewAllClick: () => void;
}

export const FeaturedLegends: React.FC<FeaturedLegendsProps> = ({
  onSelectNft,
  onViewAllClick,
}) => {
  const { totalNfts } = useWeb3();

  // Show top 4 featured agent dossiers
  const featured = totalNfts.slice(0, 4);

  const getRarityBadgeStyle = (rarity: string) => {
    switch (rarity) {
      case 'Mythic':
        return 'text-[#F2C46D] border-[#F2C46D]/50 bg-[#F2C46D]/15';
      case 'Legendary':
        return 'text-[#8957FF] border-[#8957FF]/50 bg-[#8957FF]/15';
      case 'Epic':
        return 'text-[#36BFFF] border-[#36BFFF]/50 bg-[#36BFFF]/15';
      case 'Rare':
        return 'text-emerald-400 border-emerald-400/50 bg-emerald-400/15';
      default:
        return 'text-slate-300 border-slate-700 bg-slate-800/40';
    }
  };

  return (
    <section className="relative py-24 bg-[#080910] border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#36BFFF]/30 bg-[#36BFFF]/10 px-3.5 py-1 text-xs font-mono font-semibold text-[#36BFFF] mb-2.5">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>CLASSIFIED INTELLIGENCE ARCHIVES</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Featured Agent Dossiers
            </h2>
            <p className="text-sm sm:text-base text-[#8F94AB] mt-2 max-w-2xl leading-relaxed">
              Cryptographically verified Genesis Agent identities. Sovereign on-chain entities with modular neural cores, verified Binance Agent ID clearance, and instant $LEGEND token gifts.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onViewAllClick();
            }}
            className="group inline-flex items-center gap-2.5 rounded-2xl border border-white/[0.1] bg-[#111321] px-6 py-3.5 text-xs font-semibold text-white hover:border-[#8957FF]/60 hover:bg-[#171A2B] transition-all self-start sm:self-auto cursor-pointer shadow-lg shadow-black/40"
          >
            <span>Search Complete 3,333 Archives</span>
            <ArrowRight className="h-4 w-4 text-[#8957FF] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Sovereign Agent Dossier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((nft) => (
            <div
              key={nft.tokenId}
              onClick={() => {
                sound.playClick();
                onSelectNft(nft);
              }}
              className="tactical-box group relative cursor-pointer overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#111321] p-3.5 hover:border-[#8957FF]/60 transition-all duration-300 shadow-xl shadow-black/60 hover:-translate-y-1"
            >
              {/* Scanline & Hologram Layer */}
              <div className="absolute inset-0 scanlines-overlay opacity-25 pointer-events-none"></div>

              {/* Character Image Viewport */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#080910] border border-white/[0.06]">
                <img
                  src={nft.image}
                  alt={nft.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111321] via-transparent to-transparent opacity-85"></div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`rounded-xl border px-2.5 py-1 text-[10px] font-mono font-bold backdrop-blur-md shadow-md ${getRarityBadgeStyle(
                      nft.rarity
                    )}`}
                  >
                    {nft.rarity.toUpperCase()}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="rounded-xl border border-white/20 bg-black/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-semibold text-white shadow-md">
                    #{String(nft.tokenId).padStart(4, '0')}
                  </span>
                </div>

                {/* Hover Inspect CTA Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 backdrop-blur-xs">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-950 shadow-2xl transform translate-y-1 group-hover:translate-y-0 transition-transform">
                    <Fingerprint className="h-3.5 w-3.5 text-[#8957FF]" />
                    <span>Open Dossier</span>
                  </span>
                </div>
              </div>

              {/* Dossier Body Information */}
              <div className="p-3.5 pt-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] font-semibold text-[#36BFFF] uppercase tracking-wider">
                    {nft.characterClass}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#F2C46D]">
                    <Zap className="h-3 w-3" />
                    <span>{nft.powerScore} PWR</span>
                  </div>
                </div>

                <div className="font-display text-base font-bold text-white group-hover:text-[#36BFFF] transition-colors truncate">
                  {nft.name}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/[0.06] text-xs font-mono">
                  <div className="text-[11px]">
                    <span className="text-[#8F94AB]">Level: </span>
                    <strong className="text-white">Stage {nft.evolutionLevel}</strong>
                  </div>
                  <div className="text-[11px] text-right">
                    <span className="text-[#8F94AB]">Owner: </span>
                    <span className="text-[#36BFFF] font-semibold">{shortenAddress(nft.owner, 3)}</span>
                  </div>
                </div>

                {/* Instant Gift Badge */}
                <div className="flex items-center justify-between rounded-xl bg-[#080910] border border-white/[0.04] px-3 py-1.5 text-[10px] font-mono">
                  <span className="text-[#8F94AB]">Instant Gift:</span>
                  <span className="text-[#F2C46D] font-bold">+{(nft.giftAmount || (nft.tokenId <= 1666 ? 5000 : 10000)).toLocaleString()} LEGEND</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
