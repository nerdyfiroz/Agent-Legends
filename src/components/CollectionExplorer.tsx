import React, { useState, useMemo } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { AgentLegendNFT, RarityTier, CharacterClass } from '../types';
import { shortenAddress } from '../utils/formatting';
import { Search, Filter, ArrowUpDown, Zap, Eye, ShieldCheck, Sparkles, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface CollectionExplorerProps {
  onSelectNft: (nft: AgentLegendNFT) => void;
}

export const CollectionExplorer: React.FC<CollectionExplorerProps> = ({ onSelectNft }) => {
  const { totalNfts } = useWeb3();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('ALL');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'ID_ASC' | 'ID_DESC' | 'POWER_DESC' | 'EVO_DESC'>('ID_ASC');

  const filteredNfts = useMemo(() => {
    return totalNfts
      .filter((nft) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchId = String(nft.tokenId).includes(q);
          const matchName = nft.name.toLowerCase().includes(q);
          const matchOwner = nft.owner.toLowerCase().includes(q);
          const matchAgent = nft.agentId.toLowerCase().includes(q);
          if (!matchId && !matchName && !matchOwner && !matchAgent) return false;
        }

        // Rarity filter
        if (selectedRarity !== 'ALL' && nft.rarity !== selectedRarity) {
          return false;
        }

        // Class filter
        if (selectedClass !== 'ALL' && nft.characterClass !== selectedClass) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'ID_ASC') return a.tokenId - b.tokenId;
        if (sortBy === 'ID_DESC') return b.tokenId - a.tokenId;
        if (sortBy === 'POWER_DESC') return b.powerScore - a.powerScore;
        if (sortBy === 'EVO_DESC') return b.evolutionLevel - a.evolutionLevel;
        return 0;
      });
  }, [totalNfts, searchQuery, selectedRarity, selectedClass, sortBy]);

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
      <div>
        <div className="text-xs font-mono font-semibold text-[#8957FF] uppercase tracking-wider">
          On-Chain Gallery & Registry
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-1">
          Genesis Collection Explorer
        </h1>
        <p className="text-xs sm:text-sm text-[#8F94AB] mt-1.5 max-w-2xl leading-relaxed">
          Search, filter and inspect all 3,333 Genesis Agent Legend NFTs. Verified on BNB Smart Chain with immutable character traits and neural evolution levels.
        </p>
      </div>

      {/* Rarity Tier Stats Interactive Filter Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        {[
          { tier: 'Mythic', count: 33, color: 'text-[#F2C46D] border-[#F2C46D]/40' },
          { tier: 'Legendary', count: 200, color: 'text-[#8957FF] border-[#8957FF]/40' },
          { tier: 'Epic', count: 600, color: 'text-[#36BFFF] border-[#36BFFF]/40' },
          { tier: 'Rare', count: 1000, color: 'text-emerald-400 border-emerald-400/40' },
          { tier: 'Common', count: 1500, color: 'text-slate-300 border-white/[0.08]' },
        ].map((r) => {
          const isSelected = selectedRarity === r.tier;
          return (
            <button
              key={r.tier}
              onClick={() => {
                sound.playClick();
                setSelectedRarity(selectedRarity === r.tier ? 'ALL' : r.tier);
              }}
              className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#171A2B] ring-2 ring-[#8957FF] shadow-lg shadow-[#8957FF]/20 -translate-y-0.5'
                  : 'bg-[#111321] hover:bg-[#141626]'
              } ${r.color}`}
            >
              <div className="text-xs font-bold">{r.tier}</div>
              <div className="font-mono text-base font-extrabold text-white mt-0.5 tabular-nums">
                {r.count.toLocaleString()} NFTs
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-4 border border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
          {/* Search bar */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#8F94AB]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Token ID, name, or owner address..."
              className="w-full rounded-xl border border-white/[0.08] bg-[#080910] pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#8F94AB]/50 focus:border-[#8957FF] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-[#8F94AB] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Class Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-[#080910] px-3.5 py-2.5 text-xs text-white focus:border-[#8957FF] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Character Classes</option>
              <option value="Cyber Operative">Cyber Operative</option>
              <option value="Titan Mech">Titan Mech</option>
              <option value="Phantom Scout">Phantom Scout</option>
              <option value="Valkyrie Vanguard">Valkyrie Vanguard</option>
              <option value="Chrono Sentinel">Chrono Sentinel</option>
            </select>
          </div>

          {/* Rarity Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-[#080910] px-3.5 py-2.5 text-xs text-white focus:border-[#8957FF] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Rarities</option>
              <option value="Mythic">Mythic</option>
              <option value="Legendary">Legendary</option>
              <option value="Epic">Epic</option>
              <option value="Rare">Rare</option>
              <option value="Common">Common</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-xl border border-white/[0.08] bg-[#080910] px-3.5 py-2.5 text-xs text-white focus:border-[#8957FF] focus:outline-none cursor-pointer"
            >
              <option value="ID_ASC">Token ID: Low to High</option>
              <option value="ID_DESC">Token ID: High to Low</option>
              <option value="POWER_DESC">Power Score: Highest</option>
              <option value="EVO_DESC">Evolution: Highest</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#8F94AB] pt-2 border-t border-white/[0.06]">
          <span>
            Showing <strong className="text-white font-mono">{filteredNfts.length}</strong> matching NFTs
          </span>
          {(searchQuery || selectedRarity !== 'ALL' || selectedClass !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRarity('ALL');
                setSelectedClass('ALL');
              }}
              className="text-[#36BFFF] hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of NFTs */}
      {filteredNfts.length === 0 ? (
        <div className="glass-panel rounded-3xl p-14 text-center text-[#8F94AB] space-y-3">
          <p className="text-sm">No Genesis NFTs match your filter criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRarity('ALL');
              setSelectedClass('ALL');
            }}
            className="rounded-xl bg-[#171A2B] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#191D34] cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredNfts.map((nft) => (
            <div
              key={nft.tokenId}
              onClick={() => {
                sound.playClick();
                onSelectNft(nft);
              }}
              className="glass-card group cursor-pointer overflow-hidden rounded-3xl p-3 hover:border-[#8957FF]/60 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#080910]">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111321] via-transparent to-transparent opacity-85"></div>

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

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 backdrop-blur-[2px]">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-950 shadow-xl">
                      <Eye className="h-3.5 w-3.5" /> Inspect On-Chain
                    </span>
                  </div>
                </div>

                <div className="p-3.5 pt-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] font-semibold text-[#36BFFF] uppercase tracking-wider">
                      {nft.characterClass}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#F2C46D]">
                      <Zap className="h-3 w-3" /> {nft.powerScore} PWR
                    </span>
                  </div>

                  <div className="font-display text-base font-bold text-white group-hover:text-[#36BFFF] transition-colors truncate">
                    {nft.name}
                  </div>

                  <div className="text-[11px] text-[#8F94AB] flex items-center gap-2">
                    <span>Agent: {nft.agentId}</span>
                    <span>·</span>
                    <span>Level {nft.evolutionLevel}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 pt-0">
                <div className="flex items-center justify-between text-xs text-[#8F94AB] pt-2.5 border-t border-white/[0.06]">
                  <span>Owner:</span>
                  <span className="font-mono text-white/80">{shortenAddress(nft.owner, 4)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
