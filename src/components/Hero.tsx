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
  const [copiedContract, setCopiedContract] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    if (deltaX < -45) {
      handleSelectAgent((activeAgentIndex + 1) % HERO_AGENTS.length);
    } else if (deltaX > 45) {
      handleSelectAgent((activeAgentIndex - 1 + HERO_AGENTS.length) % HERO_AGENTS.length);
    }
    setTouchStartX(null);
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'Mythic':
        return 'from-[#F2C46D]/40 via-[#8957FF]/20 to-[#36BFFF]/20 shadow-[0_0_50px_rgba(242,196,109,0.3)]';
      case 'Legendary':
        return 'from-[#8957FF]/40 via-[#36BFFF]/25 to-[#75dca8]/20 shadow-[0_0_50px_rgba(137,87,255,0.3)]';
      case 'Epic':
        return 'from-[#36BFFF]/40 via-[#8957FF]/25 to-[#F2C46D]/20 shadow-[0_0_50px_rgba(54,191,255,0.3)]';
      default:
        return 'from-[#75dca8]/40 via-[#36BFFF]/20 to-[#8957FF]/20 shadow-[0_0_50px_rgba(117,220,168,0.3)]';
    }
  };

  const handleCopyContract = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESSES.NFT_GENESIS);
    setCopiedContract(true);
    sound.playClick();
    setTimeout(() => setCopiedContract(false), 2000);
  };

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
    <section className="cinematic-hero relative overflow-hidden pt-6 pb-14 sm:pt-12 sm:pb-24 lg:pt-14 lg:pb-32 min-h-[85vh] flex flex-col justify-center">
      {/* Cinematic Deep Space Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-full max-w-[1000px] rounded-full bg-gradient-to-b from-[#8957FF]/18 via-[#36BFFF]/10 to-transparent blur-3xl"></div>
      <div className="pointer-events-none absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-[#8957FF]/12 blur-3xl"></div>
      <div className="pointer-events-none absolute bottom-10 -left-24 h-72 w-72 rounded-full bg-[#36BFFF]/10 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Top Intelligence HUD Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 sm:pb-8 mb-6 sm:mb-8 border-b border-white/[0.08] text-xs font-mono text-[#8F94AB]">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse shrink-0"></span>
            <span className="text-white font-semibold tracking-wide text-[11px] sm:text-xs">
              BSC 56 <span className="text-[#36BFFF]">ONLINE</span>
            </span>
            <span className="text-white/20">|</span>
            <button
              onClick={handleCopyContract}
              className="text-[#F2C46D] text-[11px] sm:text-xs hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-mono"
              title="Copy Genesis Contract Address"
            >
              <span>{shortenAddress(CONTRACT_ADDRESSES.NFT_GENESIS, 4)}</span>
              {copiedContract ? (
                <span className="text-[10px] text-emerald-400 font-bold ml-1">Copied!</span>
              ) : null}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#8F94AB]">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span>BLOCK: <strong className="text-white">38,924,250</strong></span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className="touch-target-min flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-[#111321] px-3 py-1.5 text-[11px] text-white hover:border-[#8957FF]/50 transition-colors cursor-pointer"
              title="Toggle Web Audio Telemetry Effects"
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-[#36BFFF]" />
                  <span>AUDIO</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-[#8F94AB]" />
                  <span>MUTED</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hero Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Mobile-First Narrative & Actions */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-7 text-left">
            
            {/* Live Kicker */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8957FF]/30 bg-[#111321]/90 px-3.5 py-1.5 backdrop-blur-xl shadow-lg shadow-black/40">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#36BFFF]">
                GENESIS CLEARANCE
              </span>
              <span className="text-white/20">/</span>
              <span className="text-[11px] sm:text-xs font-mono font-bold text-[#F2C46D]">
                25M $LEGEND GIFT RESERVE
              </span>
            </div>

            {/* Editorial Title */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-[-0.05em] text-white leading-[0.98] max-w-2xl">
                The Sovereign Civilization of{' '}
                <span className="text-[#b8f5d0]">
                  AI Agents.
                </span>
              </h1>
              
              <p className="max-w-xl text-sm sm:text-base lg:text-lg text-[#8F94AB] leading-relaxed">
                Every Agent Has a Legend. 3,333 sovereign Genesis Agents on BNB Smart Chain certified by Binance Agent IDs, with an instant{' '}
                <strong className="text-white font-semibold">5,000 to 10,000 $LEGEND token gift</strong> credited directly to your wallet upon minting.
              </p>
            </div>

            {/* Mobile Prominent Actions (48px Touch Targets) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                onClick={() => {
                  sound.playClick();
                  onMintClick();
                }}
                className="mint-button touch-target-min relative overflow-hidden flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-sm font-extrabold active:scale-95 transition-transform cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-[#F2C46D]" />
                <span>Mint Genesis Legend</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onExploreClick();
                }}
                className="explore-button touch-target-min flex items-center justify-center gap-2.5 rounded-2xl border px-7 py-4 text-sm font-semibold text-white active:scale-95 transition-transform cursor-pointer shadow-lg shadow-black/30"
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
                  className="touch-target-min flex items-center justify-center gap-2 rounded-2xl border border-[#F2C46D]/30 bg-[#F2C46D]/10 px-5 py-4 text-sm font-semibold text-[#F2C46D] hover:bg-[#F2C46D]/20 active:scale-95 transition-transform cursor-pointer"
                >
                  <Cpu className="h-4 w-4" />
                  <span>Evolution Chamber</span>
                </button>
              )}
            </div>

            {/* Supply & Reserve Progress Card (Mobile Optimized) */}
            <div className="pt-2 max-w-xl">
              <div className="rounded-3xl border border-white/[0.08] bg-[#111321]/95 p-4 sm:p-5 space-y-3.5 shadow-xl shadow-black/50 tactical-box">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8F94AB] flex items-center gap-1.5 font-medium">
                    <Flame className="h-3.5 w-3.5 text-[#F2C46D]" />
                    Genesis Supply Index
                  </span>
                  <span className="font-mono text-white font-bold tabular-nums">
                    {totalMinted} / {ECOSYSTEM_RULES.TOTAL_NFT_SUPPLY} ({progressPercent}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#080910] p-0.5 border border-white/[0.04]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8957FF] via-[#36BFFF] to-[#F2C46D] transition-all duration-700 shadow-[0_0_12px_rgba(137,87,255,0.6)]"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1 border-t border-white/[0.06] text-center text-xs">
                  <div className="min-w-0 rounded-xl bg-[#080910]/70 p-1.5 sm:p-2 border border-white/[0.04]">
                    <div className="text-[8px] sm:text-[9px] text-[#8F94AB] font-mono truncate">FREE MINT</div>
                    <div className="font-mono font-bold text-white mt-0.5 text-[11px] sm:text-xs truncate">{freeMinted} / 1,666</div>
                    <div className="text-[8px] sm:text-[9px] text-[#F2C46D] font-mono truncate">+5K $LEGEND</div>
                  </div>

                  <div className="min-w-0 rounded-xl bg-[#080910]/70 p-1.5 sm:p-2 border border-white/[0.04]">
                    <div className="text-[8px] sm:text-[9px] text-[#8F94AB] font-mono truncate">PAID (0.001)</div>
                    <div className="font-mono font-bold text-white mt-0.5 text-[11px] sm:text-xs truncate">{paidMinted} / 1,667</div>
                    <div className="text-[8px] sm:text-[9px] text-[#36BFFF] font-mono truncate">+10K $LEGEND</div>
                  </div>

                  <div className="min-w-0 rounded-xl bg-[#080910]/70 p-1.5 sm:p-2 border border-white/[0.04]">
                    <div className="text-[8px] sm:text-[9px] text-[#8F94AB] font-mono truncate">GIFT RESERVE</div>
                    <div className="font-mono font-bold text-[#F2C46D] mt-0.5 text-[11px] sm:text-xs truncate">25,000,000</div>
                    <div className="text-[8px] sm:text-[9px] text-emerald-400 font-mono truncate">PRE-FUNDED</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Cinematic Vertical Agent Artwork (Portrait Aspect Ratio) */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0 overflow-hidden sm:overflow-visible">
            <div className="relative mx-auto w-full max-w-[310px] xs:max-w-[340px] sm:max-w-md lg:max-w-none">
              
              {/* Outer Radiant Glow */}
              <div className={`pointer-events-none absolute -inset-1 sm:-inset-2 rounded-[36px] bg-gradient-to-tr ${getRarityGlow(activeAgent.rarity)} blur-xl sm:blur-2xl opacity-75 sm:opacity-80 transition-all duration-700`}></div>

              {/* Main Hologram Container */}
              <div 
                className="hero-art relative overflow-hidden rounded-[30px] sm:rounded-[32px] border border-[#b8f5d0]/25 bg-[#111321] shadow-2xl shadow-black tactical-box"
              >
                
                {/* Vertical Portrait Viewport with Isolated Touch Swipe Gestures */}
                <div 
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#080910] cursor-grab select-none touch-pan-y"
                >
                  <img
                    src={activeAgent.image}
                    alt={activeAgent.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105 pointer-events-none"
                  />
                  
                  {/* Scanline Overlay */}
                  <div className="absolute inset-0 scanlines-overlay opacity-30 pointer-events-none"></div>
                  
                  {/* Gradient shadow vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111321] via-transparent to-transparent opacity-95"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2">
                    <span className="rounded-xl border border-[#F2C46D]/40 bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-[#F2C46D] shadow-lg">
                      {activeAgent.rarity}
                    </span>
                    <span className="rounded-xl border border-white/20 bg-black/70 backdrop-blur-md px-2 py-1 text-[11px] font-mono font-bold text-white">
                      #{activeAgent.id}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <span className="rounded-xl border border-[#36BFFF]/40 bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-semibold text-[#36BFFF] flex items-center gap-1.5 shadow-lg">
                      <ShieldCheck className="h-3.5 w-3.5" /> VERIFIED
                    </span>
                  </div>

                  {/* Bottom Character Info */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-end justify-between">
                    <div>
                      <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#36BFFF]">
                        {activeAgent.classType}
                      </div>
                      <div className="font-display text-lg sm:text-2xl font-extrabold text-white">
                        {activeAgent.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-mono text-[#8F94AB]">GIFT</div>
                      <div className="font-mono text-xs sm:text-sm font-bold text-[#F2C46D]">
                        {activeAgent.gift}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agent Selector Carousel Pills (Touch Friendly) */}
                <div className="p-4 sm:p-5 space-y-3 bg-gradient-to-b from-[#111321] to-[#0D0F1B]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#8F94AB]">
                    <span>DISCOVERY MATRIX:</span>
                    <span className="text-[#36BFFF] text-[10px] sm:hidden flex items-center gap-1 font-semibold">
                      ← SWIPE ARTWORK →
                    </span>
                    <span className="hidden sm:inline text-white">SELECT (4 OF 3,333)</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {HERO_AGENTS.map((agent, idx) => {
                      const isSelected = activeAgentIndex === idx;
                      return (
                        <button
                          key={agent.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectAgent(idx);
                          }}
                          className={`touch-target-min rounded-xl p-1.5 sm:p-2 border text-center transition-all cursor-pointer active:scale-95 ${
                            isSelected
                              ? 'border-[#8957FF] bg-[#8957FF]/25 text-white shadow-md shadow-[#8957FF]/30 font-bold'
                              : 'border-white/[0.06] bg-[#171A2B]/60 text-[#8F94AB] hover:text-white'
                          }`}
                        >
                          <div className="text-[10px] font-mono font-bold">#{agent.id}</div>
                          <div className="text-[10px] font-semibold truncate">
                            {agent.rarity}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Character Telemetry */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                    <div className="rounded-xl bg-[#171A2B]/90 border border-white/[0.04] p-2">
                      <div className="text-[9px] text-[#8F94AB] font-mono">POWER</div>
                      <div className="mt-0.5 font-mono font-bold text-[#36BFFF] text-xs">{activeAgent.power} PWR</div>
                    </div>
                    <div className="rounded-xl bg-[#171A2B]/90 border border-white/[0.04] p-2">
                      <div className="text-[9px] text-[#8F94AB] font-mono">ABILITY</div>
                      <div className="mt-0.5 font-mono font-bold text-white truncate text-[10px]">{activeAgent.ability}</div>
                    </div>
                    <div className="rounded-xl bg-[#171A2B]/90 border border-white/[0.04] p-2">
                      <div className="text-[9px] text-[#8F94AB] font-mono">NETWORK</div>
                      <div className="mt-0.5 font-mono font-bold text-[#F2C46D] text-xs">BSC 56</div>
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
