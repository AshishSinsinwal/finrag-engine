# app/routes.py
from fastapi import APIRouter, HTTPException
from app.schemas import SearchRequest, SearchResponse, SummarizeRequest, SummarizeResponse, HealthResponse
from app.rag_engine import FinancialRAG
from app.llm import generate_answer

router = APIRouter()
rag = FinancialRAG()

@router.get("/health", response_model=HealthResponse)
def health():
    return {"status": "healthy", "service": "financial-rag-engine", "version": "1.0.0"}

@router.post("/search", response_model=SearchResponse)
def search(request: SearchRequest):
    try:
        print("\n" + "=" * 80)
        print("SEARCH REQUEST")
        print("=" * 80)
        print(f"Query: {request.query}")
        result = rag.retrieve_context(request.query)
        print(f"Results Returned: {len(result['results'])}")
        return result
    except Exception as e:
        print("\nSEARCH ERROR")
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summarize", response_model=SummarizeResponse)
def summarize(request: SummarizeRequest):
    try:
        print("\n" + "=" * 80)
        print("SUMMARIZE REQUEST")
        print("=" * 80)
        print(f"Query: {request.query}")
        retrieval_result = rag.retrieve_context(request.query)
        response = generate_answer(request.query, retrieval_result)
        return response
    except Exception as e:
        print("\nSUMMARIZATION ERROR")
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ask")
def ask(request: SummarizeRequest):
    try:
        print("\n" + "=" * 80)
        print("ASK REQUEST")
        print("=" * 80)
        retrieval_result = rag.retrieve_context(request.query)
        response = generate_answer(request.query, retrieval_result)
        return response
    except Exception as e:
        print("\nASK ERROR")
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))