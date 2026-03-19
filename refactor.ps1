Write-Host "Refactoring to Modular Monolith..."
$layersToRemove = @(
    "backend\app\api",
    "backend\app\models",
    "backend\app\schemas",
    "backend\app\services",
    "backend\app\db",
    "backend\app\common"
)

foreach ($layer in $layersToRemove) {
    if (Test-Path $layer) {
        Remove-Item -Path $layer -Recurse -Force
    }
}

$modulesToCreate = @(
    "backend\app\shared\db",
    "backend\app\shared\logging",
    "backend\app\modules\queries",
    "backend\app\modules\agents",
    "backend\app\modules\insights"
)
foreach ($mod in $modulesToCreate) {
    New-Item -ItemType Directory -Force -Path $mod | Out-Null
}

$refactoredFiles = @{
    "backend\app\main.py" = "from fastapi import FastAPI`r`nfrom .modules.queries.router import router as queries_router`r`nfrom .modules.agents.router import router as agents_router`r`n`r`napp = FastAPI(title='AI Database Query Debugger (Modular Monolith)')`r`n`r`napp.include_router(queries_router, prefix='/api/v1/queries')`r`napp.include_router(agents_router, prefix='/api/v1/agents')`r`n"
    "backend\app\shared\db\session.py" = "# Database connection pool and sessionmaker`r`n"
    "backend\app\shared\logging\logger.py" = "# Central logger configuration`r`n"
    "backend\app\modules\__init__.py" = ""
    # Insights Module (AI Explanations)
    "backend\app\modules\insights\__init__.py" = ""
    "backend\app\modules\insights\schemas.py" = "from pydantic import BaseModel`r`n`r`nclass InsightResponse(BaseModel):`r`n    analysis: str`r`n    sql_fix: str`r`n"
    "backend\app\modules\insights\services.py" = "# LLM Integration Logic to explain query plans`r`n"
    # Queries Module (Core Query rules / ranking)
    "backend\app\modules\queries\__init__.py" = ""
    "backend\app\modules\queries\models.py" = "# SQLAlchemy models for queries and execution stats`r`n"
    "backend\app\modules\queries\schemas.py" = "from pydantic import BaseModel`r`n`r`nclass QueryData(BaseModel):`r`n    query_id: str`r`n    raw_text: str`r`n"
    "backend\app\modules\queries\services.py" = "# Business logic for query normalization and rule checking`r`n"
    "backend\app\modules\queries\router.py" = "from fastapi import APIRouter`r`n`r`nrouter = APIRouter(tags=['Queries'])`r`n`r`n@router.get('/inbox')`r`ndef get_query_inbox():`r`n    return []`r`n"
    # Agents Module (Ingestion API for sidecars)
    "backend\app\modules\agents\__init__.py" = ""
    "backend\app\modules\agents\schemas.py" = "from pydantic import BaseModel`r`n`r`nclass AgentPayload(BaseModel):`r`n    agent_id: str`r`n    plan_data: dict`r`n"
    "backend\app\modules\agents\services.py" = "# Ingest payloads from Go agents, place into queues`r`n"
    "backend\app\modules\agents\router.py" = "from fastapi import APIRouter`r`n`r`nrouter = APIRouter(tags=['Agents'])`r`n`r`n@router.post('/ingest')`r`ndef ingest_agent_data():`r`n    return {'status': 'ingested'}`r`n"
}

foreach ($file in $refactoredFiles.GetEnumerator()) {
    Set-Content -Path $file.Name -Value $file.Value
}
Write-Host "Modular Monolith structure created successfully!"
