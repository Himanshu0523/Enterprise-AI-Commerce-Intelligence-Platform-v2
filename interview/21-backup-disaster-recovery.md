# 21. Backup & Disaster Recovery Architecture

## 1. RPO and RTO Targets
- **Recovery Point Objective (RPO)**: Maximum acceptable data loss duration. Target: **< 1 minute** for financial/order state; **< 1 hour** for vector DB metadata.
- **Recovery Time Objective (RTO)**: Maximum acceptable service downtime. Target: **< 15 minutes** for Core Domain API availability.

---

## 2. Backup Mechanics per Storage Tier
- **MongoDB (OLTP)**: Continuous point-in-time recovery (PITR) using Oplog tailing + daily automated snapshots to AWS S3 Glacier.
- **Redis (Inventory Allocation)**: Append-Only File (AOF) with `fsync everysec` enabled. Background RDB snapshots taken every 6 hours.
- **MySQL (OLAP Warehouse)**: Daily `mysqldump` / Percona XtraBackup snapshots transferred to secondary cloud region.
- **Qdrant (Vector DB)**: Automated collection snapshots uploaded to GCS / S3. Rebuild worker script can re-sync Qdrant from MongoDB product collections if total vector index corruption occurs.

---

## 3. Disaster Recovery Scenario Checklist
- **Accidental Primary Database Deletion**: Restore MongoDB from latest S3 PITR Oplog backup; replay Kafka domain events from `order-events` offset corresponding to backup timestamp.
- **Cloud Region Outage**: Multi-Region active-passive failover: AWS Route 53 DNS failover reroutes traffic to secondary region within 60 seconds.
