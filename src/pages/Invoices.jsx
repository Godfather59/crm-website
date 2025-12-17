import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { PlusIcon, PrinterIcon, ArrowDownTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import client from '../api/client';

export default function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newInv, setNewInv] = useState({ client: '', amount: '', status: 'Pending' });

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await client.get('/invoices');
            setInvoices(res.data);
        } catch (error) {
            console.error('Failed to fetch invoices', error);
        }
    };

    const addInvoice = async (e) => {
        e.preventDefault();
        const invoiceData = {
            id: `INV-${Date.now().toString().slice(-4)}`, // Simple ID generation
            date: new Date().toISOString().split('T')[0],
            ...newInv,
            amount: parseFloat(newInv.amount)
        };
        try {
            const res = await client.post('/invoices', invoiceData);
            setInvoices([...invoices, res.data]);
            setIsModalOpen(false);
            setNewInv({ client: '', amount: '', status: 'Pending' });
        } catch (error) {
            console.error('Failed to create invoice', error);
        }
    };

    const deleteInvoice = async (id) => {
        try {
            await client.delete(`/invoices/${id}`);
            setInvoices(invoices.filter(i => i.id !== id));
        } catch (error) {
            console.error('Failed to delete invoice', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Invoices</h2>
                    <p className="text-gray-400 mt-1">Track payments and billings</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-gradient-to-r from-primary-40 to-secondary-40 rounded-xl font-medium shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" /> Create Invoice
                </button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase font-medium text-white">
                            <tr>
                                <th className="px-6 py-4 rounded-tl-lg">Invoice #</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 rounded-tr-lg"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-white">{inv.id}</td>
                                    <td className="px-6 py-4 font-medium text-white">{inv.client}</td>
                                    <td className="px-6 py-4">{inv.date}</td>
                                    <td className="px-6 py-4 text-white font-bold">${Number(inv.amount).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            inv.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button className="p-2 text-gray-500 hover:text-white" title="Download">
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-500 hover:text-white" title="Print">
                                            <PrinterIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => deleteInvoice(inv.id)} className="p-2 text-gray-500 hover:text-rose-400" title="Delete">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Invoice">
                <form onSubmit={addInvoice} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Client Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40"
                            value={newInv.client}
                            onChange={e => setNewInv({ ...newInv, client: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Amount ($)</label>
                        <input
                            type="number"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40"
                            value={newInv.amount}
                            onChange={e => setNewInv({ ...newInv, amount: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                        <select
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40 [&>option]:bg-surface-900"
                            value={newInv.status}
                            onChange={e => setNewInv({ ...newInv, status: e.target.value })}
                        >
                            <option>Pending</option>
                            <option>Paid</option>
                            <option>Overdue</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-40 text-black font-medium rounded-lg hover:bg-primary-50">Issue Invoice</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
