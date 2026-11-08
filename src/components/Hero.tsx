import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ECOSYSTEM_RULES, CONTRACT_ADDRESSES } from '../config/contracts';
import { formatLegend, formatBnb, shortenAddress } from '../utils/formatting';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  Layers, 
  Zap, 
  Cpu, 
  Radio, 
  Volume2, 
  VolumeX, 
  Fingerprint,
  ChevronRight,
  Terminal,
  Activity
} from 'lucide-react';
import { sound } from '../utils/audio';

interface HeroProps {
  onMintClick: () => void;
  onExploreClick: () => void;
  onEvolutionClick?: () => void;
}

interface HeroAgentPreview {
  id: string;
  name: string;
  callsign: string;
  classType: string;
  rarity: 'Mythic' | 'Legendary' | 'Epic';
  image: string;
  power: number;
  gift: string;
  ability: string;
}

const HERO_AGENTS: HeroAgentPreview[] = [
  {
    id: '0001',
    name: 'Agent Prime Vanguard',
    callsign: 'NEXUS_PRIME_01',
    classType: 'Vanguard Operative',
    rarity: 'Mythic',
    image: '/assets/images/agent_hero_cyber_warrior_1794084223199.jpg',
    power: 985,
    gift: '+10,000 LEGEND',
    ability: 'Quantum Sycamore Core'
  },
  {
    id: '0007',
    name: 'Valkyrie Sovereign',
    callsign: 'VALKYRIE_SYNAPSE',
    classType: 'Neural Interceptor',
    rarity: 'Legendary',
    image: '/assets/images/legend_valkyrie_ai_1794084222295.jpg',
    power: 942,
    gift: '+10,000 LEGEND',
    ability: 'Zero-Knowledge Cloak'
  },
  {
    id: '0042',
    name: 'Titan Juggernaut',
    callsign: 'TITAN_MECH_AEGIS',
    classType: 'Heavy Armor Bastion',
    rarity: 'Epic',
    image: '/assets/images/legend_titan_mech_1794084224724.jpg',
    power: 890,
    gift: '+5,000 LEGEND',
    ability: 'Byzantine Fault Plating'
  },
  {
    id: '0118',
    name: 'Phantom Infiltrator',
    callsign: 'GHOST_SPECTRE',
    classType: 'Silent Recon Scout',
    rarity: 'Legendary',
    image: '/assets/images/legend_phantom_scout_1794084224734.jpg',
    power: 928,
    gift: '+10,000 LEGEND',
    ability: 'Autonomous Hash Route'
  }
];

