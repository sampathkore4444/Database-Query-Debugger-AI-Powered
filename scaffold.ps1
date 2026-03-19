# Scaffolding Backend (Python FastAPI)
Write-Host "Setting up Backend Structure..."
$backendDirs = @(
    "backend\app",
    "backend\app\core",
    "backend\app\common",
    "backend\app\api",
    "backend\app\api\v1",
    "backend\app\api\v1\endpoints",
    "backend\app\models",
    "backend\app\schemas",
    "backend\app\services",
    "backend\app\db"
)

foreach ($dir in $backendDirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

$backendFiles = @{
    "backend\app\__init__.py" = ""
    "backend\app\main.py" = "from fastapi import FastAPI`r`n`r`napp = FastAPI(title='AI Database Query Debugger')`r`n`r`n@app.get('/health')`r`ndef health_check():`r`n    return {'status': 'healthy'}`r`n"
    "backend\app\core\config.py" = "class Settings:`r`n    PROJECT_NAME: str = 'Query Debugger'`r`n`r`nsettings = Settings()`r`n"
    "backend\app\core\security.py" = "# Security components, JWT, Hash functions`r`n"
    "backend\app\common\logger.py" = "import logging`r`n`r`nlogging.basicConfig(level=logging.INFO)`r`nlogger = logging.getLogger(__name__)`r`n"
    "backend\app\api\v1\api_router.py" = "from fastapi import APIRouter`r`nfrom .endpoints import queries`r`n`r`napi_router = APIRouter()`r`napi_router.include_router(queries.router, prefix='/queries', tags=['queries'])`r`n"
    "backend\app\api\v1\endpoints\queries.py" = "from fastapi import APIRouter`r`n`r`nrouter = APIRouter()`r`n`r`n@router.get('/')`r`ndef list_slow_queries():`r`n    return []`r`n"
    "backend\app\models\query.py" = "# SQLAlchemy models representing exact DB structure`r`n"
    "backend\app\schemas\query.py" = "from pydantic import BaseModel`r`n`r`nclass QueryBase(BaseModel):`r`n    query_id: str`r`n    raw_query: str`r`n"
    "backend\app\services\analyzer.py" = "# AI / LLM orchestration for querying OpenAI or Anthropic`r`n"
    "backend\app\services\rule_engine.py" = "# Deterministic rules for analyzing Postgres EXPLAIN plans`r`n"
    "backend\app\db\session.py" = "# Postgres SQLAlchemy engine, connection pool, and sessionmaker`r`n"
    "backend\requirements.txt" = "fastapi==0.104.1`r`nuvicorn==0.23.2`r`npydantic==2.4.2`r`nsqlalchemy==2.0.23`r`n"
}

foreach ($file in $backendFiles.GetEnumerator()) {
    Set-Content -Path $file.Name -Value $file.Value
}


# Scaffolding Frontend (React + Vite)
Write-Host "Setting up Frontend Structure with Vite (React) and Tailwind CSS..."

# Use npx to create the vite project directly
Invoke-Expression "npx -y create-vite@latest frontend --template react"

# We must CD to frontend to install deps
Push-Location -Path frontend

# Install basic dependencies and Tailwind
Invoke-Expression "npm install"
Invoke-Expression "npm install -D tailwindcss postcss autoprefixer"
Invoke-Expression "npx tailwindcss init -p"

# Setup Tailwind Config to read components
$tailwindConfig = @"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
"@
Set-Content -Path "tailwind.config.js" -Value $tailwindConfig

# Inject Tailwind directives into index.css
$indexCss = @"
@tailwind base;
@tailwind components;
@tailwind utilities;
"@
Set-Content -Path "src\index.css" -Value $indexCss

Pop-Location

# Create highly-reusable frontend folder structure
$frontendDirs = @(
    "frontend\src\components",
    "frontend\src\components\common",   # Base atomic UI elements
    "frontend\src\components\layout",   # Layout wrappers
    "frontend\src\components\queries",  # Domain specific
    "frontend\src\hooks",
    "frontend\src\services",
    "frontend\src\utils",
    "frontend\src\pages"
)

foreach ($dir in $frontendDirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

$frontendFiles = @{
    "frontend\src\components\common\Button.jsx" = "export default function Button({ children, onClick, variant = 'primary' }) {`r`n    const base = 'px-4 py-2 rounded font-medium transition-colors';`r`n    const styles = variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800';`r`n    return <button onClick={onClick} className={`${base} ${styles}`}>{children}</button>;`r`n}"
    "frontend\src\components\common\Card.jsx" = "export default function Card({ children, title }) {`r`n    return <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>`r`n        {title && <h3 className='text-lg font-bold mb-4'>{title}</h3>}`r`n        {children}`r`n    </div>;`r`n}"
    "frontend\src\components\common\Badge.jsx" = "export default function Badge({ text, color = 'gray' }) {`r`n    return <span className={`bg-${color}-100 text-${color}-800 text-xs px-2 py-1 rounded font-semibold`}>{text}</span>;`r`n}"
    "frontend\src\components\layout\DashboardLayout.jsx" = "import Sidebar from './Sidebar';`r`nimport Header from './Header';`r`nexport default function DashboardLayout({ children }) {`r`n    return <div className='flex h-screen bg-gray-50 text-gray-900'>`r`n        <Sidebar />`r`n        <div className='flex flex-col flex-1 overflow-hidden'>`r`n            <Header />`r`n            <main className='flex-1 overflow-y-auto p-6'>`r`n                {children}`r`n            </main>`r`n        </div>`r`n    </div>;`r`n}"
    "frontend\src\components\layout\Sidebar.jsx" = "export default function Sidebar() {`r`n    return <aside className='w-64 bg-slate-900 text-white flex flex-col'>`r`n        <div className='h-16 flex items-center px-6 font-black text-xl border-b border-slate-800 text-blue-400'>AntiGravity AI</div>`r`n        <nav className='flex-1 p-4'>`r`n            <div className='py-2 px-3 bg-slate-800 rounded mb-2 text-sm font-medium'>Query Inbox</div>`r`n            <div className='py-2 px-3 hover:bg-slate-800 rounded text-sm text-slate-300 font-medium cursor-pointer'>Settings</div>`r`n        </nav>`r`n    </aside>;`r`n}"
    "frontend\src\components\layout\Header.jsx" = "export default function Header() {`r`n    return <header className='h-16 bg-white border-b flex items-center justify-between px-6'>`r`n        <div className='text-lg font-semibold'>Dashboard</div>`r`n        <div className='bg-gray-100 p-2 rounded-full text-sm font-medium'>Admin</div>`r`n    </header>;`r`n}"
    "frontend\src\components\queries\QueryIncidentCard.jsx" = "import Card from '../common/Card';`r`nimport Badge from '../common/Badge';`r`nexport default function QueryIncidentCard({ query }) {`r`n    return <Card title='Slow Sequence Scan Detected'>`r`n        <p className='text-gray-600 mb-4'>Users table was scanned without an index on the email column.</p>`r`n        <div className='flex gap-2'>`r`n            <Badge text='Critical' color='red' />`r`n            <Badge text='Table: users' color='blue' />`r`n        </div>`r`n    </Card>;`r`n}"
    "frontend\src\pages\InboxPage.jsx" = "import DashboardLayout from '../components/layout/DashboardLayout';`r`nimport QueryIncidentCard from '../components/queries/QueryIncidentCard';`r`nexport default function InboxPage() {`r`n    return <DashboardLayout>`r`n        <div className='flex justify-between items-center mb-6'>`r`n            <h1 className='text-2xl font-bold'>Query Triage Inbox</h1>`r`n        </div>`r`n        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>`r`n            <QueryIncidentCard />`r`n        </div>`r`n    </DashboardLayout>;`r`n}"
    "frontend\src\services\api.js" = "export const API_BASE = 'http://localhost:8000/api/v1';`r`n`r`nexport async function getHealth() {`r`n    const res = await fetch(`${API_BASE}/health`);`r`n    return res.json();`r`n}"
    "frontend\src\utils\formatters.js" = "export function formatMs(ms) { return `${parseFloat(ms).toFixed(2)}ms`; }"
    "frontend\src\App.jsx" = "import InboxPage from './pages/InboxPage';`r`n`r`nfunction App() {`r`n  return <InboxPage />;`r`n}`r`n`r`nexport default App;"
}

foreach ($file in $frontendFiles.GetEnumerator()) {
    Set-Content -Path $file.Name -Value $file.Value
}

Write-Host "Scaffolding Complete! Backend and Frontend directories are ready."
