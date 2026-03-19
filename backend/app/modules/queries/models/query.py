from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, ForeignKey
from datetime import datetime, timezone
from ....shared.db.session import Base

class QueryIncident(Base):
    __tablename__ = "query_incidents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=True) # nullable for backwards compat locally
    query_id = Column(String, index=True) # Hash for grouping identical queries
    raw_query = Column(String)
    normalized_query = Column(String)
    execution_time_ms = Column(Float)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Storage for rule outcomes
    plan_json = Column(JSON) # The raw explain tree
    issues_detected = Column(JSON) # Array of strings e.g. ["Seq Scan", "Missing Index"]
    
    # AI Engine Results
    ai_explanation = Column(String, nullable=True)
    sql_fix = Column(String, nullable=True)