export const Hero: React.FC<HeroProps> = ({ onMintClick, onExploreClick, onEvolutionClick }) => {
  const { totalMinted, freeMinted, paidMinted, isConnected, agentId } = useWeb3();
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const activeAgent = HERO_AGENTS[activeAgentIndex];

  const progressPercent = Math.min(
    100,
    Math.round((totalMinted / ECOSYSTEM_RULES.TOTAL_NFT_SUPPLY) * 100)
  );

  const toggleAudio = () => {
    sound.enabled = !sound.enabled;
    setAudioEnabled(sound.enabled);
    if (sound.enabled) sound.playClick();
  };

  const handleSelectAgent = (idx: number) => {
    sound.playClick();
    setActiveAgentIndex(idx);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-32 bg-[#080910]">
      {/* Cinematic Deep Space Gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[650px] w-[1100px] rounded-full bg-gradient-to-b from-[#8957FF]/18 via-[#36BFFF]/10 to-transparent blur-3xl"></div>
      <div className="pointer-events-none absolute top-1/4 -right-32 h-[450px] w-[450px] rounded-full bg-[#8957FF]/12 blur-3xl"></div>
      <div className="pointer-events-none absolute bottom-10 -left-32 h-[450px] w-[450px] rounded-full bg-[#36BFFF]/10 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Intelligence HUD Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-white/[0.08] text-xs font-mono text-[#8F94AB]">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
            <span className="text-white font-semibold tracking-wide">
              CIVILIZATION FREQUENCY: <span className="text-[#36BFFF]">56.097 MHz (BNB CHAIN)</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="hidden sm:inline text-[#F2C46D]">
              CONTRACT: {shortenAddress(CONTRACT_ADDRESSES.NFT_GENESIS, 4)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-[11px] text-[#8F94AB]">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span>BLOCK HEIGHT: <strong className="text-white">38,924,250</strong></span>
            </div>

            {/* Sound Synthesizer Mood Toggle */}
            <button
              onClick={toggleAudio}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-[#111321] px-2.5 py-1 text-[11px] text-white hover:border-[#8957FF]/50 transition-colors cursor-pointer"
              title="Toggle Web Audio Telemetry Effects"
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-[#36BFFF]" />
                  <span>AUDIO ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-[#8F94AB]" />
                  <span>AUDIO OFF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hero Main Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Storytelling, Editorial Typography & Core Protocol Value */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Classified Badge Kicker */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#8957FF]/30 bg-[#111321]/90 px-4 py-1.5 backdrop-blur-xl shadow-lg shadow-black/40">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#36BFFF]">
                GENESIS CLEARANCE TERMINAL
              </span>
              <span className="text-white/20">/</span>
              <span className="text-xs font-mono font-bold text-[#F2C46D]">
                25,000,000 $LEGEND GIFT RESERVE
              </span>
            </div>

            {/* Editorial Title */}
            <div className="space-y-4">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05] max-w-2xl">
                The Sovereign Civilization of{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8957FF] via-[#36BFFF] to-[#F2C46D]">
                  AI Agents.
                </span>
              </h1>
              
              <p className="max-w-xl text-base sm:text-lg text-[#8F94AB] leading-relaxed">
                Every Agent Has a Legend. An exclusive on-chain identity architecture of 3,333 sovereign Genesis Agents on BNB Smart Chain. Certified through Binance Agent IDs, armed with modular neural evolution, and pre-funded with{' '}
                <strong className="text-white font-semibold">5,000 to 10,000 $LEGEND instant token gifts</strong> credited directly to your wallet upon minting.
              </p>
            </div>

            {/* Core Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onMintClick();
                }}
                className="group relative overflow-hidden flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#8957FF] via-[#7040FF] to-[#36BFFF] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-[#8957FF]/30 hover:shadow-[#8957FF]/60 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-[#F2C46D] group-hover:rotate-12 transition-transform duration-300" />
                <span>Mint Genesis Legend</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onExploreClick();
                }}
                className="flex items-center gap-2.5 rounded-2xl border border-white/[0.1] bg-[#111321]/90 px-7 py-4 text-sm font-semibold text-white hover:border-[#8957FF]/50 hover:bg-[#171A2B] transition-all cursor-pointer shadow-lg shadow-black/30"
              >
                <Layers className="h-4 w-4 text-[#36BFFF]" />
                <span>Intelligence Archives</span>
              </button>

              {onEvolutionClick && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onEvolutionClick();
                  }}
                  className="hidden sm:flex items-center gap-2 rounded-2xl border border-[#F2C46D]/30 bg-[#F2C46D]/10 px-5 py-4 text-sm font-semibold text-[#F2C46D] hover:bg-[#F2C46D]/20 transition-all cursor-pointer"
                >
                  <Cpu className="h-4 w-4" />
                  <span>Evolution Chamber</span>
                </button>
              )}
            </div>

            {/* Live Verifiable Quota & Gift Reserve HUD */}
            <div className="pt-2 max-w-xl">
              <div className="rounded-3xl border border-white/[0.08] bg-[#111321]/95 p-5 sm:p-6 space-y-4 shadow-xl shadow-black/50 tactical-box">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8F94AB] flex items-center gap-1.5 font-medium">
                    <Flame className="h-3.5 w-3.5 text-[#F2C46D]" />
                    Genesis Supply Index
                  </span>
                  <span className="font-mono text-white font-bold tabular-nums">
                    {totalMinted.toLocaleString()} / {ECOSYSTEM_RULES.TOTAL_NFT_SUPPLY.toLocaleString()} Minted ({progressPercent}%)
                  </span>
                </div>

                {/* Shimmering Progress Bar */}
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#080910] p-0.5 border border-white/[0.04]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8957FF] via-[#36BFFF] to-[#F2C46D] transition-all duration-700 shadow-[0_0_12px_rgba(137,87,255,0.6)]"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-center text-xs">
                  <div className="rounded-xl bg-[#080910]/70 p-2.5 border border-white/[0.04]">
                    <div className="text-[10px] text-[#8F94AB] font-mono">FREE MINT</div>
                    <div className="font-mono font-bold text-white mt-0.5">{freeMinted} / 1,666</div>
                    <div className="text-[9px] text-[#F2C46D] font-mono">+5,000 $LEGEND</div>
                  </div>

                  <div className="rounded-xl bg-[#080910]/70 p-2.5 border border-white/[0.04]">
                    <div className="text-[10px] text-[#8F94AB] font-mono">PAID MINT (0.001 BNB)</div>
                    <div className="font-mono font-bold text-white mt-0.5">{paidMinted} / 1,667</div>
                    <div className="text-[9px] text-[#36BFFF] font-mono">+10,000 $LEGEND</div>
                  </div>

                  <div className="rounded-xl bg-[#080910]/70 p-2.5 border border-white/[0.04]">
                    <div className="text-[10px] text-[#8F94AB] font-mono">TREASURY RESERVE</div>
                    <div className="font-mono font-bold text-[#F2C46D] mt-0.5">25,000,000</div>
                    <div className="text-[9px] text-emerald-400 font-mono">100% PRE-FUNDED</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive 3D Character Hologram Dossier */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Radiant Glow */}
              <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-tr from-[#8957FF]/35 via-[#36BFFF]/20 to-[#F2C46D]/25 blur-2xl opacity-75"></div>

              {/* Main Hologram Container */}
              <div className="relative overflow-hidden rounded-[32px] border border-white/[0.12] bg-[#111321] shadow-2xl shadow-black tactical-box">
                
                {/* Visual Viewport with Artwork */}
                <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] overflow-hidden bg-[#080910]">
                  <img
                    src={activeAgent.image}
                    alt={activeAgent.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  
                  {/* Subtle Scanline Overlay */}
                  <div className="absolute inset-0 scanlines-overlay opacity-30 pointer-events-none"></div>
                  
                  {/* Atmospheric shadow vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111321] via-transparent to-transparent opacity-95"></div>

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="rounded-xl border border-[#F2C46D]/40 bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-bold text-[#F2C46D] shadow-lg">
                      {activeAgent.rarity}
                    </span>
                    <span className="rounded-xl border border-white/20 bg-black/70 backdrop-blur-md px-2.5 py-1 text-xs font-mono font-bold text-white">
                      #{activeAgent.id}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="rounded-xl border border-[#36BFFF]/40 bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-mono font-semibold text-[#36BFFF] flex items-center gap-1.5 shadow-lg">
                      <ShieldCheck className="h-3.5 w-3.5" /> VERIFIED ID
                    </span>
                  </div>

                  {/* Callsign overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[#36BFFF]">
                        {activeAgent.classType}
                      </div>
                      <div className="font-display text-xl sm:text-2xl font-extrabold text-white">
                        {activeAgent.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-[#8F94AB]">INSTANT GIFT</div>
                      <div className="font-mono text-sm font-bold text-[#F2C46D]">
                        {activeAgent.gift}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agent Selector Carousel Pills */}
                <div className="p-5 space-y-4 bg-gradient-to-b from-[#111321] to-[#0D0F1B]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#8F94AB] pb-2 border-b border-white/[0.06]">
                    <span>DISCOVERY MATRIX:</span>
                    <span className="text-white">SELECT DOSSIER (4 OF 3,333)</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {HERO_AGENTS.map((agent, idx) => {
                      const isSelected = activeAgentIndex === idx;
                      return (
                        <button
                          key={agent.id}
                          onClick={() => handleSelectAgent(idx)}
                          className={`rounded-xl p-2 border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#8957FF] bg-[#8957FF]/15 text-white shadow-md shadow-[#8957FF]/20'
                              : 'border-white/[0.06] bg-[#171A2B]/60 text-[#8F94AB] hover:text-white hover:border-white/20'
                          }`}
                        >
                          <div className="text-[9px] font-mono font-bold">#{agent.id}</div>
                          <div className="text-[11px] font-semibold truncate mt-0.5">
                            {agent.rarity}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Character Telemetry Grid */}
                  <div className="grid grid-cols-3 gap-2.5 pt-1 text-center text-xs">
                    <div className="rounded-xl bg-[#171A2B]/90 border border-white/[0.04] p-2.5">
                      <div className="text-[10px] text-[#8F94AB] font-mono">POWER SCORE</div>
                      <div className="mt-0.5 font-mono font-bold text-[#36BFFF]">{activeAgent.power} PWR</div>
                    </div>
                    <div className="rounded-xl bg-[#171A2B]/90 border border-white/[0.04] p-2.5">
                      <div className="text-[10px] text-[#8F94AB] font-mono">CORE ABILITY</div>
                      <div className="mt-0.5 font-mono font-bold text-white truncate text-[11px]">{activeAgent.ability}</div>
                    </div>
                    <div className="rounded-xl bg-[#171A2B]/90 border border-white/[0.04] p-2.5">
                      <div className="text-[10px] text-[#8F94AB] font-mono">NETWORK</div>
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
