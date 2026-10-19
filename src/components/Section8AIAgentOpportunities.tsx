import React, { useState } from 'react';
import { Bot, Sparkles, CheckCircle, ArrowRight, Gauge, Layers, ShieldCheck } from 'lucide-react';
import { AI_AGENT_OPPORTUNITIES } from '../data/patientFeedbackData';
import { AIAgentOpportunity } from '../types/dashboard';

interface Section8AIAgentOpportunitiesProps {
  onSimulateAgent?: (agent: AIAgentOpportunity) => void;
}

export const Section8AIAgentOpportunities: React.FC<Section8AIAgentOpportunitiesProps> = ({
  onSimulateAgent,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AIAgentOpportunity>(AI_AGENT_OPPORTUNITIES[0]);

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-teal-700">Section 8</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Autonomous Healthcare AI Systems</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            AI Agent Opportunities & Recommendations
          </h2>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center space-x-2 text-xs text-slate-500">
          <Bot className="w-4 h-4 text-teal-600" />
          <span>Grounded in Discovered Organizational Friction Nodes</span>
        </div>
      </div>

      {/* Grid: 5 Recommended AI Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 5 cols: List of Recommended AI Agents */}
        <div className="lg:col-span-5 space-y-3">
          {AI_AGENT_OPPORTUNITIES.map((agent) => {
            const isSelected = selectedAgent.id === agent.id;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-teal-50/40 border-teal-600 ring-1 ring-teal-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-teal-700">
                    {agent.category}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {agent.implementationHorizon}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                  {agent.name}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2 mb-2 leading-relaxed">
                  {agent.purpose}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
                  <div className="flex items-center space-x-3">
                    <span>ROI: <strong className="text-slate-800">{agent.roiScore}/100</strong></span>
                    <span>·</span>
                    <span>Feasibility: <strong className="text-slate-800">{agent.feasibilityScore}/100</strong></span>
                  </div>
                  <ChevronRightIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-700 font-bold' : 'text-slate-400'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 7 cols: Detailed Agent Blueprint & Business Case */}
        <div className="lg:col-span-7 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  {selectedAgent.category} · Architectural Specification
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedAgent.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                  {selectedAgent.implementationHorizon}
                </span>
              </div>
            </div>

            {/* Purpose */}
            <div className="mb-4">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Core Purpose & Clinical Scope
              </h5>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200/80">
                {selectedAgent.purpose}
              </p>
            </div>

            {/* Expected Organizational Impact */}
            <div className="mb-4">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Expected Organizational & HCAHPS Impact
              </h5>
              <div className="bg-emerald-50/70 border border-emerald-200/90 p-3 rounded text-xs text-emerald-950 font-medium leading-relaxed">
                {selectedAgent.expectedImpact}
              </div>
            </div>

            {/* Key Architectural Features */}
            <div className="mb-4">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Key Technical & Clinical Capabilities
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {selectedAgent.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-2 bg-slate-50/80 p-2 rounded border border-slate-100">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="leading-tight">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Service Lines */}
            <div className="mb-4">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Target Service Lines
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedAgent.targetServiceLines.map((sl) => (
                  <span key={sl} className="text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                    {sl}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-slate-600">
              <span>Executive Readiness: <strong className="text-teal-700 font-bold">Approved for Pilot</strong></span>
            </div>
            {onSimulateAgent && (
              <button
                onClick={() => onSimulateAgent(selectedAgent)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Simulate Agent Intervention</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}
