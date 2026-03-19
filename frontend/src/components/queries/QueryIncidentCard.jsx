import React, { useState } from 'react';
import { PlanVisualizerRoot } from './PlanVisualizer';

export default function QueryIncidentCard({ incident }) {
    const [expanded, setExpanded] = useState(false);

    const isCritical = incident.execution_time_ms > 1000;
    
    return (
        <div className={`group glass-card rounded-2xl overflow-hidden transition-all duration-300 relative ${expanded ? 'bg-zinc-900/40 ring-1 ring-zinc-700/50 shadow-2xl' : 'hover:bg-zinc-900/20'}`}>
            {/* Status Indicator Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isCritical ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]'} transition-all`}></div>

            <div className="p-6 pl-8 cursor-pointer select-none" onClick={() => setExpanded(!expanded)}>
                <div className="flex justify-between items-start gap-8">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-3">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[9px] font-bold font-mono text-zinc-400 tracking-wider">
                                ID: {incident.query_id?.substring(0,8)}
                            </span>
                            <div className="flex gap-2">
                                {incident.issues_detected?.slice(0, 2).map((issue, idx) => (
                                    <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-zinc-300 text-[10px] font-semibold border border-white/5 whitespace-nowrap">
                                        {issue}
                                    </span>
                                ))}
                                {incident.issues_detected?.length > 2 && (
                                    <span className="text-[10px] text-zinc-500 font-medium font-sans">+{incident.issues_detected.length - 2} more</span>
                                )}
                            </div>
                        </div>
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                            <pre className="font-mono text-[13px] text-zinc-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                {incident.normalized_query || incident.raw_query}
                            </pre>
                        </div>
                    </div>
                    
                    <div className="text-right flex flex-col items-end shrink-0 pt-1">
                        <div className="flex items-baseline gap-1.5 mb-1">
                            <span className="text-2xl font-black text-white tracking-tight">{incident.execution_time_ms?.toFixed(1)}</span>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase">ms</span>
                        </div>
                        <div className="text-[11px] font-medium text-zinc-500 font-mono tracking-tighter">
                            {new Date(incident.timestamp).toLocaleTimeString([], { hour12: false })}
                        </div>
                        <div className={`mt-6 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center transition-all duration-500 ${expanded ? 'rotate-180 bg-zinc-100 border-zinc-100 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'group-hover:border-zinc-600'}`}>
                            <svg className={`w-4 h-4 transition-colors ${expanded ? 'text-zinc-950' : 'text-zinc-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="border-t border-zinc-800/50 bg-zinc-950/40 p-8 pl-10 space-y-8 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {incident.ai_explanation && (
                            <div className="flex flex-col">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                                    Generative Diagnosis
                                </h3>
                                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl -mr-12 -mt-12"></div>
                                    <p className="text-zinc-300 text-[14px] leading-relaxed font-medium relative z-10">{incident.ai_explanation}</p>
                                </div>
                            </div>
                        )}
                        {incident.sql_fix && (
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                                        Resolution Payload
                                    </h3>
                                    <button 
                                        onClick={() => navigator.clipboard.writeText(incident.sql_fix)} 
                                        className="text-[10px] font-bold px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all text-zinc-400 uppercase tracking-tight"
                                    >
                                        Copy Fix
                                    </button>
                                </div>
                                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 overflow-hidden relative backdrop-blur-xl">
                                    <pre className="text-[13px] font-mono text-emerald-400 leading-relaxed overflow-x-auto">
                                        {incident.sql_fix}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 border-t border-zinc-800/50">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-8 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                            Execution Topology
                        </h3>
                        {incident.plan_json ? (
                            <div className="bg-black/30 border border-white/5 rounded-2xl p-10 overflow-x-auto shadow-inner">
                                <PlanVisualizerRoot planNode={incident.plan_json.Plan} />
                            </div>
                        ) : (
                            <div className="py-8 bg-zinc-900/20 rounded-2xl border border-dashed border-zinc-800 text-center text-zinc-600 text-xs italic">
                                No execution trace captured for this hash.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
