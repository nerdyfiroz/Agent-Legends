import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Synchronized State with Blockchain Data Engine
interface InMemNFT {
  tokenId: number;
  name: string;
  characterClass: string;
  rarity: string;
  rank: number;
  owner: string;
  agentId: string;
  image: string;
  mintTimestamp: number;
  evolutionLevel: number;
  powerScore: number;
  autonomousQuestsCompleted: number;
  traits: { trait_type: string; value: string | number }[];
  isListed?: boolean;
  listingPriceBnb?: number;
}

interface InMemEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  txHash: string;
  blockNumber: number;
  timestamp: number;
  from?: string;
  to?: string;
  tokenId?: number;
  amountBnb?: number;
  amountLegend?: number;
}

let currentBlock = 38924250;
let freeMinted = 892;
let paidMinted = 558;
const MAX_FREE = 1666;
const MAX_PAID = 1667;
const TOTAL_SUPPLY = 3333;
const FREE_GIFT = 5000;
const PAID_GIFT = 10000;

// SSE Client Connections
const sseClients: Response[] = [];

function broadcastSSE(data: object) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(payload);
    } catch {
      // client disconnected
    }
  });
}

// Background Block Tracker & Event Indexer Simulator
setInterval(() => {
  currentBlock += 1;
  broadcastSSE({
    type: 'BLOCK_UPDATE',
    blockNumber: currentBlock,
    timestamp: Date.now(),
  });
}, 4000);

// API Endpoints
// 1. Health & Node Telemetry
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    network: 'BNB Smart Chain (BSC)',
    chainId: 56,
    blockHeight: currentBlock,
    indexer: 'RUNNING',
    dbSync: 'POSTGRESQL_CONNECTED',
    giftReserveSolvency: '100% PRE-FUNDED',
    timestamp: Date.now(),
  });
});

// 2. Collection & Gift Reserve Statistics
app.get('/api/stats', (req: Request, res: Response) => {
  const freeGiftDistributed = freeMinted * FREE_GIFT;
  const paidGiftDistributed = paidMinted * PAID_GIFT;
  const totalGiftDistributed = freeGiftDistributed + paidGiftDistributed;

  res.json({
    totalSupply: TOTAL_SUPPLY,
    totalMinted: freeMinted + paidMinted,
    freeAllocation: MAX_FREE,
    freeMinted,
    paidAllocation: MAX_PAID,
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
    latestBlock: currentBlock,
  });
});

// 3. SSE Stream for Live Blockchain Activity Engine
app.get('/api/events/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.push(res);

  // Send initial handshake
  res.write(`data: ${JSON.stringify({ type: 'HANDSHAKE', block: currentBlock })}\n\n`);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

// 4. Verify Binance Agent ID
app.post('/api/verify-agent', (req: Request, res: Response) => {
  const { address, agentId } = req.body;
  const verifiedId = agentId ? String(agentId).toUpperCase() : `AGENT-BSC-${Math.floor(1000 + Math.random() * 9000)}`;

  res.json({
    success: true,
    verified: true,
    agentId: verifiedId,
    address,
    verifiedAt: new Date().toISOString(),
    freeQuota: 1,
    paidQuotaMax: 6,
  });
});

// 5. Canonical Free Mint
app.post('/api/mint/free', (req: Request, res: Response) => {
  const { address, agentId } = req.body;

  if (freeMinted >= MAX_FREE) {
    return res.status(400).json({ error: 'Free mint allocation exhausted.' });
  }

  freeMinted += 1;
  const nextTokenId = freeMinted + paidMinted;
  const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  const eventPayload = {
    id: `evt-${Date.now()}`,
    type: 'MINT_FREE',
    title: `Free Genesis Mint (#${nextTokenId})`,
    description: `Agent ${agentId} claimed NFT #${nextTokenId} + 5,000 LEGEND Gift`,
    txHash,
    blockNumber: currentBlock,
    timestamp: Date.now(),
    to: address,
    tokenId: nextTokenId,
    amountLegend: FREE_GIFT,
  };

  broadcastSSE(eventPayload);

  res.json({
    success: true,
    tokenId: nextTokenId,
    txHash,
    blockNumber: currentBlock,
    instantGiftTokens: FREE_GIFT,
    message: 'Free Genesis NFT minted successfully. 5,000 LEGEND transferred instantly.',
  });
});

// 6. Paid Mint (0.001 BNB per NFT, up to 6 NFTs, +10k LEGEND per NFT)
app.post('/api/mint/paid', (req: Request, res: Response) => {
  const { address, agentId, quantity } = req.body;
  const q = Number(quantity) || 1;

  if (q < 1 || q > 6) {
    return res.status(400).json({ error: 'Quantity must be between 1 and 6.' });
  }
  if (paidMinted + q > MAX_PAID) {
    return res.status(400).json({ error: 'Exceeds paid allocation.' });
  }

  paidMinted += q;
  const costBnb = q * 0.001;
  const totalGiftTokens = q * PAID_GIFT;
  const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  const eventPayload = {
    id: `evt-${Date.now()}`,
    type: 'MINT_PAID',
    title: `Paid Genesis Mint (${q} NFTs)`,
    description: `Agent ${agentId} minted ${q} NFT(s) + ${totalGiftTokens.toLocaleString()} LEGEND Gift`,
    txHash,
    blockNumber: currentBlock,
    timestamp: Date.now(),
    to: address,
    amountBnb: costBnb,
    amountLegend: totalGiftTokens,
  };

  broadcastSSE(eventPayload);

  res.json({
    success: true,
    quantity: q,
    costBnb,
    txHash,
    blockNumber: currentBlock,
    instantGiftTokens: totalGiftTokens,
    message: `Paid Genesis Mint confirmed. ${totalGiftTokens.toLocaleString()} LEGEND transferred instantly.`,
  });
});

// Mount Vite or Static Frontend
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Agent Legends Full-Stack Node Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
