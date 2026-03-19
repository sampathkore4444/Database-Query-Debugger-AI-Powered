# AntiGravity.ai: End-to-End Platform Flow

This document provides a comprehensive technical breakdown of the **AntiGravity** Database Query Debugger platform. It covers the architectural design, data lifecycle, communication protocols, and operational procedures.

---

## 🏗️ Architecture: Hybrid Modular Monolith
The platform follows a **Modular Monolithic** pattern to ensure developer productivity while maintaining strict domain boundaries.

1.  **Backend (FastAPI)**: Centralized "Brain" that orchestrates data persistence, DBA rule evaluation, and AI inference.
2.  **Telemetry Agent (Go)**: A high-performance sidecar that monitors `pg_stat_statements` on the target database.
3.  **Frontend (React/Vite)**: A premium "Command Center" UI designed with a Professional Zinc aesthetic.
4.  **Local AI (Ollama)**: Local inference engine utilizing the `qwen2.5:1.5b` model for performance explanations.

---

## 📈 Detailed Phase Breakdown

### Phase 1: Core Foundation & Multi-Tenancy
- **Feature**: Modular structure (`auth`, `agents`, `queries`, `insights`).
- **Logic**: Implemented a secure JWT-based authentication layer. Each incident is strictly scoped to a `user_id` (Tenant ID) to prevent data leakage between organizations.

### Phase 2: Telemetry Sidecar (Go Agent)
- **Feature**: Real-time Monitoring.
- **Logic**: The agent (written in Go) polls the monitored Postgres database every 10 seconds. It captures queries exceeding a 50ms threshold.
- **Self-Healing**: If a query contains parameterized placeholders ($1, $2), the agent performs a "Mock Explain" fallback to ensure the pipeline never breaks.

### Phase 3: DBA Rule Engine
- **Feature**: Deterministic Issue Detection.
- **Logic**: Before hitting the AI, the backend runs a Python-based Rule Engine that inspects the PostgreSQL `Plan JSON`. 
- **Checklist**: It specifically looks for `Seq Scans` on large tables, missing indices, and high-cost `Nested Loops`.

### Phase 4: AI Enrichment (Local Ollama)
- **Feature**: Generative Performance Diagnosis.
- **Logic**: The system integrates with **Ollama** via the `/api/generate` endpoint.
- **Prompting**: We use a structured "System + User" prompt to force the AI to return a strict JSON payload containing a 2-sentence `analysis` and a copy-pasteable `sql_fix`.

### Phase 5: Query Normalization
- **Feature**: Footprint Deduplication.
- **Logic**: To prevent "Telemetry Flooding", the backend strips raw literal values (numbers, strings) using Regex and generates a SHA-256 `query_hash`.
- **Result**: Identical SQL structures are grouped together, keeping the dashboard clean.

### Phase 6: Professional UI/UX
- **Feature**: Rich Command Center.
- **Logic**: Rebuilt with **Tailwind CSS v4** and a **Zinc-950** dark palette.
- **Visuals**: Features recursive execution topology visualizers and glassmorphic KPI cards.

---

## 📡 Frontend-Backend Communication
The Frontend communicates with the Backend via a standard REST API using **Axios**.

| Endpoint | Method | Purpose | Payload Example |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | Authenticate User | `{ "username": "...", "password": "..." }` |
| `/api/v1/agents/ingest` | `POST` | Ingest Sidecar Data | `{ "tenant_id": 1, "raw_query": "...", "plan_json": {...} }` |
| `/api/v1/agents/incidents/{tid}`| `GET` | Fetch Dashboard Feed | `Returns List[QueryIncident]` |

---

## 🛠️ Operational Guide: Start & Stop

### Option A: Local Development (Without Docker)

#### **1. Start Backend**
```powershell
# In root directory
uvicorn backend.app.main:app --port 8000 --reload
```
#### **2. Start Frontend**
```powershell
cd frontend
npm install  # First time only
npm run dev
```
#### **3. Start Telemetry Agent**
```powershell
cd agent
go run .
```

---

### Option B: Using Docker (Production Simulation)

#### **1. Start Full Stack**
```powershell
docker-compose up -d
```
*This starts: The monitored Postgres, the backend Postgres, and initializes the `pg_stat_statements` trace extensions.*

#### **2. Stop Full Stack**
```powershell
docker-compose down
```

---

## 💡 How It Works (End-to-End Flow)
1.  **Capture**: Sidecar Agent sees a slow query in `pg_stat_statements`.
2.  **Explain**: Agent runs `EXPLAIN (FORMAT JSON)` on the DB and sends the result to the Backend.
3.  **Process**: Backend **Normalizes** the SQL and runs the **DBA Rule Engine**.
4.  **Diagnose**: Backend queries **Ollama (Qwen)** for a natural language explanation.
5.  **Render**: The **React Dashboard** (polling every 5s) detects the new incident and renders the stunning interactive card.
