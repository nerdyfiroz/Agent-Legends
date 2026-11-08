import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { NETWORKS } from '../config/contracts';
import { shortenAddress, formatBnb, formatLegend, getBscScanAddressUrl } from '../utils/formatting';
import { X, Check, ExternalLink, Power, Wallet, ArrowRightLeft } from 'lucide-react';
import { sound } from '../utils/audio';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAgentModal: () => void;
}

const WALLET_PROVIDERS = [
  { name: 'Binance Web3 Wallet', icon: '🟡', desc: 'Native Binance Ecosystem ID support' },
  { name: 'MetaMask', icon: '🦊', desc: 'Popular EVM multi-chain wallet' },
  { name: 'Trust Wallet', icon: '🛡️', desc: 'Official decentralized Web3 wallet' },
  { name: 'WalletConnect', icon: '⚡', desc: 'Connect via QR code or desktop link' },
];

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onOpenAgentModal,
}) => {
  const {
    isConnected,
    address,
    chainId,
    bnbBalance,
    legendBalance,
    agentId,
    walletName,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    userMintStatus,
  } = useWeb3();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-white/[0.1] bg-[#111321] p-5 sm:p-7 shadow-2xl shadow-black/90">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8957FF]/20 text-[#8957FF] border border-[#8957FF]/30">
              <Wallet className="h-4 w-4" />
            </div>
            <h3 className="font-display text-base font-bold text-white">
              {isConnected ? 'Connected Account' : 'Connect BNB Smart Chain Wallet'}
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="touch-target-min flex items-center justify-center rounded-xl p-2 text-[#8F94AB] hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isConnected && address ? (
          <div className="mt-5 space-y-4">
            {/* Wallet info card */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0C0E1A] p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8F94AB] font-medium">{walletName || 'Web3 Wallet'}</span>
                <a
                  href={getBscScanAddressUrl(address, chainId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-[#36BFFF] hover:underline"
                >
                  <span>BscScan</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="font-mono text-base font-bold text-white tracking-wide">
                {shortenAddress(address, 8)}
              </div>

              {/* Verified Agent ID badge */}
              <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06]">
                <span className="text-xs text-[#8F94AB]">Binance Agent ID:</span>
                {agentId ? (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAgentModal();
                    }}
                    className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#36BFFF] hover:underline cursor-pointer"
                  >
                    <span>{agentId}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAgentModal();
                    }}
                    className="text-xs font-semibold text-[#F2C46D] hover:underline cursor-pointer"
                  >
                    Verify ID now
                  </button>
                )}
              </div>
            </div>

            {/* Balances */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/[0.04] bg-[#0C0E1A] p-3.5">
                <div className="text-[11px] text-[#8F94AB] font-medium">BNB Balance</div>
                <div className="mt-1 font-mono text-sm font-bold text-white tabular-nums">
                  {formatBnb(bnbBalance)} BNB
                </div>
              </div>
              <div className="rounded-2xl border border-white/[0.04] bg-[#0C0E1A] p-3.5">
                <div className="text-[11px] text-[#8F94AB] font-medium">LEGEND Balance</div>
                <div className="mt-1 font-mono text-sm font-bold text-[#F2C46D] tabular-nums">
                  {formatLegend(legendBalance)}
                </div>
              </div>
            </div>

            {/* Mint Allocations Tracker */}
            <div className="rounded-2xl border border-white/[0.04] bg-[#0C0E1A] p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8F94AB]">Free Mint Allocation:</span>
                <span className={userMintStatus.hasClaimedFree ? 'text-emerald-400 font-medium' : 'text-white'}>
                  {userMintStatus.hasClaimedFree ? 'Claimed (1/1)' : 'Available (1/1 Free + 5,000 LEGEND)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8F94AB]">Paid Mint Allocation:</span>
                <span className="text-white font-medium tabular-nums">
                  {userMintStatus.paidMintsCount} / 6 Used ({6 - userMintStatus.paidMintsCount} remaining)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/[0.04]">
                <span className="text-[#8F94AB]">Cumulative Gift Received:</span>
                <span className="text-[#F2C46D] font-mono font-bold tabular-nums">
                  +{formatLegend(userMintStatus.legendGiftsReceived)} LEGEND
                </span>
              </div>
            </div>

            {/* Network Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#8F94AB]">Active Network</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[56, 97].map((id) => (
                  <button
                    key={id}
                    onClick={() => switchNetwork(id)}
                    className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all cursor-pointer ${
                      chainId === id
                        ? 'border-[#8957FF] bg-[#8957FF]/15 text-white font-bold'
                        : 'border-white/[0.06] bg-[#0C0E1A] text-[#8F94AB] hover:text-white'
                    }`}
                  >
                    <span>{NETWORKS[id].name.replace('BNB Smart Chain ', '')}</span>
                    {chainId === id && <Check className="h-4 w-4 text-[#8957FF]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Disconnect */}
            <button
              onClick={() => {
                disconnectWallet();
                onClose();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 py-3 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
            >
              <Power className="h-4 w-4" />
              <span>Disconnect Wallet</span>
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <p className="text-xs text-[#8F94AB] leading-relaxed">
              Connect your BNB Smart Chain wallet to verify your Binance Agent ID, mint Genesis NFTs, and receive instant $LEGEND token gifts.
            </p>
            <div className="space-y-2.5 pt-1">
              {WALLET_PROVIDERS.map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => {
                    connectWallet(provider.name);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/[0.06] bg-[#0C0E1A] p-3.5 text-left hover:border-[#8957FF]/60 hover:bg-[#141626] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl">{provider.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-[#36BFFF] transition-colors">
                        {provider.name}
                      </div>
                      <div className="text-[11px] text-[#8F94AB]">{provider.desc}</div>
                    </div>
                  </div>
                  <ArrowRightLeft className="h-4 w-4 text-[#8F94AB] group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
