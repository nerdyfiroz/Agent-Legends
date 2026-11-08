import React, { useState } from 'react';
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
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenWalletModal,
  onOpenAgentModal,
}) => {
  const { isConnected, address, chainId, bnbBalance, legendBalance, agentId } = useWeb3();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: NavTab) => {
    sound.playClick();
    setActiveTab(tab);
    setMobileMenuOpen(false);
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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#080910]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single Brand Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8957FF] via-[#36BFFF] to-[#F2C46D] p-[1.5px] shadow-lg shadow-[#8957FF]/25 transition-transform duration-300 group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0C0E1A]">
              <span className="font-display font-extrabold text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#8957FF] to-[#36BFFF]">
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
              onClick={onOpenWalletModal}
              className="relative overflow-hidden flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8957FF] via-[#7040FF] to-[#36BFFF] px-4.5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#8957FF]/30 hover:opacity-95 hover:shadow-[#8957FF]/50 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>Connect Wallet</span>
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex xl:hidden p-2 text-[#8F94AB] hover:text-white focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Glass Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-white/[0.06] bg-[#080910]/95 backdrop-blur-2xl px-5 pt-4 pb-6 space-y-3 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/[0.06]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between text-left px-3.5 py-2.5 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#171A2B] text-white font-bold border border-[#8957FF]/40 shadow-sm'
                    : 'text-[#8F94AB] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1 rounded ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {isConnected && (
            <div className="pt-2 flex items-center justify-between text-xs text-[#8F94AB] bg-[#111321] rounded-xl p-3 border border-white/[0.04]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#F2C46D]" />
                <span className="font-mono text-white">{formatLegend(legendBalance)} LEGEND</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-white">{formatBnb(bnbBalance)} BNB</span>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
