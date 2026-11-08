import React from 'react';
import { AgentLegendNFT } from '../types';
import { useWeb3 } from '../context/Web3Context';
import { shortenAddress } from '../utils/formatting';
import { Sparkles, Eye, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
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

  // Show top featured NFTs
  const featured = totalNfts.slice(0, 4);

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
    <section className="relative py-20 bg-[#080910]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="text-xs font-mono font-semibold text-[#36BFFF] uppercase tracking-wider">
              Autonomous AI Operatives
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1">
              Featured Genesis Legends
            </h2>
            <p className="text-xs sm:text-sm text-[#8F94AB] mt-1.5 max-w-xl leading-relaxed">
              Each Genesis NFT features bespoke robotic architecture, verifiable on-chain power ratings, and an instant $LEGEND token gift.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onViewAllClick();
            }}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#131627] px-5 py-2.5 text-xs font-semibold text-white hover:border-[#8957FF]/60 hover:bg-[#191D34] transition-all self-start sm:self-auto cursor-pointer"
          >
            <span>Explore All 3,333 NFTs</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Premium Featured NFT Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((nft) => (
            <div
              key={nft.tokenId}
              onClick={() => {
                sound.playClick();
                onSelectNft(nft);
              }}
              className="glass-card group relative cursor-pointer overflow-hidden rounded-3xl p-3 hover:border-[#8957FF]/60 transition-all duration-300"
            >
              {/* Image slot */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#080910]">
                <img
                  src={nft.image}
                  alt={nft.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111321] via-transparent to-transparent opacity-85"></div>

                {/* Floating Badges */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`rounded-xl border px-2.5 py-1 text-[11px] font-bold backdrop-blur-md shadow-md ${getRarityBadgeStyle(
                      nft.rarity
                    )}`}
                  >
                    {nft.rarity}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="rounded-xl border border-white/20 bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-semibold text-white shadow-md">
                    #{String(nft.tokenId).padStart(4, '0')}
                  </span>
                </div>

                {/* Hover overlay button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 backdrop-blur-[2px]">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-950 shadow-xl transform translate-y-1 group-hover:translate-y-0 transition-transform">
                    <Eye className="h-3.5 w-3.5" /> Inspect On-Chain
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 pt-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] font-semibold text-[#36BFFF] uppercase tracking-wider">
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

                <div className="flex items-center justify-between text-xs text-[#8F94AB] pt-2.5 border-t border-white/[0.06]">
                  <span className="font-medium text-white/80">Level {nft.evolutionLevel}</span>
                  <span className="font-mono text-[11px]">{shortenAddress(nft.owner, 4)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
