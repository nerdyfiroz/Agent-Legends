import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ECOSYSTEM_RULES } from '../config/contracts';
import { formatLegend } from '../utils/formatting';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Layers, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeroProps {
  onMintClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onMintClick, onExploreClick }) => {
  const { totalMinted, freeMinted, paidMinted, giftReserveTotal } = useWeb3();

  const progressPercent = Math.min(
    100,
    Math.round((totalMinted / ECOSYSTEM_RULES.TOTAL_NFT_SUPPLY) * 100)
  );

  return (
    <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28 bg-tech-grid">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-tr from-[#8957FF]/15 via-[#36BFFF]/10 to-transparent blur-3xl"></div>
      <div className="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-[#8957FF]/10 blur-3xl"></div>
      <div className="pointer-events-none absolute bottom-0 -left-20 h-80 w-80 rounded-full bg-[#36BFFF]/10 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and Value Proposition */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Live Status Pill Kicker */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-[#111321]/90 px-4 py-1.5 backdrop-blur-xl shadow-lg shadow-black/30">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
              <span className="text-xs font-semibold text-white tracking-wide">
                BNB Smart Chain Genesis Mint Live
              </span>
              <span className="text-white/20">·</span>
              <span className="text-xs font-mono font-bold text-[#F2C46D]">
                25M LEGEND Gift Reserve
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] max-w-2xl">
                Every Agent Has A{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8957FF] via-[#36BFFF] to-[#F2C46D]">
                  Legend.
                </span>
              </h1>
              <p className="max-w-xl text-base sm:text-lg text-[#8F94AB] leading-relaxed">
                The premier AI Agent ID NFT ecosystem on BNB Smart Chain. 3,333 sovereign Genesis Agents equipped with autonomous capability, on-chain neural evolution, and an instant{' '}
                <strong className="text-white font-semibold">5,000 to 10,000 $LEGEND token gift</strong> credited directly to your wallet upon minting.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={() => {
                  sound.playClick();
                  onMintClick();
                }}
                className="group relative overflow-hidden flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#8957FF] via-[#7040FF] to-[#36BFFF] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-[#8957FF]/30 hover:shadow-[#8957FF]/50 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-[#F2C46D] group-hover:rotate-12 transition-transform duration-300" />
                <span>Mint Genesis NFT</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onExploreClick();
                }}
                className="flex items-center gap-2.5 rounded-2xl border border-white/[0.08] bg-[#131627]/80 px-7 py-4 text-sm font-semibold text-white hover:border-[#8957FF]/50 hover:bg-[#191D34] transition-all cursor-pointer shadow-lg shadow-black/20"
              >
                <Layers className="h-4 w-4 text-[#36BFFF]" />
                <span>Explore Collection</span>
              </button>
            </div>

            {/* Live Supply & Reserve Progress Card */}
            <div className="pt-2 max-w-xl">
              <div className="glass-panel rounded-2xl p-5 space-y-3.5 border border-white/[0.06] shadow-xl shadow-black/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8F94AB] flex items-center gap-1.5 font-medium">
                    <Flame className="h-3.5 w-3.5 text-[#F2C46D]" /> Genesis Mint Progress
                  </span>
                  <span className="font-mono text-white font-bold tabular-nums">
                    {totalMinted.toLocaleString()} / {ECOSYSTEM_RULES.TOTAL_NFT_SUPPLY.toLocaleString()} ({progressPercent}%)
                  </span>
                </div>

                {/* Progress bar with glow */}
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#080910]/80 p-0.5 border border-white/[0.04]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8957FF] via-[#36BFFF] to-[#F2C46D] transition-all duration-700 shadow-[0_0_12px_rgba(137,87,255,0.5)]"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#8F94AB] pt-1 border-t border-white/[0.06]">
                  <span className="tabular-nums">Free: <strong className="text-white">{freeMinted}</strong> / 1,666</span>
                  <span className="tabular-nums">Paid: <strong className="text-white">{paidMinted}</strong> / 1,667</span>
                  <span className="text-[#F2C46D] font-semibold flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> 25M Gift Reserve
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero 3D AI Warrior Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative ambient glow aura */}
              <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-tr from-[#8957FF]/30 via-[#36BFFF]/20 to-[#F2C46D]/20 blur-2xl opacity-70"></div>

              {/* Character Card Container */}
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#111321] shadow-2xl shadow-black/80 transition-all duration-500 hover:border-[#8957FF]/50 hover:shadow-[#8957FF]/20">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] overflow-hidden bg-[#080910]">
                  <img
                    src="/src/assets/images/agent_hero_cyber_warrior_1794084223199.jpg"
                    alt="Agent Legends Prime Cyber Warrior"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111321] via-transparent to-transparent opacity-90"></div>

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="rounded-xl border border-[#F2C46D]/40 bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-[#F2C46D] shadow-lg">
                      Mythic Tier
                    </span>
                    <span className="rounded-xl border border-white/15 bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-mono font-semibold text-white">
                      Token #0001
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="rounded-xl border border-[#36BFFF]/40 bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-[#36BFFF] flex items-center gap-1.5 shadow-lg">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified ID
                    </span>
                  </div>
                </div>

                {/* Character Card Footer Data */}
                <div className="p-6 space-y-4 bg-gradient-to-b from-[#111321] to-[#0D0F1B]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-[#36BFFF] font-semibold">
                        Cyber Operative Class
                      </div>
                      <div className="font-display text-xl font-bold text-white mt-0.5">
                        Agent Prime Genesis
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-[#8F94AB]">Instant Mint Gift</div>
                      <div className="font-mono text-sm font-bold text-[#F2C46D] tabular-nums">
                        +10,000 LEGEND
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-white/[0.06] text-center text-xs">
                    <div className="rounded-xl bg-[#171A2B]/80 border border-white/[0.04] p-2.5">
                      <div className="text-[10px] text-[#8F94AB]">Evolution</div>
                      <div className="mt-0.5 font-mono font-bold text-white">Level 4</div>
                    </div>
                    <div className="rounded-xl bg-[#171A2B]/80 border border-white/[0.04] p-2.5">
                      <div className="text-[10px] text-[#8F94AB]">Power Score</div>
                      <div className="mt-0.5 font-mono font-bold text-[#36BFFF] tabular-nums">985 PWR</div>
                    </div>
                    <div className="rounded-xl bg-[#171A2B]/80 border border-white/[0.04] p-2.5">
                      <div className="text-[10px] text-[#8F94AB]">Network</div>
                      <div className="mt-0.5 font-mono font-bold text-[#F2C46D]">BSC 56</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
