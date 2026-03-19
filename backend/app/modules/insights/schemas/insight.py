from pydantic import BaseModel

class InsightResponse(BaseModel):
    analysis: str
    sql_fix: str

