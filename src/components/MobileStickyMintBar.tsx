import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ECOSYSTEM_RULES } from '../config/contracts';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';
import { sound } from '../utils/audio';

interface MobileStickyMintBarProps {
  onMintClick: () => void;
  activeTab: string;
}

export const MobileStickyMintBar: React.FC<MobileStickyMintBarProps> = ({
  onMintClick,
  activeTab,
}) => {
  const { totalMinted, isConnected, agentId } = useWeb3();

  // If the user is already on the genesis mint tab, hide the bar to prevent redundancy
  if (activeTab === 'genesis') {
    return null;
  }

  const progressPercent = Math.min(
    100,
    Math.round((totalMinted / ECOSYSTEM_RULES.TOTAL_NFT_SUPPLY) * 100)
  );

  return (
    <aside 
      aria-label="Quick Mint Action Bar"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#080910]/95 backdrop-blur-2xl border-t border-white/[0.1] px-4 pt-3 pb-[max(14px,env(safe-area-inset-bottom,14px))] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.8)] transition-all animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Left Telemetry: Supply & Instant Gift */}
        <div className="flex flex-col justify-center text-left">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse shrink-0"></span>
            <span className="font-mono text-xs font-bold text-white tabular-nums">
              {totalMinted} / {ECOSYSTEM_RULES.TOTAL_NFT_SUPPLY}
            </span>
            <span className="text-[10px] text-[#8F94AB] font-mono">({progressPercent}%)</span>
          </div>

          <div className="text-[11px] font-mono font-semibold text-[#F2C46D] flex items-center gap-1 mt-0.5">
            <Sparkles className="h-3 w-3 shrink-0" />
            <span>+5K - 10K $LEGEND Gift</span>
          </div>
        </div>

        {/* Right CTA Button: 48px touch target */}
        <button
          onClick={() => {
            sound.playClick();
            onMintClick();
          }}
          className="touch-target-min flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#8957FF] via-[#7040FF] to-[#36BFFF] px-6 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-[#8957FF]/40 active:scale-95 transition-transform cursor-pointer shrink-0"
        >
          <span>MINT LEGEND</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
};
