import React, { useState } from 'react';
import { TOKENOMICS_BREAKDOWN, ECOSYSTEM_RULES, CONTRACT_ADDRESSES } from '../config/contracts';
import { formatLegend, shortenAddress, getBscScanAddressUrl } from '../utils/formatting';
import { Sparkles, Coins, Gift, ShieldCheck, Flame, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface TokenEcosystemSectionProps {
  onLearnMoreClick: () => void;
}

export const TokenEcosystemSection: React.FC<TokenEcosystemSectionProps> = ({
  onLearnMoreClick,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const activeItem = TOKENOMICS_BREAKDOWN[selectedIdx];

  return (
    <section className="relative py-20 border-t border-white/[0.06] bg-[#0A0C16]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="text-xs font-mono font-semibold text-[#F2C46D] uppercase tracking-wider">
              Token Economy & Instant Gift Reserve
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1">
              $LEGEND Token Ecosystem
            </h2>
            <p className="text-xs sm:text-sm text-[#8F94AB] mt-1.5 max-w-2xl leading-relaxed">
              Powering autonomous agent execution, neural evolution upgrades, and on-chain intelligence on BNB Smart Chain. Strictly capped at 1,000,000,000 BEP-20 tokens.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onLearnMoreClick();
            }}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#131627] px-5 py-2.5 text-xs font-semibold text-white hover:border-[#8957FF]/60 hover:bg-[#191D34] transition-all self-start md:self-auto cursor-pointer"
          >
            <span>View Full Tokenomics</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 25M Gift Reserve Spotlight Box */}
        <div className="mb-12 glass-panel-elevated rounded-3xl p-7 lg:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-[#8957FF]/10 blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-lg bg-[#8957FF]/20 border border-[#8957FF]/30 px-3 py-1 text-xs font-bold text-[#8957FF]">
                <Gift className="h-3.5 w-3.5 text-[#F2C46D]" />
                <span>25,000,000 LEGEND Instant Gift Reserve</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                Zero Claims Required — Instant On-Chain Transfers
              </h3>
              <p className="text-xs sm:text-sm text-[#8F94AB] leading-relaxed max-w-2xl">
                Unlike outdated claim pools or vesting cliffs, the 25M Gift Reserve is pre-funded directly inside the Treasury Vault. When your mint transaction confirms, the smart contract immediately dispatches your tokens in the same execution block:
                <strong className="text-white"> 5,000 $LEGEND</strong> for Free Mints and <strong className="text-white">10,000 $LEGEND per NFT</strong> for Paid Mints.
              </p>
            </div>

            <div className="lg:col-span-4 grid grid-cols-2 gap-3.5">
              <div className="rounded-2xl border border-white/[0.06] bg-[#0C0E1A] p-4 text-center">
                <div className="text-[11px] font-medium text-[#8F94AB]">Free Mint Gift</div>
                <div className="mt-1 font-mono text-lg font-bold text-[#36BFFF] tabular-nums">
                  +5,000
                </div>
                <div className="text-[10px] text-[#8F94AB] mt-0.5">$LEGEND / NFT</div>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-[#0C0E1A] p-4 text-center">
                <div className="text-[11px] font-medium text-[#8F94AB]">Paid Mint Gift</div>
                <div className="mt-1 font-mono text-lg font-bold text-[#F2C46D] tabular-nums">
                  +10,000
                </div>
                <div className="text-[10px] text-[#8F94AB] mt-0.5">$LEGEND / NFT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Allocation Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Allocation List (Interactive) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-mono font-semibold text-white uppercase tracking-wider mb-2">
              Allocation Tranches
            </div>
            {TOKENOMICS_BREAKDOWN.map((item, idx) => (
              <div
                key={item.name}
                onClick={() => {
                  sound.playClick();
                  setSelectedIdx(idx);
                }}
                className={`flex items-center justify-between rounded-2xl border p-4.5 cursor-pointer transition-all ${
                  selectedIdx === idx
                    ? 'border-[#8957FF] bg-[#171A2B] shadow-xl shadow-[#8957FF]/15'
                    : 'border-white/[0.06] bg-[#111321] hover:border-white/[0.12] hover:bg-[#141626]'
                }`}
              >
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
                  <div className="text-[10px] text-[#8957FF] font-medium">
                    {selectedIdx === idx ? 'Selected' : 'Inspect'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Details on Selected Allocation */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-7 space-y-5 border border-white/[0.08] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F94AB]">
                  Allocation Audit
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-0.5">
                  {activeItem.name}
                </h3>
              </div>
              <span
                className="font-mono text-2xl font-black tabular-nums"
                style={{ color: activeItem.color }}
              >
                {activeItem.percentage}%
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#8F94AB] leading-relaxed">
              {activeItem.description}
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-[#080910]/70 p-3.5 border border-white/[0.04]">
                <span className="text-[#8F94AB]">Token Pool:</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {activeItem.amount.toLocaleString()} LEGEND
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#080910]/70 p-3.5 border border-white/[0.04]">
                <span className="text-[#8F94AB]">Vesting Mechanism:</span>
                <span className="text-white text-right font-medium max-w-[220px] truncate" title={activeItem.vesting}>
                  {activeItem.vesting}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#080910]/70 p-3.5 border border-white/[0.04]">
                <span className="text-[#8F94AB]">Verified Vault:</span>
                <a
                  href={getBscScanAddressUrl(activeItem.contract)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-mono text-[#36BFFF] hover:underline"
                >
                  <span>{shortenAddress(activeItem.contract, 5)}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
