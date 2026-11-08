import React, { useState } from 'react';
import { Cpu, Zap, Network, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { sound } from '../utils/audio';

export const RoadmapSection: React.FC = () => {
  const [activePhaseIdx, setActivePhaseIdx] = useState<number>(0);

  const phases = [
    {
      phase: 'Phase 01',
      title: 'Genesis Mint & 25M Reserve Activation',
      tag: 'CURRENT PHASE',
      statusColor: 'text-[#F2C46D] border-[#F2C46D]/40 bg-[#F2C46D]/10',
      icon: <Cpu className="h-5 w-5 text-[#F2C46D]" />,
      summary: 'Deployment of Genesis smart contracts, Binance Agent ID verification, and instant 25M LEGEND reserve distribution.',
      deliverables: [
        'ERC-721 Genesis NFT contract deployment on BSC Mainnet (3,333 supply capped)',
        'Canonical Binance Agent ID on-chain verification engine',
        'Direct automated distribution of 25M LEGEND Gift Reserve upon minting',
        'PancakeSwap v3 liquidity pool initialization & BEP-20 verification',
        'Decentralized IPFS metadata & immutable character attribute pinning',
      ],
    },
    {
      phase: 'Phase 02',
      title: 'Agent Evolution & Neural Upgrades',
      tag: 'Q3 2026',
      statusColor: 'text-[#8957FF] border-[#8957FF]/40 bg-[#8957FF]/10',
      icon: <Zap className="h-5 w-5 text-[#8957FF]" />,
      summary: 'Launch of the Agent Evolution engine, burn mechanics for neural upgrades, and non-custodial marketplace escrow.',
      deliverables: [
        'On-chain Agent Evolution mechanism using $LEGEND burn mechanics',
        'Decentralized Marketplace and non-custodial escrow smart contracts',
        'Autonomous agent training playground & neural model weight checkpoints',
        'Holder staking protocol with dynamic multiplier based on Evolution Tier',
        'First batch of autonomous agent developer grants and hackathons',
      ],
    },
    {
      phase: 'Phase 03',
      title: 'Autonomous Agent Economy & Swarms',
      tag: 'Q4 2026 - 2027',
      statusColor: 'text-[#36BFFF] border-[#36BFFF]/40 bg-[#36BFFF]/10',
      icon: <Network className="h-5 w-5 text-[#36BFFF]" />,
      summary: 'Swarm coordination protocol, autonomous agent task settlement in $LEGEND, and DAO governance transition.',
      deliverables: [
        'Agent-to-Agent autonomous task escrow and settlement in $LEGEND',
        'Multi-agent collaborative swarms executing complex on-chain DeFi tasks',
        'Cross-chain interoperability with BNB Greenfield for decentralized AI state',
        'DAO governance takeover for ecosystem treasury management',
        'React Native mobile companion app for hardware-secured Agent ID management',
      ],
    },
  ];

  return (
    <section className="relative py-20 border-t border-white/[0.06] bg-[#080910]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <div className="text-xs font-mono font-semibold text-[#8957FF] uppercase tracking-wider">
            Protocol Evolution
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Agent Legends Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-[#8F94AB] leading-relaxed">
            From initial sovereign Genesis minting to a fully autonomous on-chain AI agent economy.
          </p>
        </div>

        {/* Phase Selector & Connector Circuit */}
        <div className="relative mb-12">
          {/* Glowing connector track */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-gradient-to-r from-[#F2C46D] via-[#8957FF] to-[#36BFFF] opacity-30"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {phases.map((item, idx) => {
              const isSelected = activePhaseIdx === idx;
              return (
                <div
                  key={item.phase}
                  onClick={() => {
                    sound.playClick();
                    setActivePhaseIdx(idx);
                  }}
                  className={`glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 relative ${
                    isSelected
                      ? 'border-[#8957FF] bg-[#171A2B] shadow-xl shadow-[#8957FF]/20 -translate-y-1'
                      : 'hover:border-white/[0.15]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#8F94AB]">{item.phase}</span>
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-mono font-semibold ${item.statusColor}`}>
                      {item.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-[#080910] border border-white/[0.06] shrink-0">
                      {item.icon}
                    </div>
                    <h3 className="font-display text-base font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#8F94AB] line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deep Dive into Active Phase Deliverables */}
        <div className="glass-panel rounded-3xl p-7 lg:p-8 border border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.06]">
            <div>
              <div className="text-xs font-mono font-bold text-[#8957FF]">
                {phases[activePhaseIdx].phase} MILESTONES
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
                {phases[activePhaseIdx].title}
              </h3>
            </div>
            <span className={`self-start sm:self-auto rounded-lg border px-3 py-1 text-xs font-mono font-bold ${phases[activePhaseIdx].statusColor}`}>
              {phases[activePhaseIdx].tag}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {phases[activePhaseIdx].deliverables.map((item, dIdx) => (
              <div
                key={dIdx}
                className="flex items-start gap-3 rounded-xl bg-[#080910]/60 p-4 border border-white/[0.04]"
              >
                <CheckCircle2 className="h-4 w-4 text-[#36BFFF] shrink-0 mt-0.5" />
                <span className="text-xs text-[#8F94AB] leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
