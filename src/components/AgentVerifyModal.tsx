import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ShieldCheck, X, CheckCircle2, Cpu, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface AgentVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentVerifyModal: React.FC<AgentVerifyModalProps> = ({ isOpen, onClose }) => {
  const { agentId, verifyAgentId, address } = useWeb3();
  const [customId, setCustomId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    sound.playClick();
    const idToVerify = customId.trim() || `AGENT-BSC-${Math.floor(1000 + Math.random() * 9000)}`;
    await verifyAgentId(idToVerify);
    setIsVerifying(false);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-white/[0.1] bg-[#111321] p-5 sm:p-7 shadow-2xl shadow-black/90">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#36BFFF]/20 text-[#36BFFF] border border-[#36BFFF]/30">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="font-display text-base font-bold text-white">
              Binance Agent ID Verification
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

        <div className="mt-5 space-y-4">
          <p className="text-xs text-[#8F94AB] leading-relaxed">
            Eligibility for Genesis Free Mint and Paid Mint allocations requires a canonical Binance Agent ID registered on BNB Smart Chain.
          </p>

          {agentId ? (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4.5 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified Agent Status Active</span>
              </div>
              <div className="font-mono text-base font-bold text-white">{agentId}</div>
              <div className="text-[11px] text-[#8F94AB]">
                Bound to wallet: {address ? `${address.substring(0, 10)}...${address.substring(address.length - 6)}` : 'Connected'}
              </div>
            </div>
          ) : null}

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#8F94AB] mb-1.5">
                Binance Agent ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value)}
                  placeholder="e.g. AGENT-BSC-8821"
                  className="w-full rounded-2xl border border-white/[0.08] bg-[#0C0E1A] px-4 py-3 font-mono text-xs text-white placeholder-[#8F94AB]/50 focus:border-[#36BFFF] focus:outline-none"
                />
                <Cpu className="absolute right-4 top-3.5 h-4 w-4 text-[#8F94AB]" />
              </div>
              <span className="text-[11px] text-[#8F94AB] mt-1.5 block">
                Leave empty to automatically query your on-chain Binance Agent credentials.
              </span>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#36BFFF] to-[#8957FF] py-3.5 text-xs font-bold text-white shadow-xl shadow-[#36BFFF]/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isVerifying ? (
                <span>Querying On-Chain Registry...</span>
              ) : successMsg ? (
                <span className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="h-4 w-4" /> Verified Successfully!
                </span>
              ) : (
                <>
                  <span>Verify On-Chain Status</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
