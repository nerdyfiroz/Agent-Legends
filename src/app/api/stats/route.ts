import { NextResponse } from 'next/server';

export async function GET() {
  const freeMinted = 892;
  const paidMinted = 558;
  const freeGiftDistributed = freeMinted * 5000;
  const paidGiftDistributed = paidMinted * 10000;
  const totalGiftDistributed = freeGiftDistributed + paidGiftDistributed;

  return NextResponse.json({
    totalSupply: 3333,
    totalMinted: freeMinted + paidMinted,
    freeAllocation: 1666,
    freeMinted,
    paidAllocation: 1667,
    paidMinted,
    paidPriceBnb: 0.001,
    uniqueHolders: 914,
    giftReserve: {
      totalReserve: 25000000,
      freeReserve: 8330000,
      paidReserve: 16670000,
      freeGiftDistributed,
      paidGiftDistributed,
      totalGiftDistributed,
      remainingReserve: 25000000 - totalGiftDistributed,
    },
    latestBlock: 38924250,
  });
}
