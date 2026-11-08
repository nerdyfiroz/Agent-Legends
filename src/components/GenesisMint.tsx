import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ECOSYSTEM_RULES, CONTRACT_ADDRESSES } from '../config/contracts';
import { formatBnb, formatLegend, getBscScanTxUrl, shortenAddress } from '../utils/formatting';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Gift,
  ArrowRight,
  ExternalLink,
  Loader2,
  RefreshCw,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface GenesisMintProps {
  onOpenAgentModal: () => void;
  onOpenWalletModal: () => void;
}

export const GenesisMint: React.FC<GenesisMintProps> = ({
  onOpenAgentModal,
  onOpenWalletModal,
}) => {
  const {
    isConnected,
    address,
    chainId,
    bnbBalance,
    legendBalance,
    agentId,
    userMintStatus,
    freeMinted,
    paidMinted,
    totalMinted,
    mintTxStep,
    mintError,
    latestTxHash,
    latestGiftReceived,
    executeFreeMint,
    executePaidMint,
    resetMintState,
  } = useWeb3();

  const [paidQuantity, setPaidQuantity] = useState<number>(1);

  const remainingPaidQuota = Math.max(0, ECOSYSTEM_RULES.MAX_PAID_MINTS_PER_AGENT - userMintStatus.paidMintsCount);
  const isPending =
    mintTxStep === 'CHECKING_ELIGIBILITY' ||
    mintTxStep === 'AWAITING_WALLET' ||
    mintTxStep === 'TRANSACTION_SUBMITTED' ||
    mintTxStep === 'TRANSACTION_PENDING';

  const handleFreeMintSubmit = async () => {
    if (isPending) return;
    await executeFreeMint();
  };

  const handlePaidMintSubmit = async () => {
    if (isPending) return;
    await executePaidMint(paidQuantity);
  };

  const paidCostBnb = paidQuantity * ECOSYSTEM_RULES.PAID_MINT_PRICE_BNB;
  const paidGiftTokens = paidQuantity * ECOSYSTEM_RULES.PAID_MINT_GIFT_LEGEND;

  return (
    <div className="relative py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#111321] px-4 py-1.5 text-xs font-mono font-semibold text-[#8957FF] shadow-lg">
          <Sparkles className="h-3.5 w-3.5 text-[#F2C46D]" />
          <span>CANONICAL BNB SMART CHAIN GENESIS MINT</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Mint Your Genesis Agent Legend
        </h1>
        <p className="text-sm sm:text-base text-[#8F94AB] leading-relaxed">
          Verify your Binance Agent ID to unlock sovereign Genesis Agent NFTs with instant on-chain transfer of <strong className="text-white font-semibold">5,000 to 10,000 $LEGEND</strong> tokens directly to your wallet.
        </p>
      </div>

      {/* 25M Gift Reserve Tracker Bar */}
      <div className="glass-panel-elevated rounded-3xl p-6 lg:p-7 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F2C46D]">
              <Gift className="h-4 w-4" />
              <span>25,000,000 LEGEND Minter Gift Reserve Active</span>
            </div>
            <p className="text-xs sm:text-sm text-[#8F94AB] leading-relaxed">
              8.33M reserved for 1,666 Free Mints (5,000 each) · 16.67M reserved for 1,667 Paid Mints (10,000 each). Zero claims required!
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs font-mono shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-[#8F94AB]">Pre-Funded Reserve</div>
              <div className="font-bold text-white text-sm tabular-nums">25,000,000 LEGEND</div>
            </div>
            <div className="h-9 w-px bg-white/[0.08]"></div>
            <div className="text-left">
              <div className="text-[10px] text-[#8F94AB]">Transfer Engine</div>
              <div className="font-bold text-emerald-400 text-sm">Instant Automated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet & Agent ID Status Strip */}
      <div className="glass-panel rounded-2xl p-5 border border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
          {/* Wallet Connection */}
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-[#080910] flex items-center justify-center border border-white/[0.06] text-xl shrink-0">
              🦊
            </div>
            <div>
              <div className="text-[11px] text-[#8F94AB] font-medium">Connected Address</div>
              <div className="font-mono text-sm font-semibold text-white tracking-tight">
                {isConnected && address ? shortenAddress(address, 6) : 'Wallet Not Connected'}
              </div>
            </div>
          </div>

          {/* Agent ID verification */}
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-[#36BFFF]/10 flex items-center justify-center border border-[#36BFFF]/30 text-[#36BFFF] shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] text-[#8F94AB] font-medium">Binance Agent ID</div>
              <div className="font-mono text-sm font-semibold text-white">
                {agentId ? (
                  <span className="text-emerald-400 font-bold">{agentId}</span>
                ) : (
                  <span className="text-[#F2C46D]">Unverified Status</span>
                )}
              </div>
            </div>
            {!agentId && isConnected && (
              <button
                onClick={onOpenAgentModal}
                className="rounded-xl bg-[#36BFFF] px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-[#36BFFF]/90 transition-colors cursor-pointer"
              >
                Verify ID
              </button>
            )}
          </div>

          {/* Quota overview */}
          <div className="flex items-center justify-between md:justify-end gap-6 text-xs border-t md:border-t-0 pt-3 md:pt-0 border-white/[0.06]">
            <div>
              <div className="text-[#8F94AB]">Free Quota:</div>
              <div className="font-semibold text-white">
                {userMintStatus.hasClaimedFree ? '1/1 Claimed' : '1 Available'}
              </div>
            </div>
            <div>
              <div className="text-[#8F94AB]">Paid Quota:</div>
              <div className="font-semibold text-white tabular-nums">
                {userMintStatus.paidMintsCount} / 6 Used ({remainingPaidQuota} left)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mint Terminals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Terminal 1: Canonical Free Mint */}
        <div className="glass-panel rounded-3xl p-7 sm:p-9 flex flex-col justify-between hover:border-[#36BFFF]/50 transition-all duration-300 shadow-2xl relative">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-[#36BFFF]/15 border border-[#36BFFF]/30 px-3 py-1 text-xs font-mono font-bold text-[#36BFFF]">
                CANONICAL FREE MINT
              </span>
              <span className="font-mono text-xs text-[#8F94AB] tabular-nums">
                {freeMinted} / {ECOSYSTEM_RULES.FREE_MINT_ALLOCATION.toLocaleString()} Minted
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                0 BNB Free Claim
              </h2>
              <p className="text-xs sm:text-sm text-[#8F94AB] leading-relaxed">
                Exclusively for verified Binance Agent ID holders. Receive 1 Genesis NFT plus an instant grant of 5,000 $LEGEND utility tokens transferred upon confirmation.
              </p>
            </div>

            {/* Benefit Highlights */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0C0E1A] p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8F94AB]">Mint Cost:</span>
                <span className="font-mono font-bold text-emerald-400">0.000 BNB (Free)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8F94AB]">Per Agent ID Limit:</span>
                <span className="text-white font-medium">1 Free NFT (Max)</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2.5 border-t border-white/[0.06]">
                <span className="text-[#8F94AB] flex items-center gap-1.5 font-semibold text-white">
                  <Gift className="h-4 w-4 text-[#F2C46D]" /> Instant Token Gift:
                </span>
                <span className="font-mono font-bold text-[#F2C46D] text-sm tabular-nums">
                  +5,000 $LEGEND
                </span>
              </div>
            </div>

            <div className="text-[11px] text-[#8F94AB] italic leading-normal">
              * Tokens are automatically dispatched from the 8.33M Free Mint Gift Reserve by the smart contract in the mint transaction.
            </div>
          </div>

          <div className="pt-8">
            {!isConnected ? (
              <button
                onClick={onOpenWalletModal}
                className="w-full rounded-2xl bg-gradient-to-r from-[#8957FF] to-[#36BFFF] py-4 text-xs font-bold text-white shadow-xl hover:opacity-95 transition-opacity cursor-pointer"
              >
                Connect Wallet to Claim
              </button>
            ) : !agentId ? (
              <button
                onClick={onOpenAgentModal}
                className="w-full rounded-2xl border border-[#36BFFF]/50 bg-[#36BFFF]/15 py-4 text-xs font-bold text-[#36BFFF] hover:bg-[#36BFFF]/25 transition-colors cursor-pointer"
              >
                Verify Binance Agent ID First
              </button>
            ) : userMintStatus.hasClaimedFree ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 py-4 text-center text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Free Mint Already Claimed (1/1)</span>
              </div>
            ) : (
              <button
                onClick={handleFreeMintSubmit}
                disabled={isPending || freeMinted >= ECOSYSTEM_RULES.FREE_MINT_ALLOCATION}
                className="w-full rounded-2xl bg-gradient-to-r from-[#36BFFF] via-[#7040FF] to-[#8957FF] py-4 text-xs font-bold text-white shadow-xl shadow-[#36BFFF]/25 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isPending ? 'Processing On-Chain...' : 'Claim 1 Free NFT + 5,000 LEGEND'}
              </button>
            )}
          </div>
        </div>

        {/* Terminal 2: Paid Mint (0.001 BNB each, up to 6 NFTs, +10k LEGEND per NFT) */}
        <div className="glass-panel-elevated rounded-3xl p-7 sm:p-9 flex flex-col justify-between hover:border-[#8957FF] transition-all duration-300 shadow-2xl relative">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-[#8957FF]/15 border border-[#8957FF]/30 px-3 py-1 text-xs font-mono font-bold text-[#8957FF]">
                PAID MINT ALLOCATION
              </span>
              <span className="font-mono text-xs text-[#8F94AB] tabular-nums">
                {paidMinted} / {ECOSYSTEM_RULES.PAID_MINT_ALLOCATION.toLocaleString()} Minted
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                0.001 BNB per NFT
              </h2>
              <p className="text-xs sm:text-sm text-[#8F94AB] leading-relaxed">
                Allow up to 6 paid mints per verified Agent ID. Each paid NFT receives a generous <strong className="text-[#F2C46D]">10,000 $LEGEND instant gift</strong> directly from the 16.67M Paid Gift Reserve.
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2.5">
              <label className="flex items-center justify-between text-xs font-medium text-[#8F94AB]">
                <span>Select Mint Quantity (Max 6 per ID):</span>
                <span className="font-mono text-white">Remaining Quota: {remainingPaidQuota}</span>
              </label>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      sound.playClick();
                      setPaidQuantity(q);
                    }}
                    disabled={q > remainingPaidQuota}
                    className={`flex-1 py-3 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                      paidQuantity === q
                        ? 'border-[#8957FF] bg-[#8957FF] text-white shadow-lg shadow-[#8957FF]/40 scale-[1.02]'
                        : q > remainingPaidQuota
                        ? 'border-white/[0.04] bg-[#080910] text-[#8F94AB]/25 cursor-not-allowed'
                        : 'border-white/[0.06] bg-[#111321] text-white hover:border-[#8957FF]/50'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Cost and Gift summary */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0C0E1A] p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8F94AB]">Total Cost ({paidQuantity} NFT{paidQuantity > 1 ? 's' : ''}):</span>
                <span className="font-mono font-bold text-white tabular-nums">{formatBnb(paidCostBnb)} BNB</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8F94AB]">Rate:</span>
                <span className="text-white font-medium">0.001 BNB / NFT</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2.5 border-t border-white/[0.06]">
                <span className="text-[#8F94AB] flex items-center gap-1.5 font-semibold text-white">
                  <Gift className="h-4 w-4 text-[#F2C46D]" /> Instant Gift Transfer:
                </span>
                <span className="font-mono font-bold text-[#F2C46D] text-sm tabular-nums">
                  +{formatLegend(paidGiftTokens)} $LEGEND
                </span>
              </div>
            </div>

            <div className="text-[11px] text-[#8F94AB] italic leading-normal">
              * Instant gift rate: 10,000 LEGEND per NFT. E.g. 6 NFTs = 60,000 LEGEND automatically transferred!
            </div>
          </div>

          <div className="pt-8">
            {!isConnected ? (
              <button
                onClick={onOpenWalletModal}
                className="w-full rounded-2xl bg-gradient-to-r from-[#8957FF] to-[#36BFFF] py-4 text-xs font-bold text-white shadow-xl hover:opacity-95 transition-opacity cursor-pointer"
              >
                Connect Wallet to Mint
              </button>
            ) : !agentId ? (
              <button
                onClick={onOpenAgentModal}
                className="w-full rounded-2xl border border-[#8957FF]/50 bg-[#8957FF]/15 py-4 text-xs font-bold text-[#8957FF] hover:bg-[#8957FF]/25 transition-colors cursor-pointer"
              >
                Verify Binance Agent ID First
              </button>
            ) : remainingPaidQuota === 0 ? (
              <div className="rounded-2xl border border-[#8957FF]/30 bg-[#8957FF]/10 py-4 text-center text-xs font-semibold text-white flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#8957FF]" />
                <span>Maximum Paid Limit Reached (6/6)</span>
              </div>
            ) : (
              <button
                onClick={handlePaidMintSubmit}
                disabled={isPending || paidQuantity > remainingPaidQuota}
                className="w-full rounded-2xl bg-gradient-to-r from-[#8957FF] via-[#7040FF] to-[#36BFFF] py-4 text-xs font-bold text-white shadow-xl shadow-[#8957FF]/30 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isPending ? 'Processing On-Chain...' : `Mint ${paidQuantity} NFT(s) + ${formatLegend(paidGiftTokens)} LEGEND`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 7-State On-Chain Transaction Progress Panel */}
      {mintTxStep !== 'IDLE' && (
        <div className="rounded-3xl border border-[#8957FF]/40 bg-[#111321] p-7 shadow-2xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-white">
                On-Chain Transaction Pipeline
              </span>
              <span className="rounded-md bg-[#8957FF]/20 px-2 py-0.5 text-[10px] font-mono text-[#8957FF]">
                BSC Consensus
              </span>
            </div>
            {(mintTxStep === 'TRANSACTION_CONFIRMED' || mintTxStep === 'TRANSACTION_FAILED') && (
              <button
                onClick={resetMintState}
                className="text-xs text-[#8F94AB] hover:text-white cursor-pointer"
              >
                Dismiss
              </button>
            )}
          </div>

          <div className="mt-6 space-y-6">
            {/* 7 State steps bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center text-xs">
              {[
                { key: 'IDLE', label: '1. Ready' },
                { key: 'CHECKING_ELIGIBILITY', label: '2. Check ID' },
                { key: 'AWAITING_WALLET', label: '3. Signature' },
                { key: 'TRANSACTION_SUBMITTED', label: '4. Submitted' },
                { key: 'TRANSACTION_PENDING', label: '5. Mining' },
                { key: 'TRANSACTION_CONFIRMED', label: '6. Confirmed' },
                { key: 'TRANSACTION_FAILED', label: '7. Error' },
              ].map((step) => {
                const isActive = mintTxStep === step.key;
                const isFailed = mintTxStep === 'TRANSACTION_FAILED' && step.key === 'TRANSACTION_FAILED';
                const isCompleted =
                  mintTxStep === 'TRANSACTION_CONFIRMED' && step.key !== 'TRANSACTION_FAILED';

                return (
                  <div
                    key={step.key}
                    className={`rounded-xl p-2.5 border text-[11px] font-mono transition-all ${
                      isActive
                        ? 'border-[#8957FF] bg-[#8957FF]/20 text-white font-bold shadow-md shadow-[#8957FF]/20'
                        : isCompleted
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold'
                        : isFailed
                        ? 'border-rose-500/50 bg-rose-500/10 text-rose-400 font-bold'
                        : 'border-white/[0.04] bg-[#080910] text-[#8F94AB]/50'
                    }`}
                  >
                    {step.label}
                  </div>
                );
              })}
            </div>

            {/* Current State Detail Box */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#080910] p-5">
              {mintTxStep === 'CHECKING_ELIGIBILITY' && (
                <div className="flex items-center gap-3 text-xs text-[#36BFFF]">
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  <span>Verifying Binance Agent ID signature against on-chain registry contract...</span>
                </div>
              )}

              {mintTxStep === 'AWAITING_WALLET' && (
                <div className="flex items-center gap-3 text-xs text-[#F2C46D]">
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  <span>Awaiting cryptographic signature confirmation in your Web3 wallet...</span>
                </div>
              )}

              {mintTxStep === 'TRANSACTION_SUBMITTED' && (
                <div className="flex items-center gap-3 text-xs text-white">
                  <Loader2 className="h-4 w-4 animate-spin text-[#8957FF] shrink-0" />
                  <span>Transaction broadcast to BSC mempool. Hash: {shortenAddress(latestTxHash || '', 8)}</span>
                </div>
              )}

              {mintTxStep === 'TRANSACTION_PENDING' && (
                <div className="flex items-center gap-3 text-xs text-white">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-400 shrink-0" />
                  <span>Mining on BNB Smart Chain block... Awaiting consensus confirmation.</span>
                </div>
              )}

              {mintTxStep === 'TRANSACTION_CONFIRMED' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Transaction Confirmed on BNB Smart Chain!</span>
                  </div>

                  <p className="text-xs text-[#8F94AB] leading-relaxed">
                    Decoded <strong className="text-white">Minted Event</strong>. NFT ownership has been credited to your address, and an instant gift of{' '}
                    <strong className="text-[#F2C46D] font-mono">+{formatLegend(latestGiftReceived)} $LEGEND</strong> tokens was deposited directly into your wallet from the 25M Gift Reserve Vault.
                  </p>

                  {latestTxHash && (
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={getBscScanTxUrl(latestTxHash, chainId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#36BFFF]/40 bg-[#36BFFF]/10 px-3.5 py-2 text-xs font-semibold text-[#36BFFF] hover:bg-[#36BFFF]/20 transition-colors"
                      >
                        <span>View on BscScan ({shortenAddress(latestTxHash, 8)})</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {mintTxStep === 'TRANSACTION_FAILED' && (
                <div className="flex items-start gap-3 text-xs text-rose-400">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Transaction Failed</div>
                    <div className="text-[11px] text-[#8F94AB] mt-0.5">{mintError || 'Unknown error.'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Minting FAQ section */}
      <div className="glass-panel rounded-3xl p-7 sm:p-9 space-y-6 border border-white/[0.06]">
        <div className="flex items-center gap-2 text-white">
          <HelpCircle className="h-5 w-5 text-[#8957FF]" />
          <h3 className="font-display text-xl font-bold">
            Genesis Minting & 25M Gift Reserve FAQ
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[#8F94AB] leading-relaxed">
          <div className="space-y-1.5">
            <h4 className="font-semibold text-white text-sm">How do the LEGEND token gifts work?</h4>
            <p>
              Gifts are transferred <strong>instantly in the same block</strong> as your mint transaction. There are no vesting schedules, no locking periods, and no separate claims required.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-white text-sm">What are the minting allocations?</h4>
            <p>
              Each verified canonical Binance Agent ID is entitled to <strong>1 Free Mint</strong> (+5,000 LEGEND gift) and up to <strong>6 Paid Mints</strong> at 0.001 BNB each (+10,000 LEGEND gift per NFT).
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-white text-sm">How is the 25M Gift Reserve calculated?</h4>
            <p>
              1,666 Free NFTs × 5,000 LEGEND = 8,330,000 LEGEND. 1,667 Paid NFTs × 10,000 LEGEND = 16,670,000 LEGEND. Total reserve is exactly 25,000,000 LEGEND tokens.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-white text-sm">Are free and paid allocations independent?</h4>
            <p>
              Yes. You can claim your 1 Free Mint and also mint up to 6 Paid NFTs in separate or combined transactions without affecting either quota.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
