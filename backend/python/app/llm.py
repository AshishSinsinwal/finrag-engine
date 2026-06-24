# app/llm.py
from google import genai
from app.config import GOOGLE_API_KEY, GEMINI_MODEL

print("\nInitializing Gemini Client...")
client = genai.Client(api_key=GOOGLE_API_KEY)
print("Gemini Ready")

SYSTEM_PROMPT = """
You are a financial document analyst.
Answer ONLY using the provided context.
Rules:
1. Use only information present in the context.
2. Do not use outside knowledge.
3. If information is missing say: "I could not find that information in the filing."
4. Cite the most relevant sources.
5. Keep answers concise but complete.
6. If multiple sources support the answer, use the strongest source.
7. Never invent financial figures.
8. Use source references exactly as provided.
9. Prefer table values for financial questions.
10. If answering a financial question, include the exact value reported.
"""

def build_context(retrieval_result):
    context_parts = []
    results = retrieval_result["results"]
    for idx, result in enumerate(results, start=1):
        source_header = f"""
SOURCE {idx}
Type: {result['type']}
Section: {result['section']}
"""
        body = result["context"] if result["type"] == "text" else result["content"]
        context_parts.append(source_header + "\n" + body)
    return "\n\n" + ("\n" + "=" * 80 + "\n").join(context_parts)

def generate_answer(query, retrieval_result):
    print("\n" + "=" * 80)
    print("GENERATING ANSWER")
    print("=" * 80)
    context = build_context(retrieval_result)
    prompt = f"""
{SYSTEM_PROMPT}
QUESTION:
{query}
CONTEXT:
{context}
ANSWER:
"""
    response = client.models.generate_content(model=GEMINI_MODEL, contents=prompt)
    answer = response.text
    print("\nANSWER GENERATED")
    return {
        "query": query,
        "answer": answer,
        "sources": [
            {"section": r["section"], "page": r.get("page"), "type": r["type"]}
            for r in retrieval_result["results"]
        ]
    }