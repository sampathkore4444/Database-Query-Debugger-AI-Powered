// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password);
            }
            navigate('/inbox');
        } catch (err) {
            setError(err.message || "An error occurred during authentication.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 absolute inset-0 text-slate-100 overflow-hidden">
            {/* Background design accents */}
            <div className="absolute top-0 w-full h-[50vh] bg-gradient-to-b from-blue-900/40 to-slate-900 pointer-events-none"></div>
            
            <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 z-10 relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-t-2xl"></div>
                
                <h1 className="text-3xl font-black mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                    AntiGravity AI
                </h1>
                <p className="text-slate-400 text-sm text-center mb-8 font-medium">
                    Query Triage & Insights Platform
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm text-center font-bold animate-fade-in shadow-inner">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600 block"
                            placeholder="dba@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600 block"
                            placeholder="••••••••"
                        />
                    </div>
                    <button 
                        disabled={loading}
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2">
                        {loading ? 'Authenticating...' : (isLogin ? 'Sign In Securely' : 'Create Organization')}
                    </button>
                </form>

                <div className="mt-8 text-center bg-slate-900/80 -mx-8 -mb-8 py-5 border-t border-slate-700/50 rounded-b-2xl">
                    <p className="text-sm text-slate-400">
                        {isLogin ? "Need an instance? " : "Already have an account? "}
                        <button 
                            type="button"
                            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                            className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                            {isLogin ? 'Register New Engine' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
