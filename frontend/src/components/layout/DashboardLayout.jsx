import Sidebar from './Sidebar';
import Header from './Header';
export default function DashboardLayout({ children }) {
    return <div className='flex h-screen bg-gray-50 text-gray-900'>
        <Sidebar />
        <div className='flex flex-col flex-1 overflow-hidden'>
            <Header />
            <main className='flex-1 overflow-y-auto p-6'>
                {children}
            </main>
        </div>
    </div>;
}
