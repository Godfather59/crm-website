import Card from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const trafficData = [
    { name: 'Direct', value: 4000 },
    { name: 'Social', value: 3000 },
    { name: 'Referral', value: 2000 },
    { name: 'Organic', value: 2780 },
];

const deviceData = [
    { name: 'Mobile', value: 55, color: '#d0bcff' }, // Primary-40
    { name: 'Desktop', value: 35, color: '#381E72' }, // Surface-800 (or darker primary)
    { name: 'Tablet', value: 10, color: '#ccc2dc' }, // Secondary-40ish
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface-800 border border-white/10 p-3 rounded-xl shadow-xl">
                <p className="text-gray-400 text-xs mb-1">{label || payload[0].name}</p>
                <p className="text-white font-bold text-lg">
                    {payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

export default function Analytics() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Analytics</h2>
                <p className="text-gray-400 mt-1">Detailed performance metrics</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Traffic Chart */}
                <Card className="lg:col-span-2 min-h-[400px]">
                    <h3 className="text-lg font-semibold mb-6">Traffic Sources</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trafficData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {trafficData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#d0bcff' : '#ccc2dc'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* User Demographics / Donut Chart */}
                <Card className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-6">Device Distribution</h3>
                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={deviceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                            <p className="text-3xl font-bold text-white">100%</p>
                            <p className="text-xs text-gray-500">Active</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Avg. Session', val: '4m 32s', change: '+12%', color: 'text-emerald-400' },
                    { label: 'Bounce Rate', val: '42.5%', change: '-5.2%', color: 'text-emerald-400' },
                    { label: 'Conversion', val: '3.2%', change: '+0.8%', color: 'text-emerald-400' },
                ].map((kpi, i) => (
                    <Card key={i} className="flex flex-col justify-between h-32">
                        <p className="text-gray-400 text-sm">{kpi.label}</p>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-white">{kpi.val}</span>
                            <span className={`text-sm font-medium ${kpi.color}`}>{kpi.change}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
