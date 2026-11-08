import React, { useState, useMemo } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { AgentLegendNFT } from '../types';
import { shortenAddress } from '../utils/formatting';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Zap, 
  Eye, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Fingerprint, 
  Radio, 
  Terminal,
  Cpu,
  BadgeCheck
} from 'lucide-react';
import { sound } from '../utils/audio';
import { AgentIdentityCardCreator } from './AgentIdentityCardCreator';

interface CollectionExplorerProps {
  onSelectNft: (nft: AgentLegendNFT) => void;
}

export const CollectionExplorer: React.FC<CollectionExplorerProps> = ({ onSelectNft }) => {
  const { totalNfts } = useWeb3();

  const [activeSubTab, setActiveSubTab] = useState<'archives' | 'id-creator'>('archives');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('ALL');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'ID_ASC' | 'ID_DESC' | 'POWER_DESC' | 'EVO_DESC'>('ID_ASC');

  const filteredNfts = useMemo(() => {
    return totalNfts
      .filter((nft) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchId = String(nft.tokenId).includes(q);
          const matchName = nft.name.toLowerCase().includes(q);
          const matchOwner = nft.owner.toLowerCase().includes(q);
          const matchAgent = nft.agentId.toLowerCase().includes(q);
          if (!matchId && !matchName && !matchOwner && !matchAgent) return false;
        }

        if (selectedRarity !== 'ALL' && nft.rarity !== selectedRarity) {
          return false;
        }

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
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header and Sub-Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8957FF]/30 bg-[#8957FF]/10 px-3.5 py-1 text-xs font-mono font-semibold text-[#8957FF] mb-2">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>CLASSIFIED INTELLIGENCE REGISTRY // BNB CHAIN 56</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Genesis Archives
          </h1>
          <p className="text-sm sm:text-base text-[#8F94AB] mt-1.5 max-w-2xl leading-relaxed">
            The sovereign database of 3,333 Genesis Agent identities. Filter by neural core class, rarity tier, and cryptographic power score.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-[#111321] rounded-2xl p-1.5 border border-white/[0.08] shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setActiveSubTab('archives');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'archives'
                ? 'bg-[#8957FF] text-white shadow-md shadow-[#8957FF]/30'
                : 'text-[#8F94AB] hover:text-white'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Archives Dossiers ({totalNfts.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveSubTab('id-creator');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'id-creator'
                ? 'bg-[#36BFFF] text-slate-950 font-bold shadow-md shadow-[#36BFFF]/30'
                : 'text-[#8F94AB] hover:text-white'
            }`}
          >
            <Fingerprint className="h-3.5 w-3.5" />
            <span>Create ID Dossier Card</span>
          </button>
        </div>
      </div>

      {/* Render ID Card Creator Sub-View */}
      {activeSubTab === 'id-creator' ? (
        <AgentIdentityCardCreator />
      ) : (
        <>
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
                  <div className="text-xs font-bold">{r.tier} Tier</div>
                  <div className="font-mono text-base font-extrabold text-white mt-0.5 tabular-nums">
                    {r.count.toLocaleString()} Dossiers
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search & Tactical Filter Toolbar */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#111321] p-5 space-y-4 shadow-xl shadow-black/50">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
              {/* Search bar */}
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#8F94AB]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Token ID, callsig, or Binance Agent ID..."
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
                  onChange={(e) => {
                    sound.playClick();
                    setSelectedClass(e.target.value);
                  }}
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
                  onChange={(e) => {
                    sound.playClick();
                    setSelectedRarity(e.target.value);
                  }}
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
                  onChange={(e) => {
                    sound.playClick();
                    setSortBy(e.target.value as any);
                  }}
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
                Verified Archives Index: <strong className="text-white font-mono">{filteredNfts.length}</strong> matching dossiers
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

          {/* Grid of Agent Dossiers */}
          {filteredNfts.length === 0 ? (
            <div className="rounded-3xl border border-white/[0.08] bg-[#111321] p-16 text-center text-[#8F94AB] space-y-4">
              <p className="text-base text-white">No Agent Dossiers match your cipher filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRarity('ALL');
                  setSelectedClass('ALL');
                }}
                className="rounded-xl bg-[#8957FF] px-6 py-3 text-xs font-bold text-white hover:bg-[#7040FF] cursor-pointer"
              >
                Clear Search & Filters
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
                  className="tactical-box group cursor-pointer overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#111321] p-3.5 hover:border-[#8957FF]/60 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/60 hover:-translate-y-1"
                >
                  {/* Scanline overlay */}
                  <div className="absolute inset-0 scanlines-overlay opacity-25 pointer-events-none"></div>

                  <div>
                    {/* Character Viewport */}
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#080910] border border-white/[0.06]">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111321] via-transparent to-transparent opacity-85"></div>

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

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 backdrop-blur-xs">
                        <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-950 shadow-2xl">
                          <Fingerprint className="h-3.5 w-3.5 text-[#8957FF]" />
                          <span>Inspect Dossier</span>
                        </span>
                      </div>
                    </div>

                    {/* Dossier Card Body */}
                    <div className="p-3.5 pt-4 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[10px] font-semibold text-[#36BFFF] uppercase tracking-wider">
                          {nft.characterClass}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#F2C46D]">
                          <Zap className="h-3 w-3" /> {nft.powerScore} PWR
                        </span>
                      </div>

                      <div className="font-display text-base font-bold text-white group-hover:text-[#36BFFF] transition-colors truncate">
                        {nft.name}
                      </div>

                      <div className="text-[11px] text-[#8F94AB] flex items-center gap-2 font-mono">
                        <span className="text-[#36BFFF]">{nft.agentId}</span>
                        <span>·</span>
                        <span className="text-white">Lvl {nft.evolutionLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="p-3.5 pt-0 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#8F94AB] pt-2 border-t border-white/[0.06] font-mono text-[11px]">
                      <span>Owner:</span>
                      <span className="text-white/80">{shortenAddress(nft.owner, 3)}</span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-[#080910] px-2.5 py-1 text-[10px] font-mono">
                      <span className="text-[#8F94AB]">Gift:</span>
                      <span className="text-[#F2C46D] font-bold">+{(nft.giftAmount || (nft.tokenId <= 1666 ? 5000 : 10000)).toLocaleString()} LEGEND</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
};
