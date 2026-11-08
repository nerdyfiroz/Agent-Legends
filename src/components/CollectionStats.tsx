import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ECOSYSTEM_RULES, CONTRACT_ADDRESSES } from '../config/contracts';
import { formatLegend, shortenAddress } from '../utils/formatting';
import { Sparkles, Users, Layers, Gift, Cpu, Activity, ShieldCheck } from 'lucide-react';

export const CollectionStats: React.FC = () => {
  const {
    totalMinted,
    freeMinted,
    paidMinted,
    uniqueHolders,
    totalGiftDistributed,
  } = useWeb3();

  return (
    <section className="relative py-10 sm:py-16 border-y section-rule bg-[#0c1915]/90 backdrop-blur-xl overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8957FF]/30 bg-[#8957FF]/10 px-3 py-0.5 text-[11px] font-mono font-bold text-[#8957FF] mb-1.5">
              <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>LIVE TELEMETRY // BSC 56</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ecosystem Dashboard
            </h2>
            <p className="text-sm text-[#8F94AB] mt-0.5">
              Verified metrics from BNB Smart Chain consensus nodes.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#8F94AB] font-mono shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
            <span className="text-white font-semibold">100% Sync with Block #38,924,250</span>
          </div>
        </div>

        {/* Mobile 2x2 Dashboard / Desktop 4-Col Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          
          {/* Card 1: Total Supply */}
          <div className="min-w-0 overflow-hidden premium-panel rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 space-y-2.5 tactical-box">
            <div className="flex items-center justify-between text-xs text-[#8F94AB]">
              <span className="font-semibold text-white/90 text-xs sm:text-sm truncate">Genesis Cap</span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-[#8957FF]/15 text-[#8957FF] shrink-0">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums truncate">
              {ECOSYSTEM_RULES.TOTAL_NFT_SUPPLY.toLocaleString()}
            </div>
            <div className="text-[10px] sm:text-xs text-[#8F94AB] pt-2 border-t border-white/[0.06] flex items-center justify-between font-mono">
              <span>ERC-721</span>
              <span className="text-[#36BFFF] font-bold">100% Capped</span>
            </div>
          </div>

          {/* Card 2: Minted to Date */}
          <div className="min-w-0 overflow-hidden premium-panel rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 space-y-2.5 tactical-box">
            <div className="flex items-center justify-between text-xs text-[#8F94AB]">
              <span className="font-semibold text-white/90 text-xs sm:text-sm truncate">Minted to Date</span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-[#36BFFF]/15 text-[#36BFFF] shrink-0">
                <Cpu className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums truncate">
              {totalMinted.toLocaleString()}
            </div>
            {/* Micro Dual Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="h-1.5 w-full bg-[#080910] rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-400 h-full"
                  style={{ width: `${(freeMinted / ECOSYSTEM_RULES.TOTAL_NFT_SUPPLY) * 100}%` }}
                  title={`Free: ${freeMinted}`}
                />
                <div 
                  className="bg-[#36BFFF] h-full"
                  style={{ width: `${(paidMinted / ECOSYSTEM_RULES.TOTAL_NFT_SUPPLY) * 100}%` }}
                  title={`Paid: ${paidMinted}`}
                />
              </div>
              <div className="text-[9px] sm:text-[10px] text-[#8F94AB] flex items-center justify-between font-mono">
                <span className="truncate">Free: {freeMinted}</span>
                <span className="truncate">Paid: {paidMinted}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Unique Agent Holders */}
          <div className="min-w-0 overflow-hidden premium-panel rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 space-y-2.5 tactical-box">
            <div className="flex items-center justify-between text-xs text-[#8F94AB]">
              <span className="font-semibold text-white/90 text-xs sm:text-sm truncate">Holders</span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-[#F2C46D]/15 text-[#F2C46D] shrink-0">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums truncate">
              {uniqueHolders.toLocaleString()}
            </div>
            <div className="text-[10px] sm:text-xs text-[#8F94AB] pt-2 border-t border-white/[0.06] flex items-center justify-between font-mono">
              <span className="flex items-center gap-1 truncate">
                <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
                Agent IDs
              </span>
              <span className="text-emerald-400 font-bold shrink-0">Verified</span>
            </div>
          </div>

          {/* Card 4: 25M Gift Reserve */}
          <div className="min-w-0 overflow-hidden premium-panel rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 space-y-2.5 tactical-box shadow-lg shadow-[#75dca8]/10">
            <div className="flex items-center justify-between text-xs text-[#8F94AB]">
              <span className="font-semibold text-[#F2C46D] text-xs sm:text-sm truncate">25M Gift Reserve</span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-[#F2C46D]/15 text-[#F2C46D] shrink-0">
                <Gift className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#F2C46D] tracking-tight tabular-nums truncate">
              {formatLegend(totalGiftDistributed)}
            </div>
            <div className="text-[10px] sm:text-xs text-[#8F94AB] pt-2 border-t border-white/[0.06] flex items-center justify-between font-mono">
              <span className="truncate">Distributed</span>
              <span className="text-emerald-400 font-bold shrink-0">100% Pre-Funded</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
