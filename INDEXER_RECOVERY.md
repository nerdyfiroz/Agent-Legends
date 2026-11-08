# BLOCKCHAIN EVENT INDEXER & REORGANIZATION RECOVERY GUIDE

## 1. Indexing Architecture
The Agent Legends blockchain data infrastructure synchronizes on-chain state to the application frontend using a real-time reactive pipeline:

$$\text{BSC Block Event} \longrightarrow \text{Event Decoder} \longrightarrow \text{Confirmation Tracker (12 Blocks)} \longrightarrow \text{PostgreSQL Write} \longrightarrow \text{SSE Notification} \longrightarrow \text{Client UI Update}$$

---

## 2. Reorganization (Reorg) Protection & Rollback Strategy
1. **Confirmation Depth**: Transactions are marked `PENDING` until 12 block confirmations are recorded on BNB Smart Chain.
2. **Block Parent Hash Validation**: The indexer verifies each incoming block's `parentHash` against the previously recorded block in the `IndexedBlock` table.
3. **Rollback Mechanism**: If a fork is detected (where a parent hash does not match):
   - The indexer identifies the common ancestor block.
   - Reverts state updates and marks affected rows in `MintEvent`, `NFTTransfer`, and `RewardGift` as `REORGANIZED`.
   - Re-indexes the canonical chain from the ancestor block number.

---

## 3. Idempotent Ingestion & Duplicate Event Prevention
- Every indexed event uses composite unique constraints in PostgreSQL:
  - `NFTTransfer`: `[txHash, logIndex]`
  - `TokenEvent`: `[txHash, logIndex]`
  - `RewardGift`: `[txHash, nftTokenId]`
- Upserts ensure that duplicate emissions or re-processing during restarts do not double-count gifts or mint allocations.

---

## 4. Disaster Recovery & Backfill Protocol
When recovering from an RPC outage or node disconnection:
```bash
# 1. Inspect Indexer Health
curl http://localhost:3000/api/health

# 2. Check current synced block vs latest BSC node height
curl http://localhost:3000/api/stats

# 3. Trigger manual backfill between block range
# (IndexedBlock records guarantee no duplicates)
```
