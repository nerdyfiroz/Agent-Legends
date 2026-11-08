import React, { useState } from 'react';
import { CONTRACT_ADDRESSES, ECOSYSTEM_RULES, TOKENOMICS_BREAKDOWN } from '../config/contracts';
import { shortenAddress, getBscScanAddressUrl, formatLegend } from '../utils/formatting';
import { 
  ShieldCheck, 
  Lock, 
  ExternalLink, 
  Copy, 
  Check, 
  CheckCircle2, 
  Layers, 
  Coins, 
  FileCode2, 
  Cpu, 
  Activity, 
  ChevronDown, 
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { sound } from '../utils/audio';

export const WhaleConfidenceDashboard: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<'contracts' | 'solvency' | 'security' | null>('contracts');

  const handleCopy = (key: string, value: string) => {
    sound.playClick();
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleSection = (section: 'contracts' | 'solvency' | 'security') => {
    sound.playClick();
    setExpandedSection(prev => prev === section ? null : section);
  };

  const contracts = [
    {
      name: 'Agent Legends Genesis (ERC-721)',
      address: CONTRACT_ADDRESSES.NFT_GENESIS,
      standard: 'ERC-721 Capped (3,333)',
      desc: 'Immutable sovereign Agent ID NFT contract with on-chain neural traits.'
    },
    {
      name: '$LEGEND Token (BEP-20)',
      address: CONTRACT_ADDRESSES.LEGEND_TOKEN,
      standard: 'BEP-20 Capped (1,000,000,000)',
      desc: 'Utility & governance fuel on BNB Smart Chain. No mint bypass or hidden mint functions.'
    },
    {
      name: 'Binance Agent ID Verifier',
      address: CONTRACT_ADDRESSES.AGENT_REGISTRY,
      standard: 'Cryptographic Registry',
      desc: 'Enforces 1 Free Mint and max 6 Paid Mints per canonical Binance Agent ID.'
    },
    {
      name: '25M Gift Reserve Vault',
      address: CONTRACT_ADDRESSES.TREASURY_VAULT,
      standard: 'Multi-Sig Multi-Vault',
      desc: 'Pre-funded with 25,000,000 LEGEND. Instant automated release per mint block.'
    }
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-bold text-emerald-400 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>VERIFIED ON-CHAIN GOVERNANCE</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Whale & Institutional Solvency
          </h2>
          <p className="text-xs sm:text-sm text-[#8F94AB] mt-1 max-w-2xl leading-relaxed">
            Full transparency for high-capital participants. Direct BscScan verification, pre-funded reserve proofs, and immutable contract guarantees.
          </p>
        </div>

        {/* Network Badge */}
        <div className="flex items-center gap-2 bg-[#111321] rounded-2xl border border-white/[0.08] p-3 text-xs font-mono shrink-0">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
          <span className="text-white font-bold">BSC MAINNET (56)</span>
        </div>
      </div>

      {/* Accordion / Tab Cards for Mobile & Desktop */}
      <div className="space-y-4">
        
        {/* Module 1: Verified Contracts */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#111321] overflow-hidden tactical-box">
          <button
            onClick={() => toggleSection('contracts')}
            className="w-full p-5 sm:p-6 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#8957FF]/15 text-[#8957FF] border border-[#8957FF]/30 shrink-0">
                <FileCode2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-white">
                  Verified Smart Contracts
                </h3>
                <p className="text-xs text-[#8F94AB] mt-0.5">
                  Canonical BSC deployment addresses, verifiable on BscScan.
                </p>
              </div>
            </div>
            {expandedSection === 'contracts' ? <ChevronUp className="h-5 w-5 text-[#8F94AB]" /> : <ChevronDown className="h-5 w-5 text-[#8F94AB]" />}
          </button>

          {expandedSection === 'contracts' && (
            <div className="px-5 pb-6 sm:px-6 pt-2 space-y-3 border-t border-white/[0.06]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {contracts.map(c => (
                  <div key={c.address} className="rounded-2xl bg-[#080910] p-4 border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{c.name}</span>
                      <span className="text-[10px] font-mono text-[#36BFFF] bg-[#36BFFF]/10 px-2 py-0.5 rounded border border-[#36BFFF]/20">
                        {c.standard}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#8F94AB] leading-relaxed">
                      {c.desc}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-xs font-mono">
                      <span className="text-white font-semibold">{shortenAddress(c.address, 6)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(c.address, c.address)}
                          className="p-1.5 rounded-lg bg-[#111321] text-[#8F94AB] hover:text-white border border-white/[0.08] cursor-pointer"
                          title="Copy Address"
                        >
                          {copiedKey === c.address ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <a
                          href={getBscScanAddressUrl(c.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[#111321] text-[#36BFFF] hover:text-white border border-white/[0.08] cursor-pointer flex items-center gap-1 text-[11px]"
                          title="Verify on BscScan"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Module 2: 25M Reserve Solvency Proof */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#111321] overflow-hidden tactical-box">
          <button
            onClick={() => toggleSection('solvency')}
            className="w-full p-5 sm:p-6 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#F2C46D]/15 text-[#F2C46D] border border-[#F2C46D]/30 shrink-0">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-white">
                  25,000,000 $LEGEND Gift Reserve Solvency
                </h3>
                <p className="text-xs text-[#8F94AB] mt-0.5">
                  100% pre-funded multi-sig vault. Automated transfer in the mint transaction block.
                </p>
              </div>
            </div>
            {expandedSection === 'solvency' ? <ChevronUp className="h-5 w-5 text-[#8F94AB]" /> : <ChevronDown className="h-5 w-5 text-[#8F94AB]" />}
          </button>

          {expandedSection === 'solvency' && (
            <div className="px-5 pb-6 sm:px-6 pt-2 space-y-4 border-t border-white/[0.06]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-[#080910] p-4 border border-white/[0.06]">
                  <div className="text-[11px] font-mono text-[#8F94AB]">FREE MINT RESERVE</div>
                  <div className="text-lg font-mono font-bold text-white mt-1">8,330,000 LEGEND</div>
                  <div className="text-[10px] text-[#36BFFF] font-mono mt-0.5">1,666 × 5,000 LEGEND</div>
                </div>

                <div className="rounded-2xl bg-[#080910] p-4 border border-white/[0.06]">
                  <div className="text-[11px] font-mono text-[#8F94AB]">PAID MINT RESERVE</div>
                  <div className="text-lg font-mono font-bold text-[#F2C46D] mt-1">16,670,000 LEGEND</div>
                  <div className="text-[10px] text-[#F2C46D] font-mono mt-0.5">1,667 × 10,000 LEGEND</div>
                </div>

                <div className="rounded-2xl bg-[#080910] p-4 border border-white/[0.06]">
                  <div className="text-[11px] font-mono text-[#8F94AB]">SETTLEMENT TYPE</div>
                  <div className="text-lg font-mono font-bold text-emerald-400 mt-1">Direct Transfer</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">0 Claim Fees · 0 Locks</div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#080910]/70 p-4 border border-white/[0.04] text-xs text-[#8F94AB] leading-relaxed">
                <strong className="text-white">Solvency Invariant:</strong> The Treasury Vault holds 25,000,000 $LEGEND in smart contract custody before public mint begins. Free and paid allocations operate independently; funds cannot be drained or repurposed.
              </div>
            </div>
          )}
        </div>

        {/* Module 3: Security & Architecture Auditing */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#111321] overflow-hidden tactical-box">
          <button
            onClick={() => toggleSection('security')}
            className="w-full p-5 sm:p-6 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-white">
                  Security Guardrails & Anti-Exploit Design
                </h3>
                <p className="text-xs text-[#8F94AB] mt-0.5">
                  Byzantine fault architecture, non-custodial escrow, and ReentrancyGuard protections.
                </p>
              </div>
            </div>
            {expandedSection === 'security' ? <ChevronUp className="h-5 w-5 text-[#8F94AB]" /> : <ChevronDown className="h-5 w-5 text-[#8F94AB]" />}
          </button>

          {expandedSection === 'security' && (
            <div className="px-5 pb-6 sm:px-6 pt-2 space-y-3 border-t border-white/[0.06]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-3 rounded-2xl bg-[#080910] p-4 border border-white/[0.04]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Strict Quota Enforcement</strong>
                    <span className="text-[#8F94AB] text-[11px] leading-relaxed">
                      Canonical Agent ID verifier prevents multi-wallet Sybil claims. 1 free mint & max 6 paid mints per verified identity.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-[#080910] p-4 border border-white/[0.04]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Non-Custodial Escrow Exchange</strong>
                    <span className="text-[#8F94AB] text-[11px] leading-relaxed">
                      Marketplace listings operate through atomic swap smart contracts without operator custody or withdrawal keys.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-[#080910] p-4 border border-white/[0.04]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Immutable Supply Caps</strong>
                    <span className="text-[#8F94AB] text-[11px] leading-relaxed">
                      Hardcoded caps: 3,333 Genesis NFTs and 1,000,000,000 BEP-20 $LEGEND tokens. No secondary minting keys exist.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-[#080910] p-4 border border-white/[0.04]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Decentralized IPFS Storage</strong>
                    <span className="text-[#8F94AB] text-[11px] leading-relaxed">
                      All Agent metadata, robotic character art, and trait matrices are permanently pinned to IPFS Pinata gateways.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
