from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from ...shared.db.session import get_db
from ..auth.services.auth_service import get_current_user
from .models.query import QueryIncident

router = APIRouter(tags=['Queries'])

@router.get('/inbox')
def get_query_inbox(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Fetches real-time slow query incidents for the dashboard."""
    incidents = db.query(QueryIncident).order_by(desc(QueryIncident.timestamp)).limit(50).all()
    return incidents
