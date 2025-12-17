import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-surface-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-20/40 via-surface-900 to-black text-white">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-surface-900/50 backdrop-blur-md sticky top-0 z-40">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-80 to-secondary-80">
                    Nexus CRM
                </h1>
                <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white">
                    <Bars3Icon className="w-6 h-6" />
                </button>
            </div>

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="lg:pl-72 px-4 py-8 min-h-screen transition-all duration-300">
                {children || <Outlet />}
            </main>
        </div>
    );
}
