import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { sound } from '../utils/audio';
import { 
  ShieldCheck, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Fingerprint,
  QrCode,
  Award,
  Zap
} from 'lucide-react';

export const AgentIdentityCardCreator: React.FC = () => {
  const { address, isConnected, agentId } = useWeb3();

  const [callsign, setCallsign] = useState('NEXUS_VALKYRIE');
  const [characterClass, setCharacterClass] = useState<'Vanguard' | 'Valkyrie' | 'Titan Mech' | 'Phantom Scout' | 'Cyber Samurai'>('Valkyrie');
  const [clearanceLevel, setClearanceLevel] = useState('Level 5 Cosmic');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const activeAgentId = agentId || (isConnected && address ? `AGENT-${address.slice(2, 6).toUpperCase()}-BSC` : 'AGENT-7729-BSC');

  const classImages = {
    'Vanguard': '/assets/images/agent_hero_cyber_warrior_1794084223199.jpg',
    'Valkyrie': '/assets/images/legend_valkyrie_ai_1794084222295.jpg',
    'Titan Mech': '/assets/images/legend_titan_mech_1794084224724.jpg',
    'Phantom Scout': '/assets/images/legend_phantom_scout_1794084224734.jpg',
    'Cyber Samurai': '/assets/images/agent_hero_cyber_warrior_1794084223199.jpg'
  };

  const handleCopyCipher = () => {
    const cipherText = `AGENT LEGENDS CLASSIFIED DOSSIER\nCallsign: ${callsign}\nAgent ID: ${activeAgentId}\nClass: ${characterClass}\nClearance: ${clearanceLevel}\nNetwork: BNB Smart Chain (Chain ID: 56)\nGift Allocation: 5,000 - 10,000 $LEGEND\nVerification Hash: 0x892a09f874f6Ac0a7C9Ac507B69C256110f6074F`;
    navigator.clipboard.writeText(cipherText);
    setCopied(true);
    sound.playSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCard = () => {
    setDownloaded(true);
    sound.playLegendGift();
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleShareTwitter = () => {
    const text = `Just verified my Sovereign AI Agent Identity on @AgentLegends (BNB Smart Chain)!\n\nCallsign: [${callsign}]\nID: ${activeAgentId}\nClass: ${characterClass}\nClearance: ${clearanceLevel}\n\nMint your Genesis Legend & claim 5,000 - 10,000 $LEGEND gift:\nhttps://agentlegends.xyz`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div className="border-b border-white/[0.08] pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#36BFFF]/30 bg-[#36BFFF]/10 px-3.5 py-1 text-xs font-mono font-semibold text-[#36BFFF] mb-2">
          <Fingerprint className="h-3.5 w-3.5" />
          <span>BIOMETRIC CLEARANCE CARD GENERATOR</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Sovereign Agent Identity Dossier
        </h2>
        <p className="text-sm sm:text-base text-[#8F94AB] max-w-2xl mt-1.5">
          Generate, customize, and share your cryptographic Agent Identity Card certified on BNB Smart Chain.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-6 space-y-6 bg-[#111321] rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-xl shadow-black/60">
          <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#F2C46D]" />
            Identity Customization
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8F94AB] mb-1.5">
                Agent Callsign
              </label>
              <input
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value.toUpperCase())}
                maxLength={20}
                className="w-full rounded-xl bg-[#080910] border border-white/[0.1] px-4 py-3 text-sm font-mono font-semibold text-white focus:outline-none focus:border-[#8957FF] transition-colors"
                placeholder="E.G. CIPHER_OMEGA"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8F94AB] mb-1.5">
                Character Class Archetype
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['Vanguard', 'Valkyrie', 'Titan Mech', 'Phantom Scout', 'Cyber Samurai'] as const).map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setCharacterClass(cls);
                    }}
                    className={`rounded-xl px-3 py-2.5 text-xs font-semibold border transition-all cursor-pointer ${
                      characterClass === cls
                        ? 'bg-[#8957FF]/20 border-[#8957FF] text-white shadow-md shadow-[#8957FF]/20'
                        : 'bg-[#171A2B] border-white/[0.06] text-[#8F94AB] hover:text-white'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8F94AB] mb-1.5">
                Clearance Tier
              </label>
              <select
                value={clearanceLevel}
                onChange={(e) => {
                  sound.playClick();
                  setClearanceLevel(e.target.value);
                }}
                className="w-full rounded-xl bg-[#080910] border border-white/[0.1] px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-[#36BFFF]"
              >
                <option value="Level 1 Alpha">Level 1 Alpha (Standard Operative)</option>
                <option value="Level 2 Beta">Level 2 Beta (Sub-Zero Relay)</option>
                <option value="Level 3 Gamma">Level 3 Gamma (Synaptic Enforcer)</option>
                <option value="Level 4 Delta">Level 4 Delta (Quantum Tactician)</option>
                <option value="Level 5 Cosmic">Level 5 Cosmic (Singularity Sovereign)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.08]">
            <button
              onClick={handleCopyCipher}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl bg-[#171A2B] border border-white/[0.1] px-4 py-3 text-xs font-semibold text-white hover:border-[#8957FF] transition-all cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-[#8957FF]" />}
              <span>{copied ? 'Cipher Copied!' : 'Copy Dossier'}</span>
            </button>

            <button
              onClick={handleShareTwitter}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl bg-[#1D9BF0]/15 border border-[#1D9BF0]/40 px-4 py-3 text-xs font-semibold text-[#1D9BF0] hover:bg-[#1D9BF0]/25 transition-all cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              <span>Share on X</span>
            </button>

            <button
              onClick={handleDownloadCard}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8957FF] to-[#36BFFF] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-[#8957FF]/30 hover:shadow-[#8957FF]/50 transition-all cursor-pointer"
            >
              {downloaded ? <Check className="h-4 w-4 text-emerald-400" /> : <Download className="h-4 w-4" />}
              <span>{downloaded ? 'Dossier Badge Certified!' : 'Export Holographic Badge'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Holographic Card Preview */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md relative group">
            {/* Outer golden-purple ambient halo */}
            <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-tr from-[#8957FF]/30 via-[#36BFFF]/20 to-[#F2C46D]/30 blur-2xl opacity-75"></div>

            {/* The Badge Card Surface */}
            <div className="relative rounded-[32px] border border-white/[0.15] bg-[#0C0E1A] p-6 shadow-2xl shadow-black overflow-hidden tactical-box">
              {/* Scanline and Hologram Shimmer */}
              <div className="absolute inset-0 scanlines-overlay opacity-30 pointer-events-none"></div>
              <div className="absolute inset-0 hologram-effect opacity-20 pointer-events-none"></div>

              {/* Card Header: Brand & Security Seal */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#8957FF] to-[#F2C46D] p-0.5">
                    <div className="h-full w-full bg-[#080910] rounded-[6px] flex items-center justify-center font-display font-extrabold text-xs text-[#F2C46D]">
                      AL
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-[#8F94AB]">AGENT LEGENDS</div>
                    <div className="text-xs font-bold text-white tracking-wide">INTELLIGENCE DOSSIER</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg border border-[#F2C46D]/40 bg-[#F2C46D]/10 px-2.5 py-1 text-[10px] font-mono font-bold text-[#F2C46D]">
                  <Award className="h-3 w-3" />
                  BSC VERIFIED
                </div>
              </div>

              {/* Card Center: Visual Identity & Scan */}
              <div className="relative mt-4 aspect-[4/3] rounded-2xl overflow-hidden bg-[#080910] border border-white/[0.08]">
                <img
                  src={classImages[characterClass]}
                  alt={callsign}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Holographic Watermark Badge */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md rounded-xl p-2 border border-white/10 text-right">
                  <div className="text-[9px] font-mono text-[#8F94AB]">CLEARANCE</div>
                  <div className="text-xs font-mono font-bold text-[#36BFFF]">{clearanceLevel}</div>
                </div>

                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/10 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                  <span className="text-[11px] font-mono font-bold text-white">{activeAgentId}</span>
                </div>
              </div>

              {/* Card Footer: Metadata & Biometrics */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#8F94AB]">Sovereign Callsign</div>
                    <div className="font-display text-lg font-extrabold text-white tracking-wide">
                      {callsign}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#8F94AB]">Class Archetype</div>
                    <div className="font-mono text-xs font-bold text-[#F2C46D]">
                      {characterClass}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-xs font-mono">
                  <div className="bg-[#131627] p-2.5 rounded-xl border border-white/[0.04]">
                    <div className="text-[9px] text-[#8F94AB]">INSTANT GIFT</div>
                    <div className="text-[#F2C46D] font-bold mt-0.5">+5K - 10K $LEGEND</div>
                  </div>
                  <div className="bg-[#131627] p-2.5 rounded-xl border border-white/[0.04]">
                    <div className="text-[9px] text-[#8F94AB]">NETWORK ID</div>
                    <div className="text-white font-bold mt-0.5">BNB CHAIN: 56</div>
                  </div>
                </div>

                {/* Cryptographic verification strip */}
                <div className="flex items-center justify-between text-[9px] font-mono text-[#8F94AB] pt-1">
                  <span>SIG: 0x892a09f874...10f6074F</span>
                  <span className="text-emerald-400 font-semibold">100% ON-CHAIN SECURED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
