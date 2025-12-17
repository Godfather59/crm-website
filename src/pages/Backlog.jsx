import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { PlusIcon, CheckCircleIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import client from '../api/client';

export default function Backlog() {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ title: '', type: 'General', points: 1 });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await client.get('/backlog');
            setItems(res.data);
        } catch (error) {
            console.error('Failed to fetch backlog', error);
        }
    };

    const addItem = async (e) => {
        e.preventDefault();
        try {
            const res = await client.post('/backlog', newItem);
            setItems([...items, res.data]);
            setIsModalOpen(false);
            setNewItem({ title: '', type: 'General', points: 1 });
        } catch (error) {
            console.error('Failed to add backlog item', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            await client.delete(`/backlog/${id}`);
            setItems(items.filter(i => i.id !== id));
        } catch (error) {
            console.error('Failed to delete item', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Backlog</h2>
                    <p className="text-gray-400 mt-1">Prioritize upcoming work</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-medium transition-colors flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" /> Add Item
                </button>
            </div>

            <Card className="overflow-hidden">
                <div className="divide-y divide-white/5">
                    {items.map((item) => (
                        <div key={item.id} className="p-4 flex items-center justify-between hover:bg-white/5 group transition-colors">
                            <div className="flex items-center gap-4">
                                <button onClick={() => deleteItem(item.id)} className="text-gray-600 hover:text-emerald-400">
                                    <CheckCircleIcon className="w-6 h-6" />
                                </button>
                                <div>
                                    <p className="font-medium text-white">{item.title}</p>
                                    <p className="text-xs text-gray-500">{item.type} • {item.points} pts</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400">{item.type}</span>
                                <button className="text-gray-500 hover:text-white">
                                    <EllipsisHorizontalIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No items in backlog. Good job!
                        </div>
                    )}
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add to Backlog">
                <form onSubmit={addItem} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Item Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40"
                            value={newItem.title}
                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40 [&>option]:bg-surface-900"
                                value={newItem.type}
                                onChange={e => setNewItem({ ...newItem, type: e.target.value })}
                            >
                                <option>General</option>
                                <option>Bug</option>
                                <option>Feature</option>
                                <option>Research</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Points</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40"
                                value={newItem.points}
                                onChange={e => setNewItem({ ...newItem, points: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-40 text-black font-medium rounded-lg hover:bg-primary-50">Add Item</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
