import React from 'react';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import { shortenAddress, getBscScanAddressUrl } from '../utils/formatting';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.06] bg-[#07080E] pt-16 pb-12 text-xs text-[#8F94AB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#8957FF] to-[#36BFFF] p-[1.5px]">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0C0E1A]">
                  <span className="font-display font-extrabold text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#8957FF] to-[#36BFFF]">
                    AL
                  </span>
                </div>
              </div>
              <span className="font-display text-base font-bold text-white tracking-wide">
                AGENT LEGENDS
              </span>
            </div>
            <p className="text-xs text-[#8F94AB] leading-relaxed">
              Every Agent Has A Legend. The premier AI Agent ID NFT ecosystem on BNB Smart Chain with instant 25M $LEGEND token gift reserve.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#8F94AB]">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>BNB Smart Chain Consensus Synced</span>
            </div>
          </div>

          {/* Verified Smart Contracts */}
          <div className="space-y-3 md:col-span-2">
            <div className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
              Verified Smart Contracts (BSC)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 font-mono text-[11px]">
              <div className="rounded-xl border border-white/[0.04] bg-[#0E101D] p-3">
                <div className="text-[10px] text-[#8F94AB] font-sans">Genesis NFT (ERC-721)</div>
                <a
                  href={getBscScanAddressUrl(CONTRACT_ADDRESSES.NFT_GENESIS)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-[#36BFFF] hover:underline mt-1 font-semibold"
                >
                  <span>{shortenAddress(CONTRACT_ADDRESSES.NFT_GENESIS, 6)}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="rounded-xl border border-white/[0.04] bg-[#0E101D] p-3">
                <div className="text-[10px] text-[#8F94AB] font-sans">$LEGEND Token (BEP-20)</div>
                <a
                  href={getBscScanAddressUrl(CONTRACT_ADDRESSES.LEGEND_TOKEN)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-[#F2C46D] hover:underline mt-1 font-semibold"
                >
                  <span>{shortenAddress(CONTRACT_ADDRESSES.LEGEND_TOKEN, 6)}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="rounded-xl border border-white/[0.04] bg-[#0E101D] p-3">
                <div className="text-[10px] text-[#8F94AB] font-sans">Agent ID Registry</div>
                <a
                  href={getBscScanAddressUrl(CONTRACT_ADDRESSES.AGENT_REGISTRY)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-[#8957FF] hover:underline mt-1 font-semibold"
                >
                  <span>{shortenAddress(CONTRACT_ADDRESSES.AGENT_REGISTRY, 6)}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="rounded-xl border border-white/[0.04] bg-[#0E101D] p-3">
                <div className="text-[10px] text-[#8F94AB] font-sans">25M Gift Reserve Vault</div>
                <a
                  href={getBscScanAddressUrl(CONTRACT_ADDRESSES.TREASURY_VAULT)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-emerald-400 hover:underline mt-1 font-semibold"
                >
                  <span>{shortenAddress(CONTRACT_ADDRESSES.TREASURY_VAULT, 6)}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Socials & Documentation */}
          <div className="space-y-3 md:col-span-1">
            <div className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
              Community & Protocol
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Official X (Twitter)</span>
                  <ExternalLink className="h-3 w-3 text-[#8F94AB]" />
                </a>
              </li>
              <li>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Telegram Community Hub</span>
                  <ExternalLink className="h-3 w-3 text-[#8F94AB]" />
                </a>
              </li>
              <li>
                <a
                  href="https://docs.bnbchain.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>BNB Smart Chain Docs</span>
                  <ExternalLink className="h-3 w-3 text-[#8F94AB]" />
                </a>
              </li>
              <li>
                <a
                  href="https://ipfs.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>IPFS Metadata Storage</span>
                  <ExternalLink className="h-3 w-3 text-[#8F94AB]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Risk Disclosures & Disclaimer */}
        <div className="rounded-2xl border border-white/[0.04] bg-[#0A0C16] p-5 text-[11px] leading-relaxed text-[#8F94AB]">
          <strong className="text-white font-semibold">Important Risk Disclosure:</strong> Agent Legends NFTs and $LEGEND utility tokens operate on the decentralized BNB Smart Chain. Digital assets and blockchain transactions involve cryptographic and market risks. Token allocations, instant gifts, and smart contract executions are subject to on-chain finality. Always verify contract addresses on BscScan.
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs pt-4 border-t border-white/[0.04]">
          <div>
            © {new Date().getFullYear()} Agent Legends Protocol. Built on BNB Smart Chain.
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Network: BSC Mainnet (Chain ID 56)</span>
            <span>·</span>
            <span>Metadata: IPFS Pinata</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
