import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { shortenAddress, formatBnb, formatLegend } from '../utils/formatting';
import { ShieldCheck, Wallet, ChevronDown, Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';
import { sound } from '../utils/audio';

export type NavTab =
  | 'home'
  | 'genesis'
  | 'collection'
  | 'evolution'
  | 'tokenomics'
  | 'gifts'
  | 'mylegends'
  | 'marketplace'
  | 'activity'
  | 'admin';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenWalletModal: () => void;
  onOpenAgentModal: () => void;
  mobileMenuOpen?: boolean;
  onMobileMenuToggle?: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenWalletModal,
  onOpenAgentModal,
  mobileMenuOpen: controlledOpen,
  onMobileMenuToggle,
}) => {
  const { isConnected, address, chainId, bnbBalance, legendBalance, agentId } = useWeb3();
  const [internalOpen, setInternalOpen] = useState(false);

  const isMenuOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setMenuOpen = (open: boolean) => {
    if (onMobileMenuToggle) {
      onMobileMenuToggle(open);
    } else {
      setInternalOpen(open);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavClick = (tab: NavTab) => {
    sound.playClick();
    setActiveTab(tab);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: { id: NavTab; label: string; badge?: string; badgeColor?: string }[] = [
    { id: 'home', label: 'Civilization' },
    { id: 'genesis', label: 'Genesis Mint', badge: 'Live', badgeColor: 'text-[#F2C46D] bg-[#F2C46D]/15 border-[#F2C46D]/30' },
    { id: 'collection', label: 'Archives' },
    { id: 'evolution', label: 'Evolution', badge: 'Neural', badgeColor: 'text-[#36BFFF] bg-[#36BFFF]/15 border-[#36BFFF]/30' },
    { id: 'tokenomics', label: 'Tokenomics' },
    { id: 'gifts', label: '25M Gift Reserve', badge: 'Instant', badgeColor: 'text-[#8957FF] bg-[#8957FF]/15 border-[#8957FF]/30' },
    { id: 'marketplace', label: 'Black Market' },
    { id: 'activity', label: 'On-Chain Radar' },
    { id: 'mylegends', label: 'My Agent ID' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#b8f5d0]/10 bg-[#07110e]/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Single Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-3 text-left focus:outline-none cursor-pointer"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#b8f5d0] via-[#75dca8] to-[#e7c889] p-[1.5px] shadow-lg shadow-[#75dca8]/20 transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0C0E1A]">
                <span className="font-display font-extrabold text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#b8f5d0] to-[#75dca8]">
                  AL
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group-hover:text-white/90 transition-colors">
                AGENT LEGENDS
              </span>
              <span className="hidden sm:inline-flex items-center rounded-md border border-[#F2C46D]/30 bg-[#F2C46D]/10 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-[#F2C46D]">
                BSC 56
              </span>
            </div>
          </button>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          <nav className="hidden xl:flex items-center gap-7 text-xs font-medium text-[#8F94AB]">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`group relative flex items-center gap-1.5 py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive ? 'text-white font-semibold' : 'hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`rounded border px-1.5 py-0.2 text-[9px] font-mono font-bold leading-tight ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {/* Active indicator underline */}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-[#8957FF] to-[#36BFFF]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action (Wallet & Network Status) */}
          <div className="flex items-center gap-3 shrink-0">
            {isConnected && (
              <button
                type="button"
                onClick={onOpenAgentModal}
                className="hidden lg:flex items-center gap-1.5 rounded-xl border border-[#36BFFF]/25 bg-[#36BFFF]/10 px-3 py-2 text-xs font-medium text-[#36BFFF] hover:border-[#36BFFF]/50 hover:bg-[#36BFFF]/15 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                title="Verified Binance Agent ID"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="font-mono text-[11px]">{agentId || 'Verify Agent ID'}</span>
              </button>
            )}

            {isConnected && address ? (
              <button
                type="button"
                onClick={onOpenWalletModal}
                className="group flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#131627]/90 px-3.5 py-2 text-xs font-medium text-white hover:border-[#8957FF]/60 hover:bg-[#191D34] transition-all whitespace-nowrap shrink-0 shadow-lg shadow-black/40 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                  <span className="font-mono text-[11px] text-[#8F94AB]">
                    {chainId === 56 ? 'BSC' : 'tBSC'}
                  </span>
                </div>
                <span className="h-3 w-px bg-white/10"></span>
                <span className="font-mono font-semibold text-white tracking-tight">
                  {shortenAddress(address, 4)}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[#8F94AB] group-hover:text-white transition-colors" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenWalletModal}
                className="mint-button relative overflow-hidden flex items-center gap-2 rounded-xl px-4.5 py-2.5 text-xs font-bold shadow-lg transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Wallet className="h-3.5 w-3.5" />
                <span>Connect Wallet</span>
              </button>
            )}

            {/* Mobile hamburger button - 48px touch target */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setMenuOpen(!isMenuOpen);
              }}
              className="touch-target-min flex xl:hidden items-center justify-center p-2 rounded-xl text-[#8F94AB] hover:text-white focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Glass Navigation Drawer - Rendered outside header to escape backdrop-filter containment */}
      {isMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50">
          {/* Backdrop blur overlay */}
          <div 
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
          />

          <div className="fixed inset-x-0 top-20 bottom-0 bg-[#07110e]/98 backdrop-blur-3xl px-5 pt-4 pb-[max(96px,env(safe-area-inset-bottom,96px))] overflow-y-auto space-y-4 animate-in slide-in-from-top-4 duration-200">
            
            {/* Wallet Status Card in Drawer */}
            {isConnected ? (
              <div className="bg-[#111321] rounded-2xl p-4 border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                    <span className="font-mono text-xs font-bold text-white">{shortenAddress(address || '', 6)}</span>
                  </div>
                  <span className="rounded-lg border border-[#F2C46D]/30 bg-[#F2C46D]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[#F2C46D]">
                    BSC 56
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-white/[0.06]">
                  <div className="bg-[#080910] p-2.5 rounded-xl border border-white/[0.04]">
                    <div className="text-[10px] text-[#8F94AB]">LEGEND:</div>
                    <div className="font-bold text-white mt-0.5">{formatLegend(legendBalance)}</div>
                  </div>
                  <div className="bg-[#080910] p-2.5 rounded-xl border border-white/[0.04]">
                    <div className="text-[10px] text-[#8F94AB]">BNB:</div>
                    <div className="font-bold text-white mt-0.5">{formatBnb(bnbBalance)}</div>
                  </div>
                </div>

                {agentId ? (
                  <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#36BFFF] bg-[#36BFFF]/10 p-2.5 rounded-xl border border-[#36BFFF]/20">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Agent ID: {agentId}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">VERIFIED</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenAgentModal();
                    }}
                    className="w-full touch-target-min flex items-center justify-center gap-2 rounded-xl bg-[#36BFFF]/15 border border-[#36BFFF]/30 py-2.5 text-xs font-bold text-[#36BFFF] cursor-pointer active:scale-98 transition-transform"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Verify Binance Agent ID</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenWalletModal();
                }}
                className="w-full touch-target-min flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#8957FF] to-[#36BFFF] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#8957FF]/30 cursor-pointer active:scale-98 transition-transform"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Web3 Wallet</span>
              </button>
            )}

            {/* Navigation Links List */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#8F94AB] px-1 pb-1">
                Civilization Portals
              </div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full touch-target-min flex items-center justify-between text-left px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all cursor-pointer active:scale-98 ${
                    activeTab === item.id
                      ? 'bg-[#171A2B] text-white border border-[#8957FF]/50 shadow-md shadow-[#8957FF]/10'
                      : 'text-[#8F94AB] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
