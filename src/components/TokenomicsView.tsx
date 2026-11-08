import React, { useState } from 'react';
import { TOKENOMICS_BREAKDOWN, ECOSYSTEM_RULES, CONTRACT_ADDRESSES } from '../config/contracts';
import { formatLegend, shortenAddress, getBscScanAddressUrl } from '../utils/formatting';
import { ExternalLink, Gift, ShieldCheck, PieChart, Coins, Lock, CheckCircle2, Copy, Check } from 'lucide-react';
import { sound } from '../utils/audio';

export const TokenomicsView: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [copiedContract, setCopiedContract] = useState<boolean>(false);
  const selected = TOKENOMICS_BREAKDOWN[activeIdx];

  const totalTokens = ECOSYSTEM_RULES.TOTAL_LEGEND_SUPPLY;
  const totalReleased = TOKENOMICS_BREAKDOWN.reduce((acc, curr) => acc + curr.released, 0);
  const totalLocked = totalTokens - totalReleased;

  const handleCopy = (address: string) => {
    sound.playClick();
    navigator.clipboard.writeText(address);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 1500);
  };

  return (
    <div className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <div className="text-xs font-mono font-semibold text-[#F2C46D] uppercase tracking-wider">
          Token Architecture & Distribution
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-1">
          $LEGEND Tokenomics
        </h1>
        <p className="text-xs sm:text-sm text-[#8F94AB] mt-1.5 max-w-2xl leading-relaxed">
          The sovereign utility and governance fuel of the Agent Legends ecosystem on BNB Smart Chain. Capped total supply of 1,000,000,000 BEP-20 tokens governed by immutable smart contracts.
        </p>
      </div>

      {/* Top 3 KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card rounded-2xl p-6">
          <div className="text-xs text-[#8F94AB] font-medium">Total Maximum Supply</div>
          <div className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
            1,000,000,000
          </div>
          <div className="mt-3 text-xs text-[#36BFFF] font-mono font-semibold">100% Capped BEP-20</div>
        </div>

        <div className="glass-card rounded-2xl p-6 border-[#8957FF]/30">
          <div className="text-xs text-[#8F94AB] font-medium">25M Instant Gift Reserve</div>
          <div className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#F2C46D] tracking-tight tabular-nums">
            25,000,000
          </div>
          <div className="mt-3 text-xs text-emerald-400 font-mono font-semibold">100% Pre-Funded & Instant</div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="text-xs text-[#8F94AB] font-medium">BEP-20 Contract (BSC)</div>
          <div className="mt-2 font-mono text-base font-bold text-white truncate flex items-center justify-between">
            <span>{shortenAddress(CONTRACT_ADDRESSES.LEGEND_TOKEN, 6)}</span>
            <button
              onClick={() => handleCopy(CONTRACT_ADDRESSES.LEGEND_TOKEN)}
              className="p-1 rounded-lg hover:bg-white/[0.08] text-[#8F94AB] hover:text-white transition-colors cursor-pointer"
              title="Copy Contract Address"
            >
              {copiedContract ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <div className="mt-3 text-xs">
            <a
              href={getBscScanAddressUrl(CONTRACT_ADDRESSES.LEGEND_TOKEN)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#36BFFF] hover:underline flex items-center gap-1 font-mono"
            >
              <span>Verify on BscScan</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 25M Gift Reserve Deep Dive Banner */}
      <div className="glass-panel-elevated rounded-3xl p-7 lg:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-[#8957FF]/20 border border-[#8957FF]/30 px-3 py-1 text-xs font-mono font-bold text-[#8957FF] flex items-center gap-1.5">
              <Gift className="h-3.5 w-3.5 text-[#F2C46D]" />
              <span>25M LEGEND GIFT RESERVE SPECIFICATION</span>
            </span>
          </div>
          <span className="text-xs font-mono text-[#8F94AB]">Allocated from 300M Community Pool</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-[#8F94AB] leading-relaxed">
          <div className="space-y-2 rounded-2xl bg-[#080910]/70 p-5 border border-white/[0.04]">
            <h3 className="font-semibold text-white text-base">
              Free Mint Allocation (8,330,000 LEGEND)
            </h3>
            <p className="text-xs leading-relaxed">
              Pre-funded for the 1,666 canonical Free Mints. Every verified Binance Agent ID claiming a Free NFT instantly receives <strong className="text-white">5,000 $LEGEND</strong> in the same block. Total reserve: 1,666 × 5,000 = 8.33M LEGEND.
            </p>
          </div>
          <div className="space-y-2 rounded-2xl bg-[#080910]/70 p-5 border border-white/[0.04]">
            <h3 className="font-semibold text-white text-base">
              Paid Mint Allocation (16,670,000 LEGEND)
            </h3>
            <p className="text-xs leading-relaxed">
              Pre-funded for the 1,667 Paid Mints (0.001 BNB each). Up to 6 paid NFTs per verified Agent ID. Each paid NFT receives an instant gift of <strong className="text-[#F2C46D]">10,000 $LEGEND</strong>. Total reserve: 1,667 × 10,000 = 16.67M LEGEND.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Allocation Breakdown Cards & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Allocation List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-mono font-semibold text-white uppercase tracking-wider mb-2">
            Token Distribution Breakdown
          </div>
          {TOKENOMICS_BREAKDOWN.map((item, idx) => (
            <div
              key={item.name}
              onClick={() => {
                sound.playClick();
                setActiveIdx(idx);
              }}
              className={`rounded-2xl border p-5 cursor-pointer transition-all ${
                activeIdx === idx
                  ? 'border-[#8957FF] bg-[#171A2B] shadow-xl shadow-[#8957FF]/15 scale-[1.01]'
                  : 'border-white/[0.06] bg-[#111321] hover:bg-[#141626]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <span
                    className="h-3.5 w-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <div>
                    <div className="text-sm font-bold text-white">{item.name}</div>
                    <div className="text-xs text-[#8F94AB] font-mono mt-0.5 tabular-nums">
                      {item.amount.toLocaleString()} LEGEND
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-base font-extrabold text-white tabular-nums">
                    {item.percentage}%
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    {Math.round((item.released / item.amount) * 100)}% Released
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Selected Category In-Depth Auditor */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-7 space-y-5 border border-white/[0.08] shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F94AB]">
                On-Chain Verified Allocation
              </span>
              <h3 className="font-display text-xl font-bold text-white mt-0.5">
                {selected.name}
              </h3>
            </div>
            <span
              className="font-mono text-3xl font-black tabular-nums"
              style={{ color: selected.color }}
            >
              {selected.percentage}%
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#8F94AB] leading-relaxed">{selected.description}</p>

          <div className="space-y-3.5 text-xs">
            <div className="rounded-xl border border-white/[0.04] bg-[#080910] p-3.5 space-y-1">
              <div className="text-[#8F94AB]">Total Allocated Amount:</div>
              <div className="font-mono text-sm font-bold text-white tabular-nums">
                {selected.amount.toLocaleString()} LEGEND
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/[0.04] bg-[#080910] p-3.5">
                <div className="text-[#8F94AB]">Released to Date</div>
                <div className="font-mono text-sm font-bold text-emerald-400 mt-1 tabular-nums">
                  {selected.released.toLocaleString()}
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.04] bg-[#080910] p-3.5">
                <div className="text-[#8F94AB]">Locked in Vault</div>
                <div className="font-mono text-sm font-bold text-[#F2C46D] mt-1 tabular-nums">
                  {selected.locked.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.04] bg-[#080910] p-3.5 space-y-1">
              <div className="text-[#8F94AB]">Vesting Schedule & Governance:</div>
              <div className="text-white font-medium">{selected.vesting}</div>
            </div>

            <div className="rounded-xl border border-white/[0.04] bg-[#080910] p-3.5 flex items-center justify-between">
              <div>
                <div className="text-[#8F94AB]">Holding Vault Contract:</div>
                <div className="font-mono font-semibold text-white">
                  {shortenAddress(selected.contract, 6)}
                </div>
              </div>
              <a
                href={getBscScanAddressUrl(selected.contract)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[#36BFFF] hover:underline"
              >
                <span>BscScan</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
