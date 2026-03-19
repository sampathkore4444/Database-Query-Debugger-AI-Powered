import os
import json
import urllib.request
import urllib.error
from ..schemas.insight import InsightResponse

OLLAMA_URL = os.getenv("OLLAMA_API_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:1.5b")

def generate_insight(query: str, issues: list[str], plan_json: list) -> dict:
    """Uses local Ollama (qwen2.5) to explain DBA rule triggers and the raw plan in plain English."""
    
    system_prompt = """
    You are an expert PostgreSQL Database Administrator. 
    You are given a slow query, any deterministic rule issues the agent found, and the full EXPLAIN (FORMAT JSON) tree.
    Your job is to diagnose the performance bottleneck in exactly 2 clear sentences.
    Then, provide the exact, copy-pasteable SQL command (DDL or query rewrite) to fix it.
    
    Respond STRICTLY in JSON format with exactly two keys: "analysis" and "sql_fix".
    Do not wrap the JSON in markdown blocks, just return the raw JSON text.
    """
    
    user_text = f"Query: {query}\nFound Issues: {issues}\nPlan JSON: {json.dumps(plan_json)}"
    
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": f"System: {system_prompt}\nUser: {user_text}",
        "stream": False,
        "format": "json"
    }
    
    try:
        req = urllib.request.Request(
            f"{OLLAMA_URL}/api/generate",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode("utf-8"))
            content = json.loads(result.get("response", "{}"))
            
            return {
                "analysis": content.get("analysis", "Ollama analysis failed formatting."),
                "sql_fix": content.get("sql_fix", "-- No fix found.")
            }
    except Exception as e:
        print(f"Ollama API Error: {e}")
        return _mock_insight(query, issues)


def _mock_insight(query: str, issues: list[str]) -> dict:
    """Mock responder for local dev if Ollama is unreachable."""
    if not issues:
        return {
            "analysis": "This query looks fine based on current rules. No immediate bottleneck.",
            "sql_fix": "-- No changes required"
        }
        
    issue_text = "; ".join(issues)
    return {
        "analysis": f"[MOCK AI] The Rule Engine found: {issue_text}. Normally Ollama ({OLLAMA_MODEL}) would elaborate beautifully here, but the local inference server was unreachable.",
        "sql_fix": "CREATE INDEX CONCURRENTLY idx_mock_suggested ON mock_table (mock_column);"
    }
