import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, agentId } = body;
    const verifiedId = agentId
      ? String(agentId).toUpperCase()
      : `AGENT-BSC-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json({
      success: true,
      verified: true,
      agentId: verifiedId,
      address,
      verifiedAt: new Date().toISOString(),
      freeQuota: 1,
      paidQuotaMax: 6,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
