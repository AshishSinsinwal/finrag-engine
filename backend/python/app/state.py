# app/state.py

class AppState:

    def __init__(self):

        # =====================================================
        # EMBEDDINGS
        # =====================================================

        self.embeddings = None

        # =====================================================
        # VECTOR STORES
        # =====================================================

        self.text_store = None

        self.table_store = None

        # =====================================================
        # BM25
        # =====================================================

        self.bm25_index = None

        self.bm25_corpus = None

        # =====================================================
        # DOCUMENT ARTIFACTS
        # =====================================================

        self.parents = None

        self.child_chunks = None

        self.table_chunks = None

        # =====================================================
        # LOOKUPS
        # =====================================================

        self.parent_lookup = {}

        self.chunk_lookup = {}

        self.table_lookup = {}

        self.chunk_index_lookup = {}

        # =====================================================
        # FLASHRANK
        # =====================================================

        self.ranker = None


state = AppState()