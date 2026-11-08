import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { AgentLegendNFT } from '../types';
import { sound } from '../utils/audio';
import { formatLegend } from '../utils/formatting';
import { 
  Zap, 
  Cpu, 
  Shield, 
  Flame, 
  Sparkles, 
  Activity, 
  Lock, 
  CheckCircle2, 
  ArrowUpRight, 
  RotateCw,
  Sliders,
  Terminal,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AbilityNode {
  id: string;
  name: string;
  category: 'Defense' | 'DeFi' | 'Cryptography' | 'Swarm';
  desc: string;
  minLevel: number;
  unlocked: boolean;
  powerBoost: number;
}

export const AgentEvolutionChamber: React.FC = () => {
  const { isConnected, ownedNfts, legendBalance } = useWeb3();

  // Selected agent for evolution (defaults to first in wallet or featured sample)
  const defaultAgent: AgentLegendNFT = ownedNfts.length > 0 ? ownedNfts[0] : {
    tokenId: 1,
    name: 'Agent Prime #0001',
    image: '/assets/images/agent_hero_cyber_warrior_1794084223199.jpg',
    rarity: 'Mythic',
    characterClass: 'Cyber Operative',
    evolutionLevel: 2,
    powerScore: 985,
    rank: 1,
    agentId: 'AGENT-0001-BSC',
    mintTimestamp: 1714000000,
    autonomousQuestsCompleted: 42,
    giftAmount: 10000,
    owner: '0x8849...e27C',
    traits: [
      { trait_type: 'Neural Core', value: 'Quantum Sycamore X' },
      { trait_type: 'Biometric Armor', value: 'Obsidian Plating' },
      { trait_type: 'Clock Rate', value: '4.8 PFLOPS' },
      { trait_type: 'Cipher Clearance', value: 'Level 5 Cosmic' }
    ]
  };

  const [selectedAgent, setSelectedAgent] = useState<AgentLegendNFT>(defaultAgent);
  const [currentLevel, setCurrentLevel] = useState<number>(defaultAgent.evolutionLevel || 2);
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
  const [neuralClock, setNeuralClock] = useState<number>(4.8);
  const [quantumEntropy, setQuantumEntropy] = useState<number>(94);
  const [activeAbility, setActiveAbility] = useState<string>('zk-cloak');

  const abilities: AbilityNode[] = [
    {
      id: 'zk-cloak',
      name: 'Zero-Knowledge Cloak',
      category: 'Cryptography',
      desc: 'Encrypts transaction origins using zk-SNARK relays across BSC validators, neutralizing MEV frontrunning bots.',
      minLevel: 1,
      unlocked: currentLevel >= 1,
      powerBoost: 120
    },
    {
      id: 'quantum-routing',
      name: 'Quantum Hash Routing',
      category: 'DeFi',
      desc: 'Autonomous algorithmic swap execution routing through multi-pool liquidity vaults for zero slippage.',
      minLevel: 2,
      unlocked: currentLevel >= 2,
      powerBoost: 210
    },
    {
      id: 'byzantine-armor',
      name: 'Byzantine Fault Armor',
      category: 'Defense',
      desc: 'Consensus-grade biometric shield rejecting adversarial state transitions and unauthorized contract approvals.',
      minLevel: 2,
      unlocked: currentLevel >= 2,
      powerBoost: 190
    },
    {
      id: 'swarm-interlink',
      name: 'Singularity Swarm Interlink',
      category: 'Swarm',
      desc: 'Inter-agent communication protocol enabling collaborative high-frequency market discovery and shared intelligence.',
      minLevel: 3,
      unlocked: currentLevel >= 3,
      powerBoost: 350
    }
  ];

  // Calculated dynamic Power Rating
  const basePower = 700 + currentLevel * 85;
  const tuningBoost = Math.round((neuralClock * 15) + (quantumEntropy * 1.2));
  const totalPowerScore = basePower + tuningBoost;

  const handleEvolve = () => {
    if (currentLevel >= 3) return;
    sound.playTelemetryPulse();
    setIsUpgrading(true);

    setTimeout(() => {
      setCurrentLevel(prev => Math.min(3, prev + 1));
      setNeuralClock(prev => Number((prev + 1.2).toFixed(1)));
      setIsUpgrading(false);
      sound.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8957FF', '#36BFFF', '#F2C46D']
      });
    }, 1800);
  };

  const upgradeCost = currentLevel === 1 ? 5000 : currentLevel === 2 ? 10000 : 0;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header Dossier Kicker */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8957FF]/30 bg-[#8957FF]/10 px-3.5 py-1 text-xs font-mono font-semibold text-[#8957FF] mb-2">
            <Cpu className="h-3.5 w-3.5" />
            <span>CLASSIFIED PROTOCOL // EVOLUTION CHAMBER v3.4</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Synthetic Neural Evolution
          </h1>
          <p className="text-sm sm:text-base text-[#8F94AB] max-w-2xl mt-1.5">
            Synchronize on-chain neural cores, overclock cryptographic frequencies, and unlock autonomous agent abilities through smart-contract state upgrades.
          </p>
        </div>

        {/* Live Chamber Telemetry */}
        <div className="flex items-center gap-4 bg-[#111321] border border-white/[0.08] rounded-2xl p-4 shrink-0 shadow-lg shadow-black/40">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#8F94AB]">Chamber Status</div>
            <div className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ONLINE // READY
            </div>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#8F94AB]">Gas Cost</div>
            <div className="text-sm font-mono font-bold text-[#F2C46D]">0.0004 BNB</div>
          </div>
        </div>
      </div>

      {/* Main Chamber Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive 3D Hologram Agent Chamber */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative rounded-3xl border border-white/[0.1] bg-[#111321] p-6 shadow-2xl shadow-black/80 overflow-hidden tactical-box">
            {/* Ambient reactor aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-gradient-to-tr from-[#8957FF]/20 via-[#36BFFF]/20 to-transparent blur-3xl pointer-events-none"></div>

            {/* Tactical Frame Header */}
            <div className="flex items-center justify-between text-xs font-mono text-[#8F94AB] pb-4 border-b border-white/[0.06]">
              <span className="flex items-center gap-1.5 text-white">
                <Radio className="h-3.5 w-3.5 text-[#36BFFF] animate-pulse" />
                NEURAL CORE FEED
              </span>
              <span className="text-[#F2C46D]">AGENT ID #{selectedAgent.tokenId.toString().padStart(4, '0')}</span>
            </div>

            {/* Hologram Chamber Viewport */}
            <div className="relative aspect-square rounded-2xl overflow-hidden mt-4 bg-[#080910] border border-white/[0.08]">
              <img 
                src={selectedAgent.image} 
                alt={selectedAgent.name}
                referrerPolicy="no-referrer"
                className={`h-full w-full object-cover transition-all duration-700 ${isUpgrading ? 'scale-110 filter brightness-125 saturate-150' : 'hover:scale-105'}`}
              />
              
              {/* Scanline sweep overlay */}
              <div className="absolute inset-0 scanlines-overlay opacity-40 pointer-events-none"></div>
              
              {/* Rotating holographic reticle */}
              <div className="absolute inset-4 rounded-full border border-[#36BFFF]/20 border-dashed animate-spin [animation-duration:30s] pointer-events-none"></div>

              {/* Status Badges */}
              <div className="absolute top-4 left-4">
                <span className="rounded-xl border border-[#F2C46D]/40 bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-bold text-[#F2C46D]">
                  {selectedAgent.rarity} Tier
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#8F94AB]">EVOLUTION STAGE</div>
                  <div className="font-display text-base font-bold text-white flex items-center gap-1.5">
                    Level {currentLevel} of 3
                    <span className="text-xs font-normal text-[#36BFFF]">
                      {currentLevel === 1 ? '· Sovereign Init' : currentLevel === 2 ? '· Synaptic Overdrive' : '· Singularity'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-[#8F94AB]">POWER INDEX</div>
                  <div className="font-mono text-base font-bold text-[#F2C46D] tabular-nums">
                    {totalPowerScore} PWR
                  </div>
                </div>
              </div>
            </div>

            {/* Stage Progress Pills */}
            <div className="grid grid-cols-3 gap-2.5 mt-5">
              {[1, 2, 3].map(lvl => {
                const isComplete = currentLevel >= lvl;
                const isCurrent = currentLevel === lvl;
                return (
                  <div 
                    key={lvl}
                    className={`rounded-xl p-3 border text-center transition-all ${
                      isCurrent
                        ? 'border-[#8957FF] bg-[#8957FF]/15 text-white shadow-[0_0_15px_rgba(137,87,255,0.2)]'
                        : isComplete
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                        : 'border-white/[0.06] bg-[#171A2B]/40 text-[#8F94AB]'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider">Stage 0{lvl}</div>
                    <div className="text-xs font-bold mt-0.5">
                      {lvl === 1 ? 'Init' : lvl === 2 ? 'Overdrive' : 'Singularity'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Upgrade Action CTA */}
            <div className="mt-6 pt-5 border-t border-white/[0.08]">
              {currentLevel < 3 ? (
                <button
                  onClick={handleEvolve}
                  disabled={isUpgrading}
                  className="w-full relative overflow-hidden flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#8957FF] via-[#7040FF] to-[#36BFFF] py-4 px-6 text-sm font-bold text-white shadow-xl shadow-[#8957FF]/30 hover:shadow-[#8957FF]/50 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isUpgrading ? (
                    <>
                      <RotateCw className="h-4 w-4 animate-spin text-[#F2C46D]" />
                      <span>Synchronizing Neural Core ({tuningBoost} PWR)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-[#F2C46D]" />
                      <span>Initiate Stage 0{currentLevel + 1} Upgrade</span>
                      <span className="text-xs font-mono font-normal opacity-90 text-[#F2C46D]">
                        ({formatLegend(upgradeCost)} $LEGEND)
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/10 py-3.5 px-4 text-center text-xs font-mono font-semibold text-emerald-400 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  MAXIMUM EVOLUTION LEVEL ACHIEVED (SINGULARITY ASCENDANT)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Ability Matrix & Neural Tuning Console */}
        <div className="lg:col-span-7 space-y-6">
          {/* Abilities Matrix */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#111321] p-6 shadow-xl shadow-black/50 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#F2C46D]" />
                  Autonomous Ability Nodes
                </h3>
                <p className="text-xs text-[#8F94AB] mt-0.5">
                  On-chain smart contract capabilities unlocked as neural evolution ascends.
                </p>
              </div>
              <span className="text-xs font-mono text-[#36BFFF] bg-[#36BFFF]/10 border border-[#36BFFF]/20 px-2.5 py-1 rounded-lg">
                {abilities.filter(a => a.unlocked).length} / 4 Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {abilities.map(ability => {
                const isSelected = activeAbility === ability.id;
                return (
                  <div
                    key={ability.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveAbility(ability.id);
                    }}
                    className={`rounded-2xl p-4 border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'border-[#8957FF] bg-[#171A2B] shadow-lg shadow-[#8957FF]/10'
                        : 'border-white/[0.06] bg-[#0E101D] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#36BFFF]">
                        {ability.category}
                      </span>
                      {ability.unlocked ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold">
                          <CheckCircle2 className="h-3 w-3" /> Unlocked
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-[#8F94AB]">
                          <Lock className="h-3 w-3" /> Req. Lvl {ability.minLevel}
                        </span>
                      )}
                    </div>

                    <div className="font-display text-sm font-bold text-white mt-1.5">
                      {ability.name}
                    </div>

                    <p className="text-xs text-[#8F94AB] leading-relaxed mt-1 line-clamp-2">
                      {ability.desc}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#8F94AB]">Power Output</span>
                      <span className="text-[#F2C46D] font-bold">+{ability.powerBoost} PWR</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Neural Clock & Cryptographic Fine-Tuner */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#111321] p-6 shadow-xl shadow-black/50 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-[#36BFFF]" />
                  Neural Relay Frequency Tuner
                </h3>
                <p className="text-xs text-[#8F94AB] mt-0.5">
                  Real-time parameter adjustment for biometric hash validation and compute yield.
                </p>
              </div>
              <Terminal className="h-4 w-4 text-[#8F94AB]" />
            </div>

            <div className="space-y-5">
              {/* Clock Frequency Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8F94AB] font-medium">Clock Frequency (PFLOPS)</span>
                  <span className="font-mono text-white font-bold">{neuralClock} PFLOPS</span>
                </div>
                <input 
                  type="range" 
                  min="2.0" 
                  max="10.0" 
                  step="0.1"
                  value={neuralClock} 
                  onChange={(e) => {
                    setNeuralClock(parseFloat(e.target.value));
                    sound.playClick();
                  }}
                  className="w-full accent-[#8957FF] bg-[#171A2B] h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#8F94AB]">
                  <span>2.0 PFLOPS (Eco)</span>
                  <span>10.0 PFLOPS (Quantum Peak)</span>
                </div>
              </div>

              {/* Quantum Entropy Field Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8F94AB] font-medium">Quantum Entropy Density</span>
                  <span className="font-mono text-white font-bold">{quantumEntropy}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  value={quantumEntropy} 
                  onChange={(e) => {
                    setQuantumEntropy(parseInt(e.target.value));
                    sound.playClick();
                  }}
                  className="w-full accent-[#36BFFF] bg-[#171A2B] h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#8F94AB]">
                  <span>50% (Standard)</span>
                  <span>100% (Byzantine Shielded)</span>
                </div>
              </div>
            </div>

            {/* Performance Telemetry Summary */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.08] text-center">
              <div className="rounded-xl bg-[#0E101D] p-3 border border-white/[0.04]">
                <div className="text-[10px] text-[#8F94AB] font-mono">HASH RATE</div>
                <div className="text-sm font-mono font-bold text-white mt-0.5">
                  {(neuralClock * 142).toFixed(0)} MH/s
                </div>
              </div>
              <div className="rounded-xl bg-[#0E101D] p-3 border border-white/[0.04]">
                <div className="text-[10px] text-[#8F94AB] font-mono">DEFENSE MULTIPLIER</div>
                <div className="text-sm font-mono font-bold text-[#36BFFF] mt-0.5">
                  {(quantumEntropy * 0.042).toFixed(2)}x
                </div>
              </div>
              <div className="rounded-xl bg-[#0E101D] p-3 border border-white/[0.04]">
                <div className="text-[10px] text-[#8F94AB] font-mono">REWARD BOOST</div>
                <div className="text-sm font-mono font-bold text-[#F2C46D] mt-0.5">
                  +{((currentLevel * 10) + (neuralClock * 2)).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
