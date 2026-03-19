from pydantic import BaseModel
from typing import Any, Dict, List

class AgentPayload(BaseModel):
    tenant_id: int = 1
    query_id: str
    raw_query: str
    normalized_query: str
    execution_time_ms: float
    plan_json: List[Dict[str, Any]] # Postgres EXPLAIN (FORMAT JSON) standard output
