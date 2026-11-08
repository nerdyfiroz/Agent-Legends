import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { AgentLegendNFT } from '../types';
import { shortenAddress, formatLegend, formatBnb } from '../utils/formatting';
import { ShieldCheck, Sparkles, Zap, Award, Layers, PlusCircle, ArrowRight, Tag } from 'lucide-react';
import { sound } from '../utils/audio';

import { AgentIdentityCardCreator } from './AgentIdentityCardCreator';

interface MyLegendsViewProps {
  onSelectNft: (nft: AgentLegendNFT) => void;
  onGoToMint: () => void;
  onOpenAgentModal: () => void;
}

export const MyLegendsView: React.FC<MyLegendsViewProps> = ({
  onSelectNft,
  onGoToMint,
  onOpenAgentModal,
}) => {
  const {
    isConnected,
    address,
    agentId,
    ownedNfts,
    legendBalance,
    bnbBalance,
    userMintStatus,
  } = useWeb3();

  const [activeSubTab, setActiveSubTab] = React.useState<'inventory' | 'creator'>('inventory');

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
    <div className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-12">
      {/* Header with Sub-Navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="text-xs font-mono font-semibold text-[#36BFFF] uppercase tracking-wider">
            Sovereign Agent Command Deck
          </div>
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-1">
            My Agent Legends
          </h1>
          <p className="text-xs sm:text-sm text-[#8F94AB] mt-1.5 leading-relaxed">
            Manage your personal Genesis AI Agents, evolve neural ranks, and generate shareable identity badges.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-2 bg-[#111321] p-1.5 rounded-2xl border border-white/[0.08]">
          <button
            onClick={() => {
              sound.playClick();
              setActiveSubTab('inventory');
            }}
            className={`touch-target-min px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'inventory'
                ? 'bg-[#8957FF] text-white shadow-md shadow-[#8957FF]/30'
                : 'text-[#8F94AB] hover:text-white'
            }`}
          >
            My Agents ({ownedNfts.length})
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveSubTab('creator');
            }}
            className={`touch-target-min px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'creator'
                ? 'bg-[#36BFFF] text-slate-950 shadow-md shadow-[#36BFFF]/30'
                : 'text-[#8F94AB] hover:text-white'
            }`}
          >
            Generate Card
          </button>
        </div>
      </div>

      {activeSubTab === 'creator' ? (
        <AgentIdentityCardCreator />
      ) : (
        <>
          {/* User Dashboard Profile & Telemetry */}
          <div className="glass-panel rounded-3xl p-7 lg:p-8 space-y-6 border border-white/[0.08]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Identity & Agent ID */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0C0E1A] p-5 space-y-2">
            <div className="text-xs text-[#8F94AB]">Binance Agent ID</div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-white">
                {agentId || 'Unverified'}
              </span>
              {agentId ? (
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              ) : (
                <button
                  onClick={onOpenAgentModal}
                  className="text-xs text-[#36BFFF] underline cursor-pointer"
                >
                  Verify
                </button>
              )}
            </div>
            <div className="text-[11px] font-mono text-[#8F94AB]">
              {address ? shortenAddress(address, 6) : 'Disconnected'}
            </div>
          </div>

          {/* Owned NFTs */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0C0E1A] p-5 space-y-1">
            <div className="text-xs text-[#8F94AB]">Genesis NFTs Owned</div>
            <div className="font-display text-3xl font-extrabold text-white tabular-nums">
              {ownedNfts.length}
            </div>
            <div className="text-[11px] text-[#36BFFF] font-mono">
              Total Power: {ownedNfts.reduce((acc, n) => acc + n.powerScore, 0)} PWR
            </div>
          </div>

          {/* Total Gifts Received */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0C0E1A] p-5 space-y-1">
            <div className="text-xs text-[#8F94AB]">Instant LEGEND Gifts</div>
            <div className="font-display text-3xl font-extrabold text-[#F2C46D] tabular-nums">
              +{formatLegend(userMintStatus.legendGiftsReceived)}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono">100% On-Chain Transferred</div>
          </div>

          {/* Wallet Balance */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0C0E1A] p-5 space-y-1">
            <div className="text-xs text-[#8F94AB]">Active Balances</div>
            <div className="font-mono text-sm font-bold text-white tabular-nums">
              {formatBnb(bnbBalance)} BNB
            </div>
            <div className="font-mono text-xs text-[#F2C46D] tabular-nums">
              {formatLegend(legendBalance)} $LEGEND
            </div>
          </div>
        </div>

        {/* Mint Allocation Usage Strip */}
        <div className="rounded-2xl border border-white/[0.04] bg-[#080910] p-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[#8F94AB]">Free Mint: </span>
              <strong className={userMintStatus.hasClaimedFree ? 'text-emerald-400' : 'text-white'}>
                {userMintStatus.hasClaimedFree ? 'Claimed (1/1)' : 'Available (1/1)'}
              </strong>
            </div>
            <div>
              <span className="text-[#8F94AB]">Paid Mints: </span>
              <strong className="text-white tabular-nums">
                {userMintStatus.paidMintsCount} / 6 Used ({6 - userMintStatus.paidMintsCount} remaining)
              </strong>
            </div>
          </div>

          <div className="text-[#8F94AB]">
            Maximum allowance: 1 Free + 6 Paid per canonical Agent ID
          </div>
        </div>
      </div>

      {/* Owned NFTs Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Your Deployed Agents ({ownedNfts.length})
          </h2>
          <span className="text-xs text-[#8F94AB]">Click any Agent to Evolve or List for Sale</span>
        </div>

        {ownedNfts.length === 0 ? (
          <div className="glass-panel rounded-3xl p-16 text-center space-y-5 border border-white/[0.06]">
            <div className="h-14 w-14 rounded-2xl bg-[#080910] text-[#8F94AB] mx-auto flex items-center justify-center border border-white/[0.06]">
              <Layers className="h-7 w-7" />
            </div>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="font-display text-lg font-bold text-white">No Agent Legends Owned Yet</h3>
              <p className="text-xs sm:text-sm text-[#8F94AB] leading-relaxed">
                Mint your first sovereign Genesis Agent to receive an instant 5,000 to 10,000 $LEGEND gift and deploy autonomous actions.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onGoToMint();
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#8957FF] to-[#36BFFF] px-7 py-3.5 text-xs font-bold text-white shadow-xl cursor-pointer"
            >
              <span>Mint Genesis NFT Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ownedNfts.map((nft) => (
              <div
                key={nft.tokenId}
                onClick={() => {
                  sound.playClick();
                  onSelectNft(nft);
                }}
                className="glass-card group cursor-pointer overflow-hidden rounded-3xl p-3 hover:border-[#8957FF] transition-all duration-300"
              >
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

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {nft.isListed && (
                      <span className="rounded-xl border border-amber-400/40 bg-amber-400/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-amber-300">
                        Listed {nft.listingPriceBnb} BNB
                      </span>
                    )}
                    <span className="rounded-xl border border-white/20 bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-semibold text-white">
                      #{String(nft.tokenId).padStart(4, '0')}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] font-semibold text-[#36BFFF] uppercase tracking-wider">
                      {nft.characterClass}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[#F2C46D] flex items-center gap-1">
                      <Zap className="h-3 w-3" /> {nft.powerScore} PWR
                    </span>
                  </div>

                  <div className="font-display text-base font-bold text-white group-hover:text-[#36BFFF] transition-colors truncate">
                    {nft.name}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#8F94AB] pt-2.5 border-t border-white/[0.06]">
                    <span className="flex items-center gap-1.5 text-[#8957FF] font-semibold">
                      <Award className="h-3.5 w-3.5" /> Level {nft.evolutionLevel}
                    </span>
                    <span className="text-white hover:text-[#36BFFF] transition-colors font-medium">
                      Evolve / Sell →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};
