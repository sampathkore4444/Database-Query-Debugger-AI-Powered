import React from 'react';

const nodeTypeMap = {
    'Seq Scan': { color: 'border-red-500/30 bg-red-500/5 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]', icon: '🔍' },
    'Index Scan': { color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]', icon: '⚡' },
    'Hash Join': { color: 'border-blue-500/30 bg-blue-500/5 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]', icon: '🔗' },
    'Nested Loop': { color: 'border-amber-500/30 bg-amber-500/5 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]', icon: '🔁' },
    'Sort': { color: 'border-purple-500/30 bg-purple-500/5 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]', icon: '⬇️' },
    'Aggregate': { color: 'border-zinc-400/30 bg-zinc-400/5 text-zinc-300 shadow-[0_0_15px_rgba(161,161,170,0.1)]', icon: '∑' },
    'Limit': { color: 'border-zinc-600/30 bg-zinc-600/5 text-zinc-400 shadow-sm', icon: '⏳' }
};

export default function PlanVisualizer({ planNode }) {
    if (!planNode) return null;

    const style = nodeTypeMap[planNode["Node Type"]] || { color: 'border-zinc-800 bg-zinc-900/40 text-zinc-400 shadow-sm', icon: '📦' };

    return (
        <div className="flex flex-col items-start relative pl-10 ml-2 border-l-2 border-zinc-800/60 pb-8 last:pb-0">
            {/* Horizontal Connector Line */}
            <div className="absolute w-10 h-0.5 bg-gradient-to-r from-zinc-800/60 to-transparent left-0 top-10"></div>

            <div className={`mt-2 mb-6 p-5 rounded-2xl border ${style.color} backdrop-blur-2xl min-w-[340px] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-default group relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-5 relative z-10">
                    <div className="flex items-center space-x-3">
                        <span className="text-xl bg-black/40 w-10 h-10 flex items-center justify-center rounded-xl border border-white/5 shadow-inner">
                            {style.icon}
                        </span>
                        <div className="flex flex-col">
                            <span className="font-black tracking-widest text-[10px] uppercase text-zinc-500 opacity-60">Node Logic</span>
                            <span className="font-extrabold tracking-tight text-sm text-white uppercase">{planNode["Node Type"]}</span>
                        </div>
                    </div>
                    {planNode["Relation Name"] && (
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Target</span>
                            <span className="text-[11px] bg-white/5 px-2.5 py-1 rounded-lg text-zinc-200 font-mono tracking-wider border border-white/5">
                                {planNode["Relation Name"]}
                            </span>
                        </div>
                    )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex flex-col group-hover:bg-black/40 transition-colors">
                        <span className="text-zinc-600 font-black tracking-widest uppercase text-[8px] mb-1">Cumulative Cost</span>
                        <span className="font-mono text-zinc-200 text-sm font-bold">{planNode["Total Cost"]?.toLocaleString()}</span>
                    </div>
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex flex-col group-hover:bg-black/40 transition-colors">
                        <span className="text-zinc-600 font-black tracking-widest uppercase text-[8px] mb-1">Row Density</span>
                        <span className="font-mono text-zinc-200 text-sm font-bold">{planNode["Actual Rows"] || planNode["Plan Rows"]}</span>
                    </div>
                </div>

                {planNode["Filter"] && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/10 rounded-xl relative z-10">
                        <span className="text-[8px] font-black text-red-400 uppercase tracking-widest block mb-1">Active Filter</span>
                        <code className="text-[11px] text-red-200/80 font-mono break-all leading-tight italic">{planNode["Filter"]}</code>
                    </div>
                )}
            </div>

            {planNode.Plans && planNode.Plans.length > 0 && (
                <div className="flex flex-col relative w-full pt-2">
                    {planNode.Plans.map((childPlan, idx) => (
                        <PlanVisualizer key={idx} planNode={childPlan} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function PlanVisualizerRoot({ planNode }) {
    return (
        <div className="-ml-10 mt-0">
            <PlanVisualizer planNode={planNode} />
        </div>
    );
}
