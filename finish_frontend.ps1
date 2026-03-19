Push-Location -Path "c:\Users\IT\LomaWorkspace\Python\Opencode\AI-powered Database Query Debugger - Antigravity\frontend"
Invoke-Expression "npm install -D tailwindcss postcss autoprefixer"
Invoke-Expression "npx tailwindcss init -p"

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

$indexCss = @"
@tailwind base;
@tailwind components;
@tailwind utilities;
"@
Set-Content -Path "src\index.css" -Value $indexCss

$frontendDirs = @(
    "src\components",
    "src\components\common",
    "src\components\layout",
    "src\components\queries",
    "src\hooks",
    "src\services",
    "src\utils",
    "src\pages"
)
foreach ($dir in $frontendDirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

$frontendFiles = @{
    "src\components\common\Button.jsx" = "export default function Button({ children, onClick, variant = 'primary' }) {" + [Environment]::NewLine + "    const base = 'px-4 py-2 rounded font-medium transition-colors';" + [Environment]::NewLine + "    const styles = variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800';" + [Environment]::NewLine + "    return <button onClick={onClick} className={`${base} ${styles}`}>{children}</button>;" + [Environment]::NewLine + "}"
    "src\components\common\Card.jsx" = "export default function Card({ children, title }) {" + [Environment]::NewLine + "    return <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>" + [Environment]::NewLine + "        {title && <h3 className='text-lg font-bold mb-4'>{title}</h3>}" + [Environment]::NewLine + "        {children}" + [Environment]::NewLine + "    </div>;" + [Environment]::NewLine + "}"
    "src\components\common\Badge.jsx" = "export default function Badge({ text, color = 'gray' }) {" + [Environment]::NewLine + "    return <span className={`bg-`+`$color`+`-100 text-`+`$color`+`-800 text-xs px-2 py-1 rounded font-semibold`}>{text}</span>;" + [Environment]::NewLine + "}"
    "src\components\layout\DashboardLayout.jsx" = "import Sidebar from './Sidebar';" + [Environment]::NewLine + "import Header from './Header';" + [Environment]::NewLine + "export default function DashboardLayout({ children }) {" + [Environment]::NewLine + "    return <div className='flex h-screen bg-gray-50 text-gray-900'>" + [Environment]::NewLine + "        <Sidebar />" + [Environment]::NewLine + "        <div className='flex flex-col flex-1 overflow-hidden'>" + [Environment]::NewLine + "            <Header />" + [Environment]::NewLine + "            <main className='flex-1 overflow-y-auto p-6'>" + [Environment]::NewLine + "                {children}" + [Environment]::NewLine + "            </main>" + [Environment]::NewLine + "        </div>" + [Environment]::NewLine + "    </div>;" + [Environment]::NewLine + "}"
    "src\components\layout\Sidebar.jsx" = "export default function Sidebar() {" + [Environment]::NewLine + "    return <aside className='w-64 bg-slate-900 text-white flex flex-col'>" + [Environment]::NewLine + "        <div className='h-16 flex items-center px-6 font-black text-xl border-b border-slate-800 text-blue-400'>AntiGravity AI</div>" + [Environment]::NewLine + "        <nav className='flex-1 p-4'>" + [Environment]::NewLine + "            <div className='py-2 px-3 bg-slate-800 rounded mb-2 text-sm font-medium'>Query Inbox</div>" + [Environment]::NewLine + "            <div className='py-2 px-3 hover:bg-slate-800 rounded text-sm text-slate-300 font-medium cursor-pointer'>Settings</div>" + [Environment]::NewLine + "        </nav>" + [Environment]::NewLine + "    </aside>;" + [Environment]::NewLine + "}"
    "src\components\layout\Header.jsx" = "export default function Header() {" + [Environment]::NewLine + "    return <header className='h-16 bg-white border-b flex items-center justify-between px-6'>" + [Environment]::NewLine + "        <div className='text-lg font-semibold'>Dashboard</div>" + [Environment]::NewLine + "        <div className='bg-gray-100 p-2 rounded-full text-sm font-medium'>Admin</div>" + [Environment]::NewLine + "    </header>;" + [Environment]::NewLine + "}"
    "src\components\queries\QueryIncidentCard.jsx" = "import Card from '../common/Card';" + [Environment]::NewLine + "import Badge from '../common/Badge';" + [Environment]::NewLine + "export default function QueryIncidentCard({ query }) {" + [Environment]::NewLine + "    return <Card title='Slow Sequence Scan Detected'>" + [Environment]::NewLine + "        <p className='text-gray-600 mb-4'>Users table was scanned without an index on the email column.</p>" + [Environment]::NewLine + "        <div className='flex gap-2'>" + [Environment]::NewLine + "            <Badge text='Critical' color='red' />" + [Environment]::NewLine + "            <Badge text='Table: users' color='blue' />" + [Environment]::NewLine + "        </div>" + [Environment]::NewLine + "    </Card>;" + [Environment]::NewLine + "}"
    "src\pages\InboxPage.jsx" = "import DashboardLayout from '../components/layout/DashboardLayout';" + [Environment]::NewLine + "import QueryIncidentCard from '../components/queries/QueryIncidentCard';" + [Environment]::NewLine + "export default function InboxPage() {" + [Environment]::NewLine + "    return <DashboardLayout>" + [Environment]::NewLine + "        <div className='flex justify-between items-center mb-6'>" + [Environment]::NewLine + "            <h1 className='text-2xl font-bold'>Query Triage Inbox</h1>" + [Environment]::NewLine + "        </div>" + [Environment]::NewLine + "        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>" + [Environment]::NewLine + "            <QueryIncidentCard />" + [Environment]::NewLine + "        </div>" + [Environment]::NewLine + "    </DashboardLayout>;" + [Environment]::NewLine + "}"
    "src\services\api.js" = "export const API_BASE = 'http://localhost:8000/api/v1';" + [Environment]::NewLine + "" + [Environment]::NewLine + "export async function getHealth() {" + [Environment]::NewLine + "    const res = await fetch(`${API_BASE}/health`);" + [Environment]::NewLine + "    return res.json();" + [Environment]::NewLine + "}"
    "src\utils\formatters.js" = "export function formatMs(ms) { return `${parseFloat(ms).toFixed(2)}ms`; }"
    "src\App.jsx" = "import InboxPage from './pages/InboxPage';" + [Environment]::NewLine + "" + [Environment]::NewLine + "function App() {" + [Environment]::NewLine + "  return <InboxPage />;" + [Environment]::NewLine + "}" + [Environment]::NewLine + "" + [Environment]::NewLine + "export default App;"
}

foreach ($file in $frontendFiles.GetEnumerator()) {
    Set-Content -Path $file.Name -Value $file.Value
}

Pop-Location
Write-Host "Frontend scaffolding script completed successfully!"
