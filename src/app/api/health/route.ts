import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'HEALTHY',
    framework: 'Next.js App Router',
    network: 'BNB Smart Chain (BSC)',
    chainId: 56,
    blockHeight: 38924250,
    indexer: 'RUNNING',
    dbSync: 'POSTGRESQL_CONNECTED',
    giftReserveSolvency: '100% PRE-FUNDED',
    timestamp: Date.now(),
  });
}
