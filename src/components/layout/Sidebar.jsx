import { Link, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    UsersIcon,
    CreditCardIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    XMarkIcon,
    ClipboardDocumentListIcon, // Tasks
    QueueListIcon,             // Backlog
    DocumentTextIcon           // Invoices
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', icon: HomeIcon, path: '/' },
    { name: 'Contacts', icon: UsersIcon, path: '/contacts' },
    { name: 'Deals', icon: CreditCardIcon, path: '/deals' },
    { name: 'Tasks', icon: ClipboardDocumentListIcon, path: '/tasks' },
    { name: 'Backlog', icon: QueueListIcon, path: '/backlog' },
    { name: 'Invoices', icon: DocumentTextIcon, path: '/invoices' },
    { name: 'Analytics', icon: ChartBarIcon, path: '/analytics' },
    { name: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
];

const SidebarContent = ({ onClose }) => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const getInitials = (name) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-center h-20 border-b border-white/5 shrink-0 relative">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-80 to-secondary-80">
                    Nexus CRM
                </h1>
                {/* Mobile Close Button */}
                <button onClick={onClose} className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => onClose && onClose()}
                            className={clsx(
                                'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300',
                                isActive
                                    ? 'bg-primary-40/10 text-primary-80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <item.icon
                                className={clsx(
                                    'mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-300',
                                    isActive ? 'text-primary-80' : 'text-gray-400 group-hover:text-white'
                                )}
                                aria-hidden="true"
                            />
                            <span className="flex-1">{item.name}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="w-1.5 h-1.5 rounded-full bg-primary-40 shadow-[0_0_10px_rgba(208,188,255,0.5)]"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3 px-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-40 to-secondary-40 flex items-center justify-center font-bold text-xs text-white">
                        {getInitials(user?.name)}
                    </div>
                    <div className="text-sm">
                        <p className="font-medium text-white">{user?.name || 'Guest User'}</p>
                        <p className="text-xs text-gray-500">{user?.role || 'User'}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Sign Out"
                >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                </button>
            </div>
        </div >
    );
};

export default function Sidebar({ isOpen, onClose }) {
    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex w-64 h-screen fixed left-0 top-0 glass-panel m-4 flex-col border-r-0 z-50">
                <SidebarContent /> {/* No onClose needed for desktop */}
            </div>

            {/* Mobile Sidebar Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-surface-900 border-r border-white/10 shadow-2xl"
                        >
                            <SidebarContent onClose={onClose} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
