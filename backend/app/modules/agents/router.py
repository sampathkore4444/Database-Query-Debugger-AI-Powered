from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...shared.db.session import get_db
from .schemas.agent import AgentPayload
from ..queries.models.query import QueryIncident
from datetime import datetime, timezone

from ..queries.services.query_service import evaluate_rules, normalize_sql, generate_query_hash
from ..insights.services.llm_service import generate_insight

router = APIRouter(tags=['Agents'])

@router.post('/ingest')
def ingest_agent_data(payload: AgentPayload, db: Session = Depends(get_db)):
    """Receives query execution plans from a Postgres sidecar agent."""
    
    # 1. Processing Pipeline: Evaluate deterministic DBA rules
    issues_detected = evaluate_rules(payload.plan_json)
    
    # 2. Extract Structural Normalization Metrics
    norm_sql = normalize_sql(payload.raw_query)
    deterministic_id = generate_query_hash(norm_sql)

    # 3. AI Pipeline: Generate human explanation based on normalized footprint
    ai_result = generate_insight(norm_sql, issues_detected, payload.plan_json)
    
    # 4. Save to DB
    incident = QueryIncident(
        user_id=payload.tenant_id,
        query_id=deterministic_id,
        raw_query=payload.raw_query,
        normalized_query=norm_sql,
        execution_time_ms=payload.execution_time_ms,
        plan_json=payload.plan_json,
        issues_detected=issues_detected,
        ai_explanation=ai_result["analysis"],
        sql_fix=ai_result["sql_fix"],
        timestamp=datetime.now(timezone.utc)
    )
    
    db.add(incident)
    db.commit()
    db.refresh(incident)
    
    return {"status": "ingested", "incident_id": incident.id}
