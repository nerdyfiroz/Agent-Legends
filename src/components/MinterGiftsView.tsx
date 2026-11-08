import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ECOSYSTEM_RULES, CONTRACT_ADDRESSES } from '../config/contracts';
import { formatLegend, formatBnb, shortenAddress, getBscScanAddressUrl } from '../utils/formatting';
import { Gift, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Zap, ExternalLink, Flame } from 'lucide-react';
import { sound } from '../utils/audio';

interface MinterGiftsViewProps {
  onGoToMint: () => void;
}

export const MinterGiftsView: React.FC<MinterGiftsViewProps> = ({ onGoToMint }) => {
  const {
    isConnected,
    userMintStatus,
    freeGiftDistributed,
    paidGiftDistributed,
    totalGiftDistributed,
  } = useWeb3();

  const remainingFreeReserve = ECOSYSTEM_RULES.FREE_MINT_GIFT_RESERVE - freeGiftDistributed;
  const remainingPaidReserve = ECOSYSTEM_RULES.PAID_MINT_GIFT_RESERVE - paidGiftDistributed;
  const remainingTotalReserve = ECOSYSTEM_RULES.TOTAL_GIFT_RESERVE_LEGEND - totalGiftDistributed;

  return (
    <div className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div>
        <div className="text-xs font-mono font-semibold text-[#8957FF] uppercase tracking-wider">
          Instant On-Chain Minter Rewards & Perks
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-1">
          25,000,000 $LEGEND Gift Reserve
        </h1>
        <p className="text-xs sm:text-sm text-[#8F94AB] mt-1.5 max-w-2xl leading-relaxed">
          Pre-funded in the Treasury Vault to directly reward verified Agent ID minters with instant token grants on BNB Smart Chain. No separate claims, vesting cliffs, or locking periods.
        </p>
      </div>

      {/* Primary 3 Reserve KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Gift Reserve */}
        <div className="glass-panel-elevated rounded-3xl p-7 space-y-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-[#8F94AB]">
            <span className="font-mono font-bold text-[#8957FF]">TOTAL GIFT RESERVE</span>
            <Gift className="h-4 w-4 text-[#F2C46D]" />
          </div>
          <div>
            <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
              25,000,000
            </div>
            <div className="text-xs text-[#8F94AB] mt-1">$LEGEND Allocated from Community Pool</div>
          </div>
          <div className="pt-4 border-t border-white/[0.06] space-y-2 text-xs">
            <div className="flex justify-between text-[#8F94AB]">
              <span>Distributed to Date:</span>
              <span className="font-mono text-white font-bold tabular-nums">{formatLegend(totalGiftDistributed)}</span>
            </div>
            <div className="flex justify-between text-[#8F94AB]">
              <span>Remaining in Vault:</span>
              <span className="font-mono text-[#F2C46D] font-bold tabular-nums">{formatLegend(remainingTotalReserve)}</span>
            </div>
          </div>
        </div>

        {/* Free Mint Reserve */}
        <div className="glass-card rounded-3xl p-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#8F94AB]">
            <span className="font-mono font-bold text-[#36BFFF]">FREE MINT RESERVE</span>
            <span className="font-mono text-[11px] text-white">5,000 / NFT</span>
          </div>
          <div>
            <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
              8,330,000
            </div>
            <div className="text-xs text-[#8F94AB] mt-1">For 1,666 Free Canonical Mints</div>
          </div>
          <div className="pt-4 border-t border-white/[0.06] space-y-2 text-xs">
            <div className="flex justify-between text-[#8F94AB]">
              <span>Distributed:</span>
              <span className="font-mono text-white font-bold tabular-nums">{formatLegend(freeGiftDistributed)}</span>
            </div>
            <div className="flex justify-between text-[#8F94AB]">
              <span>Remaining:</span>
              <span className="font-mono text-[#36BFFF] font-bold tabular-nums">{formatLegend(remainingFreeReserve)}</span>
            </div>
          </div>
        </div>

        {/* Paid Mint Reserve */}
        <div className="glass-card rounded-3xl p-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#8F94AB]">
            <span className="font-mono font-bold text-[#F2C46D]">PAID MINT RESERVE</span>
            <span className="font-mono text-[11px] text-white">10,000 / NFT</span>
          </div>
          <div>
            <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
              16,670,000
            </div>
            <div className="text-xs text-[#8F94AB] mt-1">For 1,667 Paid Mints (0.001 BNB)</div>
          </div>
          <div className="pt-4 border-t border-white/[0.06] space-y-2 text-xs">
            <div className="flex justify-between text-[#8F94AB]">
              <span>Distributed:</span>
              <span className="font-mono text-white font-bold tabular-nums">{formatLegend(paidGiftDistributed)}</span>
            </div>
            <div className="flex justify-between text-[#8F94AB]">
              <span>Remaining:</span>
              <span className="font-mono text-[#F2C46D] font-bold tabular-nums">{formatLegend(remainingPaidReserve)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Connected Status Card */}
      <div className="glass-panel rounded-3xl p-7 sm:p-9 border border-white/[0.08]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                YOUR INSTANT GIFT BALANCE
              </span>
              <span className="text-xs text-[#8F94AB]">
                {isConnected ? 'Wallet Connected' : 'Connect Wallet to View'}
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Instant Gifts Received:{' '}
              <span className="text-[#F2C46D] tabular-nums">
                +{formatLegend(userMintStatus.legendGiftsReceived)} $LEGEND
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-[#8F94AB] leading-relaxed">
              Every time you execute a Free or Paid mint, the Genesis Mint contract automatically transfers your $LEGEND tokens to your address during the same block transaction.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              onClick={() => {
                sound.playClick();
                onGoToMint();
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#8957FF] to-[#36BFFF] px-7 py-3.5 text-xs font-bold text-white shadow-xl shadow-[#8957FF]/25 hover:opacity-95 transition-all cursor-pointer"
            >
              <span>Go to Genesis Mint</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* How the Instant Gift Architecture Works */}
      <div className="glass-panel rounded-3xl p-7 sm:p-9 space-y-6 border border-white/[0.06]">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
          Architectural Transparency: Why Instant Gifts?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#8F94AB] leading-relaxed">
          <div className="rounded-2xl border border-white/[0.04] bg-[#080910] p-6 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Zero Claim Gas Costs</span>
            </div>
            <p>
              Traditional minter reward pools force users to pay separate gas fees months later to claim rewards. In Agent Legends, your tokens are pushed to your wallet in the mint transaction itself.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.04] bg-[#080910] p-6 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4 text-[#36BFFF]" />
              <span>Instant Evolution Utility</span>
            </div>
            <p>
              With $LEGEND immediately in your wallet, you can immediately begin evolving your agent, training neural models, and upgrading power attributes without waiting for reward pool unlock cycles.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.04] bg-[#080910] p-6 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4 text-[#F2C46D]" />
              <span>Immutable Reserve Vault</span>
            </div>
            <p>
              The 25,000,000 LEGEND tokens are pre-locked in the Treasury Vault (0x5391...3075) with sole transfer authority delegated to the Genesis Mint Contract, guaranteeing 100% solvency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
