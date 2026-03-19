import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QueryIncidentCard from '../components/queries/QueryIncidentCard';

export default function InboxPage() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const tenantId = "admin@antigravity.io";

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const token = localStorage.getItem('token');
                // Fetch from the correct queries/inbox endpoint with Auth header
                const response = await axios.get(`http://localhost:8000/api/v1/queries/inbox`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setIncidents(response.data);
            } catch (err) {
                console.error("Failed to fetch incidents", err);
            } finally {
                setLoading(false);
            }
        };
        fetchIncidents();
        const interval = setInterval(fetchIncidents, 5000);
        return () => clearInterval(interval);
    }, []);

    const maxLatency = incidents.length > 0 ? Math.max(...incidents.map(i => i.execution_time_ms)) : 0;
    const uniqueHashes = new Set(incidents.map(i => i.query_id)).size;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
            {/* Top Navigation */}
            <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold tracking-tight text-white uppercase italic">AntiGravity.ai</span>
                        <div className="h-4 w-px bg-zinc-800 mx-2"></div>
                        <span className="text-xs font-medium text-zinc-500">{tenantId}</span>
                    </div>
                    <button className="text-xs font-semibold px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors text-zinc-400">
                        Sign Out
                    </button>
                </div>
            </nav>

            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
                <header className="mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Query Triage</h1>
                    <p className="text-zinc-500 text-sm font-medium">Real-time database performance topology & local AI analysis.</p>
                </header>

                {/* KPI Metrics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-card p-6 rounded-2xl border border-zinc-800/50 flex flex-col justify-between h-32">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Fleet Peak Latency</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-white tracking-tighter">{maxLatency.toFixed(1)}</span>
                            <span className="text-sm font-semibold text-zinc-600">ms</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-zinc-800/50 flex flex-col justify-between h-32">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Normalized Footprints</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-white tracking-tighter">{uniqueHashes}</span>
                            <span className="text-xs font-bold text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded uppercase leading-none">Healthy Pattern</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-zinc-800/50 flex flex-col justify-between h-32">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Incident Density</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-white tracking-tighter">{incidents.length}</span>
                            <span className="text-sm font-semibold text-zinc-600">traces</span>
                        </div>
                    </div>
                </div>

                {/* Incident List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 space-y-4">
                            <div className="w-10 h-10 border-2 border-zinc-800 border-t-zinc-400 rounded-full animate-spin"></div>
                            <p className="text-zinc-500 text-xs font-medium animate-pulse">Synchronizing with cluster...</p>
                        </div>
                    ) : incidents.length === 0 ? (
                        <div className="text-center py-32 border-2 border-dashed border-zinc-900 rounded-3xl">
                            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-zinc-900 rounded-2xl border border-zinc-800">
                                <svg className="w-6 h-6 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-white font-semibold">Zero Performance Anomalies</h3>
                            <p className="text-zinc-500 text-sm mt-1">Telemetry stream is healthy. No slow queries detected.</p>
                        </div>
                    ) : (
                        incidents.map((incident, idx) => (
                            <QueryIncidentCard key={idx} incident={incident} />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
