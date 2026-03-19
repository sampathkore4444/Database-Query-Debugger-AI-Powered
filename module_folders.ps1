Write-Host "Re-organizing modules into subfolders..."

$modules = @("queries", "agents", "insights")

foreach ($mod in $modules) {
    # Create subfolders
    New-Item -ItemType Directory -Force "backend\app\modules\$mod\models" | Out-Null
    New-Item -ItemType Directory -Force "backend\app\modules\$mod\schemas" | Out-Null
    New-Item -ItemType Directory -Force "backend\app\modules\$mod\services" | Out-Null
    
    # Create init files
    Set-Content -Path "backend\app\modules\$mod\models\__init__.py" -Value ""
    Set-Content -Path "backend\app\modules\$mod\schemas\__init__.py" -Value ""
    Set-Content -Path "backend\app\modules\$mod\services\__init__.py" -Value ""

    # Delete old .py files if they exist (we'll recreate them inside folders)
    if (Test-Path "backend\app\modules\$mod\models.py") { Remove-Item "backend\app\modules\$mod\models.py" -Force }
    if (Test-Path "backend\app\modules\$mod\schemas.py") { Remove-Item "backend\app\modules\$mod\schemas.py" -Force }
    if (Test-Path "backend\app\modules\$mod\services.py") { Remove-Item "backend\app\modules\$mod\services.py" -Force }
}

# Queries module
Set-Content -Path "backend\app\modules\queries\models\query.py" -Value "# SQLAlchemy models for queries and execution stats`r`n"
Set-Content -Path "backend\app\modules\queries\schemas\query.py" -Value "from pydantic import BaseModel`r`n`r`nclass QueryData(BaseModel):`r`n    query_id: str`r`n    raw_text: str`r`n"
Set-Content -Path "backend\app\modules\queries\services\query_service.py" -Value "# Business logic for query normalization and rule checking`r`n"

# Agents module
Set-Content -Path "backend\app\modules\agents\models\agent.py" -Value "# SQLAlchemy models for agents`r`n"
Set-Content -Path "backend\app\modules\agents\schemas\agent.py" -Value "from pydantic import BaseModel`r`n`r`nclass AgentPayload(BaseModel):`r`n    agent_id: str`r`n    plan_data: dict`r`n"
Set-Content -Path "backend\app\modules\agents\services\ingestion.py" -Value "# Ingest payloads from Go agents, place into queues`r`n"

# Insights module
Set-Content -Path "backend\app\modules\insights\models\insight.py" -Value "# SQLAlchemy models for insights`r`n"
Set-Content -Path "backend\app\modules\insights\schemas\insight.py" -Value "from pydantic import BaseModel`r`n`r`nclass InsightResponse(BaseModel):`r`n    analysis: str`r`n    sql_fix: str`r`n"
Set-Content -Path "backend\app\modules\insights\services\llm_service.py" -Value "# LLM Integration Logic to explain query plans`r`n"

Write-Host "Modules re-organized successfully!"
