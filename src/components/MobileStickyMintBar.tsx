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
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#07110e]/95 backdrop-blur-2xl border-t border-[#b8f5d0]/15 px-3.5 sm:px-4 pt-2.5 sm:pt-3 pb-[max(12px,env(safe-area-inset-bottom,12px))] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.85)] transition-all animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-center justify-between gap-2.5 max-w-md mx-auto">
        {/* Left Telemetry: Supply & Instant Gift */}
        <div className="flex flex-col justify-center text-left min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse shrink-0"></span>
            <span className="font-mono text-xs font-bold text-white tabular-nums">
              {totalMinted} / {ECOSYSTEM_RULES.TOTAL_NFT_SUPPLY}
            </span>
            <span className="text-[10px] text-[#8F94AB] font-mono">({progressPercent}%)</span>
          </div>

          <div className="text-[10px] sm:text-[11px] font-mono font-semibold text-[#F2C46D] flex items-center gap-1 mt-0.5 truncate">
            <Sparkles className="h-3 w-3 shrink-0 text-[#F2C46D]" />
            <span>+5K - 10K $LEGEND</span>
          </div>
        </div>

        {/* Right CTA Button: 48px touch target */}
        <button
          onClick={() => {
            sound.playClick();
            onMintClick();
          }}
          className="mint-button touch-target-min flex items-center justify-center gap-1.5 sm:gap-2 rounded-2xl px-4.5 sm:px-6 py-3 text-xs font-extrabold active:scale-95 transition-transform cursor-pointer shrink-0 shadow-lg shadow-[#75dca8]/20"
        >
          <span>MINT NOW</span>
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
    </aside>
  );
};
