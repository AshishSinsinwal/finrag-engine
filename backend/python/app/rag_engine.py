# app/rag_engine.py
import pickle
import re
from rank_bm25 import BM25Okapi
import os
from langchain_huggingface import HuggingFaceEndpointEmbeddings
from langchain_chroma import Chroma
#from langchain_huggingface import HuggingFaceEmbeddings
from app.config import (
    EMBEDDING_MODEL, TEXT_DB_DIR, TABLE_DB_DIR, BM25_FILE, ARTIFACT_DIR,
    VECTOR_TOP_K, BM25_TOP_K, RRF_K
)
from app.retrieval import get_section_page
from app.state import state


class FinancialRAG:
    def __init__(self):
        pass

    def load_assets(self):
        print("\n" + "=" * 80)
        print("LOADING FINANCIAL RAG ASSETS")
        print("=" * 80)
        self._load_embeddings()
        self._load_artifacts()
        self._load_bm25()
        self._load_chroma()
        self._build_lookups()
        print("=" * 80)
        print("ALL ASSETS LOADED")
        print("=" * 80)

    # ==========================================================
    # EMBEDDINGS (UPDATED FOR CLOUD DEPLOYMENT)
    # ==========================================================

    def _load_embeddings(self):
        print("\nLoading Embeddings...")

        hf_token = os.environ.get("HF_TOKEN")

        if hf_token:
            print("Using Hugging Face Inference API (Zero-RAM Mode)")
            self.embeddings = HuggingFaceEndpointEmbeddings(
                model=EMBEDDING_MODEL,
                task="feature-extraction",
                huggingfacehub_api_token=hf_token
            )
        else:
            print("WARNING: No HF_TOKEN found. Using Local CPU mode (May crash on free tiers!)")
            from langchain_huggingface import HuggingFaceEmbeddings
            self.embeddings = HuggingFaceEmbeddings(
                model_name=EMBEDDING_MODEL,
                model_kwargs={"device": "cpu"},
                encode_kwargs={"normalize_embeddings": True}
            )

        # Make sure to assign it to your state object as you did before
        state.embeddings = self.embeddings
        print("Embeddings Loaded")

    def _load_artifacts(self):
        print("\nLoading Artifacts...")
        with open(f"{ARTIFACT_DIR}/parents.pkl", "rb") as f:
            state.parents = pickle.load(f)
        with open(f"{ARTIFACT_DIR}/child_chunks.pkl", "rb") as f:
            state.child_chunks = pickle.load(f)
        with open(f"{ARTIFACT_DIR}/table_chunks.pkl", "rb") as f:
            state.table_chunks = pickle.load(f)
        print(f"Parents Loaded: {len(state.parents)}")
        print(f"Child Chunks Loaded: {len(state.child_chunks)}")
        print(f"Table Chunks Loaded: {len(state.table_chunks)}")

    def _load_bm25(self):
        print("\nLoading BM25...")
        with open(BM25_FILE, "rb") as f:
            state.bm25_index, state.bm25_corpus = pickle.load(f)
        print(f"BM25 Corpus Loaded: {len(state.bm25_corpus)}")

    def _load_chroma(self):
        print("\nLoading Chroma Text DB...")
        state.text_store = Chroma(
            persist_directory=TEXT_DB_DIR,
            embedding_function=state.embeddings,
            collection_name="financial_text"
        )
        print(f"Text Collection Count: {state.text_store._collection.count()}")
        print("\nLoading Chroma Table DB...")
        state.table_store = Chroma(
            persist_directory=TABLE_DB_DIR,
            embedding_function=state.embeddings,
            collection_name="financial_tables"
        )
        print(f"Table Collection Count: {state.table_store._collection.count()}")

    def _build_lookups(self):
        print("\nBuilding Lookups...")
        state.parent_lookup = {parent["parent_id"]: parent for parent in state.parents}
        state.chunk_lookup = {chunk["content"]: chunk for chunk in state.child_chunks}
        state.table_lookup = {table["content"]: table for table in state.table_chunks}
        state.chunk_index_lookup = {}
        for chunk in state.child_chunks:
            state.chunk_index_lookup[(chunk["parent_id"], chunk["chunk_index"])] = chunk
        print("Lookups Built")

    def classify_query(self, query):
        financial_keywords = {
            "revenue", "sales", "net sales", "operating income", "income",
            "earnings", "eps", "cash flow", "gross margin", "expenses",
            "balance sheet", "inventory", "deferred revenue", "net income"
        }
        q = query.lower()
        for keyword in financial_keywords:
            if keyword in q:
                return "table"
        return "text"

    def vector_search(self, query, route):
        print("\nRunning Vector Search")
        store = state.table_store if route == "table" else state.text_store
        docs = store.similarity_search_with_score(query, k=VECTOR_TOP_K)
        results = []
        for doc, score in docs:
            results.append({"content": doc.page_content, "metadata": doc.metadata, "score": float(score)})
        print(f"Vector Results: {len(results)}")
        return results

    def bm25_search(self, query):
        print("\nRunning BM25 Search")
        tokens = re.findall(r"\w+", query.lower())
        scores = state.bm25_index.get_scores(tokens)
        ranked = sorted(enumerate(scores), key=lambda x: x[1], reverse=True)
        results = []
        for idx, score in ranked[:BM25_TOP_K]:
            results.append({"content": state.bm25_corpus[idx], "score": float(score)})
        print(f"BM25 Results: {len(results)}")
        return results

    def reciprocal_rank_fusion(self, vector_results, bm25_results, k=RRF_K):
        print("\nRunning RRF")
        fused = {}
        for rank, result in enumerate(vector_results):
            content = result["content"]
            fused.setdefault(content, 0)
            fused[content] += 1 / (k + rank + 1)
        for rank, result in enumerate(bm25_results):
            content = result["content"]
            fused.setdefault(content, 0)
            fused[content] += 1 / (k + rank + 1)
        ranked = sorted(fused.items(), key=lambda x: x[1], reverse=True)
        print(f"RRF Results: {len(ranked)}")
        return ranked

    def get_neighbor_context(self, chunk):
        parent_id = chunk["parent_id"]
        chunk_index = chunk["chunk_index"]
        contexts = []
        for offset in [-1, 0, 1]:
            key = (parent_id, chunk_index + offset)
            if key in state.chunk_index_lookup:
                contexts.append(state.chunk_index_lookup[key]["content"])
        return "\n\n".join(contexts)

    def expand_context(self, fused_results, route):
        print("inside the expand_context function")
        expanded = []
        for content, score in fused_results[:15]:
            if route == "table":
                table = state.table_lookup.get(content)
                if not table:
                    continue
                expanded.append({
                    "type": "table",
                    "score": score,
                    "section": f"Table Page {table.get('page')}",
                    "page": table.get("page"),
                    "content": table["content"]
                })
            else:
                chunk = state.chunk_lookup.get(content)
                if not chunk:
                    continue
                expanded.append({
                    "type": "text",
                    "score": score,
                    "section": chunk.get("section"),
                    "page": get_section_page(chunk["section"]),
                    "chunk": chunk["content"],
                    "context": self.get_neighbor_context(chunk)
                })
        print(f"Expanded Results: {len(expanded)} + {expanded[0]['page']}")
        return expanded

    def retrieve_context(self, query):
        print("\n" + "=" * 80)
        print(f"QUERY: {query}")
        print("=" * 80)
        route = self.classify_query(query)
        print(f"Route Selected: {route}")
        vector_results = self.vector_search(query, route)
        bm25_results = self.bm25_search(query)
        fused_results = self.reciprocal_rank_fusion(vector_results, bm25_results)
        expanded_results = self.expand_context(fused_results, route)
        return {"query": query, "route": route, "results": expanded_results}