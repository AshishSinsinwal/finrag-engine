from dotenv import load_dotenv
import os

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    print("WARNING: GOOGLE_API_KEY not found")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ASSET_DIR = os.path.join(BASE_DIR, "assets", "aapl-10k")
ARTIFACT_DIR = os.path.join(ASSET_DIR, "artifacts")
BM25_DIR = os.path.join(ASSET_DIR, "bm25")
BM25_FILE = os.path.join(BM25_DIR, "bm25.pkl")
TEXT_DB_DIR = os.path.join(ASSET_DIR, "chroma_text")
TABLE_DB_DIR = os.path.join(ASSET_DIR, "chroma_table")
DOCLING_JSON = os.path.join(ASSET_DIR, "docling_document.json")
DOCUMENT_HASH = os.path.join(ASSET_DIR, "document_hash.json")

EMBEDDING_MODEL = "BAAI/bge-large-en-v1.5"
GEMINI_MODEL = "gemini-2.5-flash"
FLASHRANK_MODEL = "ms-marco-MiniLM-L-12-v2"

VECTOR_TOP_K = 30
BM25_TOP_K = 30
RRF_K = 60
EXPAND_TOP_N = 15
FINAL_CONTEXTS = 5

print("=" * 80)
print("CONFIG LOADED")
print("=" * 80)
print("ASSET_DIR:")
print(ASSET_DIR)
print()
print("TEXT_DB_DIR:")
print(TEXT_DB_DIR)
print()
print("TABLE_DB_DIR:")
print(TABLE_DB_DIR)
print()
print("BM25_FILE:")
print(BM25_FILE)
print("=" * 80)