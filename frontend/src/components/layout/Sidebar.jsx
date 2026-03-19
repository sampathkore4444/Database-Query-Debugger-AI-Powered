export default function Sidebar() {
    return <aside className='w-64 bg-slate-900 text-white flex flex-col'>
        <div className='h-16 flex items-center px-6 font-black text-xl border-b border-slate-800 text-blue-400'>AntiGravity AI</div>
        <nav className='flex-1 p-4'>
            <div className='py-2 px-3 bg-slate-800 rounded mb-2 text-sm font-medium'>Query Inbox</div>
            <div className='py-2 px-3 hover:bg-slate-800 rounded text-sm text-slate-300 font-medium cursor-pointer'>Settings</div>
        </nav>
    </aside>;
}
