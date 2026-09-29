"""
Document Chunking Utility for RAG Knowledge Ingestion
Supports text, markdown, json, and specs with configurable chunk sizes and sliding windows.
"""

import re
from typing import List, Dict, Any

class DocumentChunker:
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_text(self, text: str, doc_id: str, source: str = "upload") -> List[Dict[str, Any]]:
        """Splits raw text into sliding window chunks with metadata tags."""
        text = re.sub(r'\s+', ' ', text).strip()
        chunks = []
        start = 0
        text_len = len(text)
        chunk_idx = 0

        while start < text_len:
            end = start + self.chunk_size
            chunk_content = text[start:end]
            
            # Try to break on sentence boundary if possible
            if end < text_len:
                last_period = chunk_content.rfind('.')
                if last_period > self.chunk_size // 2:
                    end = start + last_period + 1
                    chunk_content = text[start:end]

            chunk_id = f"{doc_id}_chunk_{chunk_idx}"
            chunks.append({
                "id": chunk_id,
                "doc_id": doc_id,
                "source": source,
                "chunk_index": chunk_idx,
                "content": chunk_content,
                "length": len(chunk_content)
            })

            start += (self.chunk_size - self.chunk_overlap)
            chunk_idx += 1

        return chunks

chunker = DocumentChunker()
