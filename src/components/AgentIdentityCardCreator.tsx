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
  Fingerprint,
  QrCode,
  Award,
  Send,
  MessageCircle,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
    const cipherText = `AGENT LEGENDS — MY SOVEREIGN AGENT CARD\nCallsign: ${callsign}\nAgent ID: ${activeAgentId}\nClass: ${characterClass}\nClearance: ${clearanceLevel}\nNetwork: BNB Smart Chain (Chain ID: 56)\nInstant Gift: 5,000 - 10,000 $LEGEND\nVerification Hash: 0x892a09f874f6Ac0a7C9Ac507B69C256110f6074F\nMint your Legend: https://agentlegends.xyz`;
    navigator.clipboard.writeText(cipherText);
    setCopied(true);
    sound.playSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTwitter = () => {
    sound.playClick();
    const text = `Just deployed my Sovereign AI Agent on @AgentLegends (BNB Smart Chain)! 🤖🔥\n\nCallsign: [${callsign}]\nID: ${activeAgentId}\nClass: ${characterClass}\nClearance: ${clearanceLevel}\n\nMint yours & claim 5,000 - 10,000 $LEGEND instant gift:\nhttps://agentlegends.xyz`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareTelegram = () => {
    sound.playClick();
    const url = 'https://agentlegends.xyz';
    const text = `⚡ Verified my Sovereign AI Agent on Agent Legends (BNB Smart Chain)!\n\nCallsign: ${callsign}\nAgent ID: ${activeAgentId}\nClass: ${characterClass}\nClearance: ${clearanceLevel}\n\nGet your Genesis Agent + 5,000 - 10,000 $LEGEND gift now!`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDownloadCard = () => {
    setDownloaded(true);
    sound.playLevelUp();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#F2C46D', '#8957FF', '#36BFFF']
    });
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#36BFFF]/30 bg-[#36BFFF]/10 px-3.5 py-1 text-xs font-mono font-semibold text-[#36BFFF] mb-2">
          <Smartphone className="h-3.5 w-3.5" />
          <span>MY LEGEND CARD GENERATOR // INFLUENCER SOCIAL KIT</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Personalized Agent Identity Card
        </h2>
        <p className="text-sm text-[#8F94AB] max-w-2xl mt-1 leading-relaxed">
          Create, customize, and share your holographic Agent ID card directly to X, Telegram, and mobile stories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Controls (Mobile-First Touch Optimized) */}
        <div className="lg:col-span-6 space-y-5 bg-[#111321] rounded-3xl border border-white/[0.08] p-5 sm:p-7 shadow-xl shadow-black/60">
          <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#F2C46D]" />
            Agent Customization Console
          </h3>

          <div className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8F94AB] mb-1.5">
                Agent Callsign (e.g. VIPER_NEXUS)
              </label>
              <input
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value.toUpperCase())}
                maxLength={18}
                className="w-full rounded-2xl bg-[#080910] border border-white/[0.1] px-4 py-3.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#8957FF] transition-colors"
                placeholder="CALLSIGN"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8F94AB] mb-1.5">
                Character Class
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
                    className={`touch-target-min rounded-xl px-3 py-2.5 text-xs font-semibold border transition-all cursor-pointer ${
                      characterClass === cls
                        ? 'bg-[#8957FF]/25 border-[#8957FF] text-white shadow-md shadow-[#8957FF]/20 font-bold'
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
                className="w-full rounded-2xl bg-[#080910] border border-white/[0.1] px-4 py-3.5 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-[#36BFFF]"
              >
                <option value="Level 1 Alpha">Level 1 Alpha (Standard Operative)</option>
                <option value="Level 2 Beta">Level 2 Beta (Sub-Zero Relay)</option>
                <option value="Level 3 Gamma">Level 3 Gamma (Synaptic Enforcer)</option>
                <option value="Level 4 Delta">Level 4 Delta (Quantum Tactician)</option>
                <option value="Level 5 Cosmic">Level 5 Cosmic (Singularity Sovereign)</option>
              </select>
            </div>
          </div>

            {/* Public Agent Profile Link (Viral Share) */}
            <div className="rounded-2xl bg-[#080910] border border-white/[0.08] p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#8F94AB]">
                <span className="flex items-center gap-1.5 text-[#36BFFF]">
                  <Fingerprint className="h-3.5 w-3.5" />
                  PUBLIC AGENT DOSSIER URL
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">LIVE ON-CHAIN</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://agentlegends.xyz/agent/${encodeURIComponent(callsign.toLowerCase())}`}
                  className="w-full bg-[#111321] text-xs font-mono text-white/90 px-3 py-2 rounded-xl border border-white/[0.06] select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://agentlegends.xyz/agent/${encodeURIComponent(callsign.toLowerCase())}`);
                    setCopied(true);
                    sound.playSuccess();
                    setTimeout(() => setCopied(false), 2500);
                  }}
                  className="touch-target-min px-3.5 py-2 rounded-xl bg-[#8957FF]/20 border border-[#8957FF]/40 text-[#8957FF] hover:bg-[#8957FF]/30 text-xs font-mono font-bold shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* 1-Tap Viral Social Sharing Strip */}
            <div className="space-y-3 pt-3 border-t border-white/[0.08]">
              <div className="text-xs font-mono font-bold text-[#8F94AB] uppercase tracking-wider">
                1-Tap Viral Share
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleShareTwitter}
                  className="touch-target-min flex items-center justify-center gap-2 rounded-2xl bg-[#1D9BF0] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-[#1D9BF0]/25 hover:bg-[#1A8CD8] active:scale-95 transition-all cursor-pointer"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share to X</span>
                </button>

                <button
                  onClick={handleShareTelegram}
                  className="touch-target-min flex items-center justify-center gap-2 rounded-2xl bg-[#2AABEE] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-[#2AABEE]/25 hover:bg-[#229ED9] active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Telegram</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleCopyCipher}
                  className="touch-target-min flex items-center justify-center gap-2 rounded-2xl bg-[#171A2B] border border-white/[0.1] px-4 py-3 text-xs font-semibold text-white hover:border-[#8957FF] active:scale-95 transition-all cursor-pointer"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-[#8957FF]" />}
                  <span>{copied ? 'Copied!' : 'Copy Dossier'}</span>
                </button>

                <button
                  onClick={handleDownloadCard}
                  className="touch-target-min flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#8957FF] to-[#36BFFF] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-[#8957FF]/30 active:scale-95 transition-all cursor-pointer"
                >
                  {downloaded ? <Check className="h-4 w-4 text-emerald-400" /> : <Download className="h-4 w-4" />}
                  <span>{downloaded ? 'Card Saved!' : 'Download Card'}</span>
                </button>
              </div>
            </div>
        </div>

        {/* Right Column: Mobile-Ready Social Card Preview */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-[340px] sm:max-w-[380px] relative group">
            {/* Outer Aura */}
            <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-tr from-[#8957FF]/35 via-[#36BFFF]/20 to-[#F2C46D]/30 blur-2xl opacity-75"></div>

            {/* The Badge Card Surface */}
            <div className="relative rounded-[30px] border border-white/[0.15] bg-[#0C0E1A] p-5 sm:p-6 shadow-2xl shadow-black overflow-hidden tactical-box">
              {/* Scanline and Hologram Shimmer */}
              <div className="absolute inset-0 scanlines-overlay opacity-30 pointer-events-none"></div>
              <div className="absolute inset-0 hologram-effect opacity-20 pointer-events-none"></div>

              {/* Card Header: Brand & Security Seal */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#8957FF] to-[#F2C46D] p-0.5">
                    <div className="h-full w-full bg-[#080910] rounded-[6px] flex items-center justify-center font-display font-extrabold text-[11px] text-[#F2C46D]">
                      AL
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-mono tracking-widest text-[#8F94AB]">AGENT LEGENDS</div>
                    <div className="text-[11px] font-bold text-white tracking-wide">SOVEREIGN AGENT CARD</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg border border-[#F2C46D]/40 bg-[#F2C46D]/10 px-2 py-0.5 text-[9px] font-mono font-bold text-[#F2C46D]">
                  <Award className="h-3 w-3" />
                  BSC 56
                </div>
              </div>

              {/* Card Artwork */}
              <div className="relative mt-3.5 aspect-[4/3] rounded-2xl overflow-hidden bg-[#080910] border border-white/[0.08]">
                <img
                  src={classImages[characterClass]}
                  alt={callsign}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                
                {/* Clearance Tag */}
                <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md rounded-xl px-2.5 py-1 border border-white/10 text-right">
                  <div className="text-[8px] font-mono text-[#8F94AB]">CLEARANCE</div>
                  <div className="text-[10px] font-mono font-bold text-[#36BFFF]">{clearanceLevel}</div>
                </div>

                <div className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-md rounded-xl px-2.5 py-1 border border-white/10 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                  <span className="text-[10px] font-mono font-bold text-white">{activeAgentId}</span>
                </div>
              </div>

              {/* Card Footer: Metadata & QR Stamp */}
              <div className="mt-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-wider text-[#8F94AB]">Callsign</div>
                    <div className="font-display text-base font-extrabold text-white tracking-wide">
                      {callsign}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-mono uppercase tracking-wider text-[#8F94AB]">Archetype</div>
                    <div className="font-mono text-xs font-bold text-[#F2C46D]">
                      {characterClass}
                    </div>
                  </div>
                </div>

                {/* Instant Gift Callout */}
                <div className="flex items-center justify-between rounded-xl bg-[#131627] p-2 border border-white/[0.04] text-[10px] font-mono">
                  <div className="flex items-center gap-1.5 text-[#F2C46D] font-bold">
                    <Sparkles className="h-3 w-3" />
                    <span>INSTANT GIFT:</span>
                  </div>
                  <span className="text-white font-bold">+5,000 - 10,000 $LEGEND</span>
                </div>

                {/* QR Code Graphic & Verification Signature */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[9px] font-mono text-[#8F94AB]">
                  <div className="space-y-0.5">
                    <div>CIPHER: 0x892a...10f6</div>
                    <div className="text-emerald-400 font-bold">100% VERIFIED ON-CHAIN</div>
                  </div>

                  {/* QR Graphic box */}
                  <div className="p-1 rounded bg-white text-black shrink-0">
                    <QrCode className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
