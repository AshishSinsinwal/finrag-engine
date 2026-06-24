# app/schemas.py
from typing import List, Optional
from pydantic import BaseModel

class SearchRequest(BaseModel):
    query: str

class SummarizeRequest(BaseModel):
    query: str

class AskRequest(BaseModel):
    query: str

class SourceModel(BaseModel):
    type: str
    section: str
    page: Optional[int] = None

class RetrievalResult(BaseModel):
    type: str
    score: float
    section: str
    page: Optional[int] = None
    content: Optional[str] = None
    chunk: Optional[str] = None
    context: Optional[str] = None

class SearchResponse(BaseModel):
    query: str
    route: str
    results: List[RetrievalResult]

class SummarizeResponse(BaseModel):
    query: str
    answer: str
    sources: List[SourceModel]

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str

class ErrorResponse(BaseModel):
    error: str