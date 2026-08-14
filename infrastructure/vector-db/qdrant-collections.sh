#!/bin/bash

# Configuration
QDRANT_HOST=${QDRANT_HOST:-"localhost"}
QDRANT_PORT=${QDRANT_PORT:-"6333"}
QDRANT_URL="http://${QDRANT_HOST}:${QDRANT_PORT}"

echo "⚡ Initializing Qdrant Vector Collections for AI Search..."

# 1. Create collection for CLIP Visual Search Vectors (512 dimensions, Cosine distance)
echo "\n[1/2] Creating 'products_visual' collection (512 dims, Cosine)..."
curl -X PUT "${QDRANT_URL}/collections/products_visual" \
  -H 'Content-Type: application/json' \
  -d '{
    "vectors": {
      "size": 512,
      "distance": "Cosine"
    },
    "hnsw_config": {
      "ef_construct": 100,
      "m": 16
    }
  }'

# 2. Create collection for Support Knowledge Base Q&A Vectors (384 dimensions, Cosine distance)
echo "\n[2/2] Creating 'support_faq' collection (384 dims, Cosine)..."
curl -X PUT "${QDRANT_URL}/collections/support_faq" \
  -H 'Content-Type: application/json' \
  -d '{
    "vectors": {
      "size": 384,
      "distance": "Cosine"
    }
  }'

echo "\n🎉 Vector database initialization complete!"
