"""
Hybrid BM25 Sparse Keyword + Dense Vector Similarity Search Strategy
Combines lexical term frequencies (BM25) with semantic vector similarity via RRF rank fusion.
"""

import math
from typing import List, Dict, Any

class BM25Okapi:
    """Lightweight pure-Python BM25 implementation for sparse keyword retrieval."""
    def __init__(self, corpus: List[List[str]], k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.corpus_size = len(corpus)
        self.avgdl = sum(len(doc) for doc in corpus) / self.corpus_size if self.corpus_size > 0 else 1
        self.doc_freqs = []
        self.idf = {}
        self.doc_len = [len(doc) for doc in corpus]

        for doc in corpus:
            frequencies = {}
            for word in doc:
                frequencies[word] = frequencies.get(word, 0) + 1
            self.doc_freqs.append(frequencies)

            for word in frequencies:
                self.idf[word] = self.idf.get(word, 0) + 1

        for word, freq in self.idf.items():
            self.idf[word] = math.log((self.corpus_size - freq + 0.5) / (freq + 0.5) + 1)

    def get_scores(self, query: List[str]) -> List[float]:
        scores = [0.0] * self.corpus_size
        for word in query:
            if word not in self.idf:
                continue
            idf_score = self.idf[word]
            for idx, doc_freq in enumerate(self.doc_freqs):
                freq = doc_freq.get(word, 0)
                numerator = idf_score * freq * (self.k1 + 1)
                denominator = freq + self.k1 * (1 - self.b + self.b * (self.doc_len[idx] / self.avgdl))
                scores[idx] += numerator / denominator
        return scores


def hybrid_retrieve(query: str, documents: List[Dict[str, Any]], alpha: float = 0.5, top_k: int = 5, k_rrf: int = 60) -> List[Dict[str, Any]]:
    """
    Executes Hybrid Search combining BM25 Sparse & Dense Similarity using Reciprocal Rank Fusion (RRF).
    RRF Score = 1 / (k + rank_dense) + 1 / (k + rank_bm25).
    """
    if not documents:
        return []

    tokenized_corpus = [doc.get('content', doc.get('question', '')).lower().split() for doc in documents]
    tokenized_query = query.lower().split()

    bm25 = BM25Okapi(tokenized_corpus)
    sparse_scores = bm25.get_scores(tokenized_query)

    # Rank by BM25 sparse score
    sparse_ranked_indices = sorted(range(len(documents)), key=lambda i: sparse_scores[i], reverse=True)
    sparse_ranks = {doc_idx: rank + 1 for rank, doc_idx in enumerate(sparse_ranked_indices)}

    # Rank by Dense similarity score
    dense_ranked_indices = sorted(range(len(documents)), key=lambda i: documents[i].get('score', 0.5), reverse=True)
    dense_ranks = {doc_idx: rank + 1 for rank, doc_idx in enumerate(dense_ranked_indices)}

    results = []
    max_sparse = max(sparse_scores) if sparse_scores and max(sparse_scores) > 0 else 1.0

    for idx, doc in enumerate(documents):
        norm_sparse = sparse_scores[idx] / max_sparse
        dense_score = doc.get('score', 0.5)
        
        # Scale-free Reciprocal Rank Fusion (RRF)
        rrf_score = (1.0 / (k_rrf + dense_ranks[idx])) + (1.0 / (k_rrf + sparse_ranks[idx]))

        results.append({
            **doc,
            "sparse_score": round(norm_sparse, 4),
            "dense_score": round(dense_score, 4),
            "rrf_score": round(rrf_score, 6),
            "hybrid_score": round(alpha * dense_score + (1 - alpha) * norm_sparse, 4)
        })

    results.sort(key=lambda x: x['rrf_score'], reverse=True)
    return results[:top_k]
