import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, scaleIn } from '../utils/animations';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
    { name: 'Aug', value: 4200 },
    { name: 'Sep', value: 3800 },
    { name: 'Oct', value: 5500 },
    { name: 'Nov', value: 6800 },
    { name: 'Dec', value: 7200 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface-800 border border-white/10 p-3 rounded-xl shadow-xl">
                <p className="text-gray-400 text-xs mb-1">{label}</p>
                <p className="text-primary-40 font-bold text-lg">
                    ${payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

export default function Dashboard() {
    const [stats, setStats] = useState([]);
    const [recentDeals, setRecentDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDealModalOpen, setIsDealModalOpen] = useState(false);
    const [newDeal, setNewDeal] = useState({ title: '', company: '', value: '', stage: 'Lead' });
    const [searchQuery, setSearchQuery] = useState('');

    const fetchDashboardData = async () => {
        try {
            const [statsRes, dealsRes] = await Promise.all([
                client.get('/dashboard/stats'),
                client.get('/dashboard/recent-deals')
            ]);

            const formattedStats = [
                { name: 'Total Revenue', value: `$${statsRes.data.totalRevenue.toLocaleString()}`, change: '+23%', trend: 'up' },
                { name: 'Active Users', value: statsRes.data.activeUsers.toString(), change: '+12%', trend: 'up' },
                { name: 'New Deals', value: statsRes.data.newDeals.toString(), change: '-5%', trend: 'down' },
                { name: 'Retention Rate', value: `${statsRes.data.retentionRate}%`, change: '+2%', trend: 'up' },
            ];

            setStats(formattedStats);
            setRecentDeals(dealsRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('dashboard-search')?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleCreateDeal = async (e) => {
        e.preventDefault();
        try {
            await client.post('/deals', {
                ...newDeal,
                value: parseFloat(newDeal.value) || 0
            });
            setIsDealModalOpen(false);
            setNewDeal({ title: '', company: '', value: '', stage: 'Lead' });
            fetchDashboardData(); // Refresh data
        } catch (error) {
            console.error('Failed to create deal', error);
            alert('Failed to create deal');
        }
    };

    const filteredDeals = recentDeals.filter(deal =>
        (deal.company || deal.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.stage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary-40 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <motion.div
            className="space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Dashboard</h2>
                    <p className="text-gray-400 mt-1">Overview of your performance</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <input
                            id="dashboard-search"
                            type="text"
                            placeholder="Search deals (⌘K)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-40/50 transition-all pl-10"
                        />
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsDealModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-primary-40 to-secondary-40 rounded-xl font-medium shadow-lg shadow-primary-40/30 transition-shadow whitespace-nowrap"
                    >
                        + New Deal
                    </motion.button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <motion.div key={stat.name} variants={scaleIn}>
                        <Card className="relative overflow-hidden h-full">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <div className="w-16 h-16 rounded-full bg-white blur-xl"></div>
                            </div>
                            <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                            <div className="mt-4 flex items-baseline justify-between">
                                <p className="text-3xl font-bold">{stat.value}</p>
                                <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
                                    {stat.trend === 'up' ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : <ArrowDownIcon className="w-3 h-3 mr-1" />}
                                    {stat.change}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Placeholder */}
                <motion.div className="lg:col-span-2" variants={fadeInUp}>
                    <Card className="h-full min-h-[400px]">
                        <h3 className="text-lg font-semibold mb-6">Revenue Analysis</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#d0bcff" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#d0bcff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        tickFormatter={(value) => `$${value / 1000}k`}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#d0bcff"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>

                {/* Recent Deals */}
                <motion.div className="lg:col-span-1" variants={fadeInUp}>
                    <Card className="h-full">
                        <h3 className="text-lg font-semibold mb-6">Recent Deals</h3>
                        <div className="space-y-4">
                            {filteredDeals.length === 0 ? (
                                <p className="text-center text-gray-500 py-4 italic">
                                    {searchQuery ? 'No matching deals' : 'No recent deals'}
                                </p>
                            ) : (
                                filteredDeals.map((deal) => (
                                    <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group animate-in fade-in duration-300">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-10 rounded-full ${deal.color}`}></div>
                                            <div>
                                                <p className="font-medium text-sm group-hover:text-primary-80 transition-colors">{deal.company || deal.title}</p>
                                                <p className="text-xs text-gray-500">{deal.stage}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-sm text-right">${deal.value.toLocaleString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <Link to="/deals" className="block w-full mt-6 py-2 text-center text-sm text-gray-400 hover:text-white border border-white/5 hover:border-white/20 rounded-lg transition-all">
                            View All Deals
                        </Link>
                    </Card>
                </motion.div>
            </div>

            {/* New Deal Modal */}
            <Modal
                isOpen={isDealModalOpen}
                onClose={() => setIsDealModalOpen(false)}
                title="Create New Deal"
            >
                <form onSubmit={handleCreateDeal} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Deal Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40"
                            value={newDeal.title}
                            onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                            placeholder="e.g. Q4 Software License"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Company</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40"
                            value={newDeal.company}
                            onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })}
                            placeholder="e.g. Acme Corp"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Value ($)</label>
                            <input
                                type="number"
                                required
                                className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40"
                                value={newDeal.value}
                                onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                                placeholder="5000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Stage</label>
                            <select
                                className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40"
                                value={newDeal.stage}
                                onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                            >
                                <option value="Lead">Lead</option>
                                <option value="Discovery">Discovery</option>
                                <option value="Proposal">Proposal</option>
                                <option value="Negotiation">Negotiation</option>
                                <option value="Won">Won</option>
                                <option value="Lost">Lost</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsDealModalOpen(false)}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-primary-40 to-secondary-40 rounded-lg font-medium text-white shadow-lg hover:opacity-90 transition-opacity"
                        >
                            Create Deal
                        </button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
}
