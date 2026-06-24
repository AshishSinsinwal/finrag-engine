# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.routes import router, rag

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\n" + "=" * 80)
    print("FINANCIAL RAG ENGINE STARTING")
    print("=" * 80)
    try:
        rag.load_assets()
        print("\n" + "=" * 80)
        print("RAG ENGINE READY")
        print("=" * 80)
    except Exception as e:
        print("\n" + "=" * 80)
        print("STARTUP FAILED")
        print("=" * 80)
        print(str(e))
        raise e
    yield
    print("\n" + "=" * 80)
    print("FINANCIAL RAG ENGINE SHUTDOWN")
    print("=" * 80)

app = FastAPI(
    title="Financial RAG Engine",
    description="SEC Filing Retrieval Augmented Generation Service",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(router, tags=["Financial RAG"])

@app.get("/")
def root():
    return {
        "message": "Financial RAG Engine Running",
        "docs": "/docs",
        "health": "/health"
    }