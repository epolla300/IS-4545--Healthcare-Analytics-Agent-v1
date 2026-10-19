import React from 'react';
import { X, Sparkles, TrendingUp, CheckCircle, BarChart3, Clock, DollarSign } from 'lucide-react';
import { AIAgentOpportunity } from '../types/dashboard';

interface AgentSimulationModalProps {
  agent: AIAgentOpportunity | null;
  onClose: () => void;
}

export const AgentSimulationModal: React.FC<AgentSimulationModalProps> = ({
  agent,
  onClose,
}) => {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white rounded-t-lg flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Agent Impact Simulation</h3>
              <p className="text-xs text-slate-400">{agent.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Executive Value Proposition */}
          <div className="p-3.5 bg-teal-50/50 border border-teal-200/80 rounded-lg">
            <h4 className="font-bold text-teal-950 mb-1">Projected Clinical & Operational ROI</h4>
            <p className="text-teal-900 leading-relaxed">
              Deploying <strong>{agent.name}</strong> directly targets the highest friction areas identified in recent patient feedback:
            </p>
          </div>

          {/* Before vs After Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
              <div className="text-[11px] text-slate-500 uppercase font-semibold mb-1">Grievance Rate</div>
              <div className="flex items-baseline space-x-2">
                <span className="text-slate-400 line-through text-base">38.4%</span>
                <span className="text-emerald-700 font-bold text-xl">16.2%</span>
              </div>
              <div className="text-[11px] text-emerald-800 font-medium mt-1">
                -58% reduction
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
              <div className="text-[11px] text-slate-500 uppercase font-semibold mb-1">Follow-up Adherence</div>
              <div className="flex items-baseline space-x-2">
                <span className="text-slate-400 line-through text-base">71.2%</span>
                <span className="text-emerald-700 font-bold text-xl">88.5%</span>
              </div>
              <div className="text-[11px] text-emerald-800 font-medium mt-1">
                +17.3 pt jump
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
              <div className="text-[11px] text-slate-500 uppercase font-semibold mb-1">Nurse Admin Burden</div>
              <div className="flex items-baseline space-x-2">
                <span className="text-slate-400 line-through text-base">14 hrs</span>
                <span className="text-emerald-700 font-bold text-xl">3.5 hrs</span>
              </div>
              <div className="text-[11px] text-emerald-800 font-medium mt-1">
                -75% time reclaimed
              </div>
            </div>
          </div>

          {/* Rollout Horizon & Phasing */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Recommended Pilot & Rollout Roadmap</h4>
            <div className="space-y-2 text-slate-700">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <div className="font-semibold text-slate-900">Weeks 1–4: Shadow EHR Data Ingestion & Safety Benchmark</div>
                  <div className="text-slate-500">Run agent in silent shadow mode alongside clinical triage staff with 0% patient contact to validate risk filters.</div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <div className="font-semibold text-slate-900">Weeks 5–8: Controlled Pilot in Single Service Line</div>
                  <div className="text-slate-500">Deploy pilot within {agent.targetServiceLines[0]} with clinician-in-the-loop validation and daily feedback scoring.</div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <div className="font-semibold text-slate-900">Weeks 9–12: Health System Enterprise Scale</div>
                  <div className="text-slate-500">Scale across remaining high-volume inpatient and ambulatory service lines with automated CMS CAHPS telemetry integration.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Feasibility Score: <strong>{agent.feasibilityScore}/100</strong> · ROI Rating: <strong>{agent.roiScore}/100</strong></span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
