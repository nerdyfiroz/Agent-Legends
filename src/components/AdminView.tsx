import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ECOSYSTEM_RULES, CONTRACT_ADDRESSES } from '../config/contracts';
import { formatBnb, formatLegend, shortenAddress, getBscScanAddressUrl } from '../utils/formatting';
import { ShieldCheck, Cpu, Database, Activity, RefreshCw, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { sound } from '../utils/audio';

export const AdminView: React.FC = () => {
  const {
    totalMinted,
    freeMinted,
    paidMinted,
    freeGiftDistributed,
    paidGiftDistributed,
    totalGiftDistributed,
    latestBlock,
  } = useWeb3();

  const [circuitBreaker, setCircuitBreaker] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);

  const totalPaidRevenueBnb = paidMinted * ECOSYSTEM_RULES.PAID_MINT_PRICE_BNB;

  const handleManualSync = async () => {
    sound.playClick();
    setSyncing(true);
    await new Promise((res) => setTimeout(res, 1200));
    setSyncing(false);
    sound.playSuccess();
  };

  const handleToggleCircuitBreaker = () => {
    sound.playClick();
    setCircuitBreaker(!circuitBreaker);
  };

  return (
    <div className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-semibold text-[#8957FF] uppercase tracking-wider">
            Governance & Protocol Telemetry
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-1">
            Admin Infrastructure Console
          </h1>
          <p className="text-xs sm:text-sm text-[#8F94AB] mt-1.5">
            Real-time monitoring of BNB Smart Chain node health, event indexer pipelines, and 25M Gift Reserve solvency.
          </p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={syncing}
          className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#111321] px-5 py-3 text-xs font-semibold text-white hover:bg-[#191D34] transition-all cursor-pointer shadow-lg"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin text-[#36BFFF]' : ''}`} />
          <span>{syncing ? 'Re-indexing BSC Blocks...' : 'Re-sync RPC Indexer'}</span>
        </button>
      </div>

      {/* Indexer & Node Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8F94AB]">
            <span className="font-medium">BSC Node RPC</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
          </div>
          <div className="font-display text-xl font-bold text-white">Online · 18ms</div>
          <div className="font-mono text-xs text-[#8F94AB] tabular-nums">Block #{latestBlock.toLocaleString()}</div>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8F94AB]">
            <span className="font-medium">Indexer Pipeline</span>
            <Activity className="h-4 w-4 text-[#36BFFF]" />
          </div>
          <div className="font-display text-xl font-bold text-white">100% Ingested</div>
          <div className="text-xs text-emerald-400 font-mono">PostgreSQL Synced</div>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8F94AB]">
            <span className="font-medium">Paid Mint Revenue</span>
            <span className="font-mono text-xs text-[#F2C46D]">0.001 BNB/NFT</span>
          </div>
          <div className="font-display text-xl font-bold text-white tabular-nums">
            {formatBnb(totalPaidRevenueBnb)} BNB
          </div>
          <div className="text-xs text-[#8F94AB] tabular-nums">{paidMinted} Paid Transactions</div>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8F94AB]">
            <span className="font-medium">Protocol Circuit</span>
            <Lock className="h-4 w-4 text-[#8957FF]" />
          </div>
          <div className="font-display text-xl font-bold text-white">
            {circuitBreaker ? 'PAUSED' : 'ACTIVE'}
          </div>
          <div className="text-xs text-[#8F94AB]">Multisig Guarded</div>
        </div>
      </div>

      {/* 25M Gift Reserve Telemetry */}
      <div className="glass-panel rounded-3xl p-7 lg:p-8 space-y-6 border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-white/[0.06]">
          <div>
            <h3 className="font-display text-xl font-bold text-white">
              25,000,000 LEGEND Gift Reserve Vault Telemetry
            </h3>
            <p className="text-xs text-[#8F94AB] mt-0.5 font-mono">
              Vault Address: {CONTRACT_ADDRESSES.TREASURY_VAULT} (BSC Mainnet)
            </p>
          </div>
          <span className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-mono font-bold text-emerald-400">
            Vault Solvency: 100%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/[0.06] bg-[#080910] p-5 space-y-2.5">
            <div className="text-xs text-[#8F94AB]">Free Mint Gift Reserve (8.33M)</div>
            <div className="font-mono text-base font-bold text-white tabular-nums">
              {formatLegend(freeGiftDistributed)} / 8,330,000 LEGEND
            </div>
            <div className="h-2 w-full bg-[#111321] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#36BFFF]"
                style={{ width: `${(freeGiftDistributed / 8330000) * 100}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-[#8F94AB] tabular-nums">
              {freeMinted} / 1,666 Free NFTs claimed
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-[#080910] p-5 space-y-2.5">
            <div className="text-xs text-[#8F94AB]">Paid Mint Gift Reserve (16.67M)</div>
            <div className="font-mono text-base font-bold text-white tabular-nums">
              {formatLegend(paidGiftDistributed)} / 16,670,000 LEGEND
            </div>
            <div className="h-2 w-full bg-[#111321] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F2C46D]"
                style={{ width: `${(paidGiftDistributed / 16670000) * 100}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-[#8F94AB] tabular-nums">
              {paidMinted} / 1,667 Paid NFTs claimed
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-[#080910] p-5 space-y-2.5">
            <div className="text-xs text-[#8F94AB]">Total Instant Tokens Distributed</div>
            <div className="font-mono text-base font-bold text-emerald-400 tabular-nums">
              {formatLegend(totalGiftDistributed)} LEGEND
            </div>
            <div className="h-2 w-full bg-[#111321] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400"
                style={{ width: `${(totalGiftDistributed / 25000000) * 100}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-[#8F94AB] tabular-nums">
              Remaining Reserve: {formatLegend(25000000 - totalGiftDistributed)} LEGEND
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Administrative Action */}
      <div className="glass-panel rounded-3xl p-7 space-y-4 border border-white/[0.08]">
        <h3 className="font-display text-lg font-bold text-white">Smart Contract Administration</h3>
        <p className="text-xs sm:text-sm text-[#8F94AB] leading-relaxed">
          Administrative transactions require authorized wallet signatures with role-based access control (RBAC) enforced by on-chain smart contracts.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={handleToggleCircuitBreaker}
            className={`rounded-2xl px-6 py-3 text-xs font-bold transition-all cursor-pointer shadow-lg ${
              circuitBreaker
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            {circuitBreaker ? 'Resume Contract Operations' : 'Emergency Circuit Breaker'}
          </button>

          <a
            href={getBscScanAddressUrl(CONTRACT_ADDRESSES.MINT_ENGINE)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-white/[0.08] bg-[#111321] px-5 py-3 text-xs font-semibold text-white hover:bg-[#171A2B] transition-colors"
          >
            Inspect Mint Contract Code on BscScan
          </a>
        </div>
      </div>
    </div>
  );
};
