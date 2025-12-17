import { useState, useEffect } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { PlusIcon, TrashIcon, CalendarIcon, FlagIcon } from '@heroicons/react/24/outline';
import client from '../api/client';

const stages = ['To Do', 'In Progress', 'In Review', 'Done'];

function DraggableTask({ task, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={isDragging ? 'opacity-50' : ''}>
            <Card className="p-4 cursor-grab active:cursor-grabbing hover:ring-2 ring-primary-40/50 transition-all group relative">
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                    className="absolute top-2 right-2 text-gray-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
                <div className="flex items-start justify-between mb-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/10 text-gray-300`}>{task.tag}</span>
                </div>
                <h4 className="font-semibold text-white mb-2 text-sm">{task.title}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-3">
                    <div className="flex items-center gap-1">
                        <FlagIcon className={`w-3 h-3 ${task.priority === 'High' ? 'text-rose-400' : 'text-gray-400'}`} />
                        {task.priority}
                    </div>
                    <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        Today
                    </div>
                </div>
            </Card>
        </div>
    );
}

function DroppableColumn({ stage, children, count }) {
    const { setNodeRef, isOver } = useDroppable({ id: stage });

    return (
        <div ref={setNodeRef} className={`flex-1 min-w-[250px] flex flex-col gap-4 rounded-2xl transition-colors ${isOver ? 'bg-white/5' : ''}`}>
            <div className="flex items-center justify-between px-2">
                <h3 className="font-semibold text-gray-300 text-sm uppercase tracking-wider">{stage}</h3>
                <span className="bg-white/10 text-xs px-2 py-1 rounded-full text-gray-400">{count}</span>
            </div>
            <div className="h-full bg-white/5 rounded-2xl p-2 space-y-3 min-h-[200px]">
                {children}
            </div>
        </div>
    );
}

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', tag: 'General', priority: 'Medium' });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await client.get('/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (over && active.id) {
            // Optimistic update
            const updatedTasks = tasks.map(t => t.id === active.id ? { ...t, stage: over.id } : t);
            setTasks(updatedTasks);

            // API call
            try {
                await client.put(`/tasks/${active.id}`, { stage: over.id });
            } catch (error) {
                console.error('Failed to update task stage', error);
                fetchTasks(); // Revert on failure
            }
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        const taskData = {
            ...newTask,
            stage: 'To Do',
            color: 'bg-primary-40'
        };
        try {
            const res = await client.post('/tasks', taskData);
            setTasks([...tasks, res.data]);
            setIsModalOpen(false);
            setNewTask({ title: '', tag: 'General', priority: 'Medium' });
        } catch (error) {
            console.error('Failed to create task', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await client.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t.id !== id));
        } catch (error) {
            console.error('Failed to delete task', error);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Tasks Board</h2>
                        <p className="text-gray-400 mt-1">Manage tour daily activities</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-gradient-to-r from-primary-40 to-secondary-40 rounded-xl font-medium shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                        <PlusIcon className="w-5 h-5" /> Create Task
                    </button>
                </div>

                <div className="flex-1 overflow-x-auto pb-4">
                    <div className="flex gap-6 min-w-[1000px] h-full">
                        {stages.map(stage => (
                            <DroppableColumn key={stage} stage={stage} count={tasks.filter(t => t.stage === stage).length}>
                                {tasks.filter(t => t.stage === stage).map(task => (
                                    <DraggableTask key={task.id} task={task} onDelete={deleteTask} />
                                ))}
                            </DroppableColumn>
                        ))}
                    </div>
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
                    <form onSubmit={addTask} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Task Summary</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40"
                                value={newTask.title}
                                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                placeholder="e.g. Update Homepage Hero"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Tag</label>
                                <select
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40 [&>option]:bg-surface-900"
                                    value={newTask.tag}
                                    onChange={e => setNewTask({ ...newTask, tag: e.target.value })}
                                >
                                    <option>General</option>
                                    <option>Design</option>
                                    <option>Development</option>
                                    <option>Marketing</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
                                <select
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40 [&>option]:bg-surface-900"
                                    value={newTask.priority}
                                    onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-primary-40 text-black font-medium rounded-lg hover:bg-primary-50">Create Task</button>
                        </div>
                    </form>
                </Modal>
            </div>
        </DndContext>
    );
}
