import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { getBscScanTxUrl, shortenAddress, timeAgo } from '../utils/formatting';
import { ActivityEvent } from '../types';
import { ExternalLink, Sparkles, Gift, Tag, RefreshCw, Layers } from 'lucide-react';
import { sound } from '../utils/audio';

export const LiveActivityFeed: React.FC = () => {
  const { activityEvents, latestBlock, chainId } = useWeb3();
  const [filter, setFilter] = useState<string>('ALL');

  const filteredEvents = activityEvents.filter((ev) => {
    if (filter === 'ALL') return true;
    if (filter === 'MINTS') return ev.type === 'MINT_FREE' || ev.type === 'MINT_PAID';
    if (filter === 'GIFTS') return ev.type === 'INSTANT_GIFT';
    if (filter === 'MARKET') return ev.type === 'LISTING' || ev.type === 'SALE';
    if (filter === 'EVOLUTION') return ev.type === 'EVOLUTION';
    return true;
  });

  const getEventBadge = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'MINT_FREE':
        return <span className="text-[#36BFFF] bg-[#36BFFF]/10 border border-[#36BFFF]/30 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold">FREE MINT</span>;
      case 'MINT_PAID':
        return <span className="text-[#F2C46D] bg-[#F2C46D]/10 border border-[#F2C46D]/30 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold">PAID MINT</span>;
      case 'INSTANT_GIFT':
        return <span className="text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold">LEGEND GIFT</span>;
      case 'SALE':
        return <span className="text-[#8957FF] bg-[#8957FF]/10 border border-[#8957FF]/30 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold">SALE</span>;
      case 'LISTING':
        return <span className="text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold">LISTED</span>;
      case 'EVOLUTION':
        return <span className="text-purple-400 bg-purple-400/10 border border-purple-400/30 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold">EVOLUTION</span>;
      default:
        return <span className="text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-md text-[10px] font-mono">EVENT</span>;
    }
  };

  return (
    <section className="relative py-20 border-t border-white/[0.06] bg-[#0A0C16]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono font-semibold text-[#36BFFF] uppercase tracking-wider">
              Synchronized Event Stream
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Live Blockchain Activity Engine
            </h2>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111321] border border-white/[0.06]">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
            <span className="font-mono text-xs text-[#8F94AB] tabular-nums">
              BSC Block #{latestBlock.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#111321] rounded-2xl border border-white/[0.06] mb-6 max-w-fit">
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'MINTS', label: 'Mints' },
            { id: 'GIFTS', label: 'Instant Gifts' },
            { id: 'MARKET', label: 'Marketplace' },
            { id: 'EVOLUTION', label: 'Upgrades' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setFilter(tab.id);
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-[#191D34] text-white shadow-sm border border-[#8957FF]/50 font-semibold'
                  : 'text-[#8F94AB] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Event List Table */}
        <div className="overflow-hidden rounded-3xl border border-white/[0.06] bg-[#111321]/90 shadow-2xl">
          <div className="divide-y divide-white/[0.04]">
            {filteredEvents.length === 0 ? (
              <div className="p-10 text-center text-xs text-[#8F94AB]">
                No recent activity matching the selected filter.
              </div>
            ) : (
              filteredEvents.slice(0, 10).map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 p-5 hover:bg-[#171A2B]/70 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="mt-0.5 sm:mt-0">{getEventBadge(event.type)}</div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white">{event.title}</div>
                      <div className="text-[11px] sm:text-xs text-[#8F94AB] mt-0.5">
                        {event.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 text-xs font-mono text-[#8F94AB] shrink-0">
                    <span className="text-[11px] tabular-nums">{timeAgo(event.timestamp)}</span>
                    <a
                      href={getBscScanTxUrl(event.txHash, chainId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-[#0C0E1A] px-2.5 py-1 text-xs text-[#36BFFF] hover:border-[#36BFFF]/50 hover:bg-[#36BFFF]/10 transition-colors"
                    >
                      <span>{shortenAddress(event.txHash, 4)}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
