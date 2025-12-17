import { useState, useEffect } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import client from '../api/client';

const stages = ['Lead', 'Negotiation', 'Proposal', 'Closed'];

function DraggableCard({ deal, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: deal.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={isDragging ? 'opacity-50' : ''}>
            <Card className="p-4 cursor-grab active:cursor-grabbing hover:ring-2 ring-primary-40/50 transition-all relative group touch-none">
                <button
                    onPointerDown={(e) => e.stopPropagation()} // Prevent drag start when clicking delete
                    onClick={(e) => { e.stopPropagation(); onDelete(deal.id); }}
                    className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
                <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${deal.color || 'from-primary-40 to-secondary-40'} mb-3`}></div>
                <h4 className="font-bold text-white mb-1">{deal.title}</h4>
                <p className="text-sm text-gray-400 mb-3">{deal.company}</p>
                <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-white bg-white/10 px-2 py-1 rounded">
                        ${typeof deal.value === 'number' ? deal.value.toLocaleString() : deal.value}
                    </span>
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-white/20 to-transparent flex items-center justify-center border border-white/10">
                        {deal.company.charAt(0)}
                    </div>
                </div>
            </Card>
        </div>
    );
}

function DroppableColumn({ stage, children, count }) {
    const { setNodeRef, isOver } = useDroppable({
        id: stage,
    });

    return (
        <div ref={setNodeRef} className={`flex-1 min-w-[250px] flex flex-col gap-4 transition-colors rounded-2xl ${isOver ? 'bg-white/5' : ''}`}>
            <div className="flex items-center justify-between px-2">
                <h3 className="font-semibold text-gray-300">{stage}</h3>
                <span className="bg-white/10 text-xs px-2 py-1 rounded-full">{count}</span>
            </div>

            <div className="h-full rounded-2xl bg-white/5 p-2 space-y-3 min-h-[200px]">
                {children}
            </div>
        </div>
    );
}

export default function Deals() {
    const [deals, setDeals] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newDeal, setNewDeal] = useState({ title: '', company: '', value: '', stage: 'Lead' });

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            const res = await client.get('/deals');
            setDeals(res.data);
        } catch (error) {
            console.error('Failed to fetch deals', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddDeal = async (e) => {
        e.preventDefault();
        try {
            const res = await client.post('/deals', {
                ...newDeal,
                value: parseFloat(newDeal.value) || 0
            });
            setDeals([...deals, res.data]);
            setIsModalOpen(false);
            setNewDeal({ title: '', company: '', value: '', stage: 'Lead' });
        } catch (error) {
            console.error('Failed to create deal', error);
            alert('Failed to create deal');
        }
    };

    const deleteDeal = async (id) => {
        try {
            await client.delete(`/deals/${id}`);
            setDeals(deals.filter(d => d.id !== id));
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (over && active.id) {
            const newStage = over.id;
            // Optimistic
            setDeals((prevDeals) =>
                prevDeals.map(deal => deal.id === active.id ? { ...deal, stage: newStage } : deal)
            );

            try {
                await client.put(`/deals/${active.id}`, { stage: newStage });
            } catch (error) {
                console.error('Failed to update deal', error);
                fetchDeals(); // Revert
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary-40 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Deals Pipeline</h2>
                        <p className="text-gray-400 mt-1">Track your opportunities</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-primary-40 to-secondary-40 rounded-xl font-medium shadow-lg shadow-primary-40/30 hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <PlusIcon className="w-5 h-5" /> Add Deal
                    </button>
                </div>

                <div className="flex-1 overflow-x-auto pb-4">
                    <div className="flex gap-6 min-w-[1000px] h-full">
                        {stages.map((stage) => (
                            <DroppableColumn key={stage} stage={stage} count={deals.filter(d => d.stage === stage).length}>
                                {deals.filter(d => d.stage === stage).map((deal) => (
                                    <DraggableCard key={deal.id} deal={deal} onDelete={deleteDeal} />
                                ))}
                            </DroppableColumn>
                        ))}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Deal"
            >
                <form onSubmit={handleAddDeal} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Deal Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40"
                            value={newDeal.title}
                            onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                            placeholder="e.g. Enterprise License"
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
                                placeholder="10000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Stage</label>
                            <select
                                className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40"
                                value={newDeal.stage}
                                onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                            >
                                {stages.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
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
        </DndContext>
    );
}
