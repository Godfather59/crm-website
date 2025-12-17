// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(name, email, password);
        if (result.success) {
            navigate('/');
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-surface-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-20/40 via-surface-900 to-black text-white p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
                    {/* Decorative Glow */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-40/30 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary-40/30 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
                        <p className="text-center text-gray-400 mb-8">Join Nexus CRM Today</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-40 text-white placeholder-gray-500 transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-40 text-white placeholder-gray-500 transition-colors"
                                    placeholder="name@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-40 text-white placeholder-gray-500 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-primary-40 to-secondary-40 rounded-xl font-bold shadow-lg shadow-primary-40/30 text-white"
                            >
                                Sign Up
                            </motion.button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-8">
                            Already have an account? <a href="/login" className="text-primary-80 hover:text-white transition-colors">Sign in</a>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
