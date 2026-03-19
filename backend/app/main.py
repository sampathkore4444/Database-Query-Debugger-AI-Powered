from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .modules.queries.router import router as queries_router
from .modules.agents.router import router as agents_router
from .modules.auth.router import router as auth_router
from .shared.db.session import engine, Base
from .modules.queries.models.query import QueryIncident

# Create tables for MVP automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(title='AI Database Query Debugger (Modular Monolith)')

# CORS Configuration for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(queries_router, prefix='/api/v1/queries')
app.include_router(agents_router, prefix='/api/v1/agents')
app.include_router(auth_router)
