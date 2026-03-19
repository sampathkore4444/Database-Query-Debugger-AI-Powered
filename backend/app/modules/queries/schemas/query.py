from pydantic import BaseModel

class QueryData(BaseModel):
    query_id: str
    raw_text: str

