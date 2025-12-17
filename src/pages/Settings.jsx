import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import { UserIcon, BellIcon, ShieldCheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const Toggle = ({ active }) => (
    <div className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${active ? 'bg-primary-40' : 'bg-surface-700'}`}>
        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${active ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </div>
);

export default function Settings() {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSaveChanges = async () => {
        setIsSaving(true);
        const result = await updateProfile(name, email);
        setIsSaving(false);

        if (result.success) {
            alert('Profile updated successfully!');
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white">Settings</h2>
                <p className="text-gray-400 mt-1">Manage your account preferences</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Profile Section */}
                <Card>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-primary-40/20 rounded-xl">
                            <UserIcon className="w-6 h-6 text-primary-40" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Profile Information</h3>
                            <p className="text-sm text-gray-400">Update your public profile</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Display Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-surface-900/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-40 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-surface-900/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-40 text-white"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-300">Bio</label>
                            <textarea rows="3" defaultValue={user?.role === 'Admin' ? 'Nexus CRM Administrator' : 'Product Team Member'} className="w-full bg-surface-900/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-40 text-white"></textarea>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSaveChanges}
                            disabled={isSaving}
                            className="px-6 py-2 bg-gradient-to-r from-primary-40 to-secondary-40 rounded-lg font-medium text-white shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </Card>

                {/* Notifications */}
                <Card>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-secondary-40/20 rounded-xl">
                            <BellIcon className="w-6 h-6 text-secondary-40" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Notifications</h3>
                            <p className="text-sm text-gray-400">Choose what you want to be notified about</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                            <div>
                                <p className="font-medium text-white">Email Notifications</p>
                                <p className="text-xs text-gray-400">Receive daily summaries</p>
                            </div>
                            <Toggle active={true} />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                            <div>
                                <p className="font-medium text-white">Push Notifications</p>
                                <p className="text-xs text-gray-400">Real-time alerts for new deals</p>
                            </div>
                            <Toggle active={true} />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                            <div>
                                <p className="font-medium text-white">Marketing Emails</p>
                                <p className="text-xs text-gray-400">Receive product updates</p>
                            </div>
                            <Toggle active={false} />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
