import { NETWORKS } from '../config/contracts';

export function shortenAddress(address?: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function formatBnb(amount: number): string {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 4,
  });
}

export function formatLegend(amount: number): string {
  return amount.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
}

export function getBscScanTxUrl(txHash: string, chainId = 56): string {
  const explorer = NETWORKS[chainId]?.explorerUrl || 'https://bscscan.com';
  return `${explorer}/tx/${txHash}`;
}

export function getBscScanAddressUrl(address: string, chainId = 56): string {
  const explorer = NETWORKS[chainId]?.explorerUrl || 'https://bscscan.com';
  return `${explorer}/address/${address}`;
}

export function getBscScanTokenUrl(contractAddress: string, tokenId?: number, chainId = 56): string {
  const explorer = NETWORKS[chainId]?.explorerUrl || 'https://bscscan.com';
  if (tokenId !== undefined) {
    return `${explorer}/token/${contractAddress}?a=${tokenId}`;
  }
  return `${explorer}/token/${contractAddress}`;
}

export function timeAgo(timestampMs: number): string {
  const seconds = Math.floor((Date.now() - timestampMs) / 1000);
  if (seconds < 60) return `${Math.max(1, seconds)}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
