import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ECOSYSTEM_RULES, CONTRACT_ADDRESSES } from '../config/contracts';
import { formatLegend, formatBnb, shortenAddress, getBscScanAddressUrl } from '../utils/formatting';
import { Sparkles, Users, Layers, Gift, ShieldAlert, Cpu, ExternalLink } from 'lucide-react';

export const CollectionStats: React.FC = () => {
  const {
    totalMinted,
    freeMinted,
    paidMinted,
    uniqueHolders,
    freeGiftDistributed,
    paidGiftDistributed,
    totalGiftDistributed,
    chainId,
  } = useWeb3();

  return (
    <section className="relative py-16 border-y border-white/[0.06] bg-[#0A0C16]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-mono font-semibold text-[#8957FF] uppercase tracking-wider">
              On-Chain Verified Telemetry
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Genesis Collection Statistics
            </h2>
            <p className="text-xs sm:text-sm text-[#8F94AB] mt-1 max-w-xl">
              Real-time on-chain metrics verified through BNB Smart Chain RPC node feeds.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8F94AB] font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"></span>
            <span>Synchronized with BSC Consensus</span>
          </div>
        </div>

        {/* 4 Primary Luxury Metric Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Supply */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs text-[#8F94AB]">
              <span className="font-medium">Maximum Supply</span>
              <div className="p-2 rounded-xl bg-[#8957FF]/10 text-[#8957FF] border border-[#8957FF]/20">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
              {ECOSYSTEM_RULES.TOTAL_NFT_SUPPLY.toLocaleString()}
            </div>
            <div className="mt-4 text-xs text-[#8F94AB] flex items-center justify-between border-t border-white/[0.06] pt-3">
              <span>Standard: ERC-721</span>
              <span className="text-[#36BFFF] font-mono font-semibold">100% Capped</span>
            </div>
          </div>

          {/* Minted NFTs */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs text-[#8F94AB]">
              <span className="font-medium">Minted to Date</span>
              <div className="p-2 rounded-xl bg-[#36BFFF]/10 text-[#36BFFF] border border-[#36BFFF]/20">
                <Cpu className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
              {totalMinted.toLocaleString()}
            </div>
            <div className="mt-4 text-xs text-[#8F94AB] flex items-center justify-between border-t border-white/[0.06] pt-3">
              <span className="tabular-nums">Free: {freeMinted} / 1,666</span>
              <span className="tabular-nums">Paid: {paidMinted} / 1,667</span>
            </div>
          </div>

          {/* Unique Agent Holders */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs text-[#8F94AB]">
              <span className="font-medium">Unique Agent Holders</span>
              <div className="p-2 rounded-xl bg-[#F2C46D]/10 text-[#F2C46D] border border-[#F2C46D]/20">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
              {uniqueHolders.toLocaleString()}
            </div>
            <div className="mt-4 text-xs text-[#8F94AB] flex items-center justify-between border-t border-white/[0.06] pt-3">
              <span>Binance Agent IDs</span>
              <span className="text-emerald-400 font-mono font-semibold">100% Verified</span>
            </div>
          </div>

          {/* 25M Gift Reserve */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group border-[#8957FF]/30 hover:border-[#8957FF]/60 shadow-lg shadow-[#8957FF]/10">
            <div className="flex items-center justify-between text-xs text-[#8F94AB]">
              <span className="font-medium text-[#F2C46D]">25M Gift Reserve</span>
              <div className="p-2 rounded-xl bg-[#F2C46D]/10 text-[#F2C46D] border border-[#F2C46D]/20">
                <Gift className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-[#F2C46D] tracking-tight tabular-nums">
              {formatLegend(totalGiftDistributed)}
            </div>
            <div className="mt-4 text-xs text-[#8F94AB] flex items-center justify-between border-t border-white/[0.06] pt-3">
              <span>Distributed Instantly</span>
              <span className="text-white font-mono font-bold">/ 25M LEGEND</span>
            </div>
          </div>
        </div>

        {/* Detailed Gift Reserve Breakdown Strip */}
        <div className="mt-8 glass-panel rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#F2C46D] tracking-wider uppercase">
                  25M LEGEND Gift Reserve Architecture
                </span>
                <span className="text-[#8F94AB]">·</span>
                <span className="text-xs text-[#8F94AB]">Instant On-Chain Transfers</span>
              </div>
              <p className="text-xs sm:text-sm text-[#8F94AB] leading-relaxed">
                The 25,000,000 $LEGEND reserve is pre-funded directly in the Treasury Vault. When you mint, tokens are transferred automatically in the same transaction block—no claim fees, no waiting.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 shrink-0">
              <div className="rounded-xl border border-white/[0.06] bg-[#111321] p-4 text-left">
                <div className="text-[11px] font-medium text-[#8F94AB]">Free Mint Reserve</div>
                <div className="mt-1 font-mono text-base font-bold text-white tabular-nums">8,330,000 LEGEND</div>
                <div className="text-[10px] text-[#36BFFF] font-mono mt-0.5">5,000 LEGEND × 1,666 NFTs</div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#111321] p-4 text-left">
                <div className="text-[11px] font-medium text-[#8F94AB]">Paid Mint Reserve</div>
                <div className="mt-1 font-mono text-base font-bold text-white tabular-nums">16,670,000 LEGEND</div>
                <div className="text-[10px] text-[#F2C46D] font-mono mt-0.5">10,000 LEGEND × 1,667 NFTs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
