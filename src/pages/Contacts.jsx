import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, EllipsisHorizontalIcon, TrashIcon } from '@heroicons/react/24/outline';
import client from '../api/client';

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newContact, setNewContact] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'Lead',
        avatar: ''
    });

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await client.get('/contacts');
            setContacts(res.data);
        } catch (error) {
            console.error('Failed to fetch contacts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddContact = async (e) => {
        e.preventDefault();

        // Pick a random avatar background color
        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const contactData = {
            ...newContact,
            avatar: randomColor
        };

        try {
            const res = await client.post('/contacts', contactData);
            setContacts([res.data, ...contacts]);
            setIsModalOpen(false);
            setNewContact({ name: '', email: '', phone: '', company: '', status: 'Lead', avatar: '' });
        } catch (error) {
            console.error('Failed to add contact', error);
            alert('Failed to add contact');
        }
    };

    const deleteContact = async (id) => {
        try {
            await client.delete(`/contacts/${id}`);
            setContacts(contacts.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete contact', error);
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Contacts</h2>
                    <p className="text-gray-400 mt-1">Manage your relationships</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-primary-40 to-secondary-40 rounded-xl font-medium shadow-lg shadow-primary-40/30 hover:scale-105 transition-transform"
                >
                    Add Contact
                </button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase font-medium text-white">
                            <tr>
                                <th className="px-6 py-4 rounded-tl-lg">Name</th>
                                <th className="px-6 py-4">Contact Info</th>
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 rounded-tr-lg"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {contacts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic">No contacts found</td>
                                </tr>
                            ) : (
                                contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${contact.avatar || 'bg-gray-600'}`}>
                                                    {(contact.name || '?').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{contact.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <EnvelopeIcon className="w-4 h-4" /> {contact.email}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <PhoneIcon className="w-4 h-4" /> {contact.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-white">{contact.company}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${contact.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    contact.status === 'Inactive' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                {contact.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => deleteContact(contact.id)}
                                                    className="p-2 text-gray-400 hover:text-rose-400 transition-colors"
                                                    title="Delete Contact"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                                                    <EllipsisHorizontalIcon className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add Contact Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Contact"
            >
                <form onSubmit={handleAddContact} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40"
                            value={newContact.name}
                            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                            placeholder="e.g. Alice Johnson"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40"
                                value={newContact.email}
                                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                                placeholder="alice@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                            <input
                                type="text"
                                className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40"
                                value={newContact.phone}
                                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Company</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40"
                            value={newContact.company}
                            onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                            placeholder="e.g. Webflow Inc."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                        <select
                            className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-40"
                            value={newContact.status}
                            onChange={(e) => setNewContact({ ...newContact, status: e.target.value })}
                        >
                            <option value="Lead">Lead</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
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
                            Add Contact
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
