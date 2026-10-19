import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, UserCheck, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { PatientComment } from '../types/dashboard';
import { computeAIRiskMonitoring } from '../utils/analytics';

interface Section7AIRiskMonitoringProps {
  comments: PatientComment[];
  onUpdateStatus?: (commentId: string, status: 'pending' | 'in_audit' | 'escalated_cmo' | 'resolved') => void;
}

export const Section7AIRiskMonitoring: React.FC<Section7AIRiskMonitoringProps> = ({
  comments,
  onUpdateStatus,
}) => {
  const riskData = computeAIRiskMonitoring(comments);
  const [activeCategory, setActiveCategory] = useState<'all' | 'hallucination' | 'bias' | 'human_review'>('all');
  const [selectedCase, setSelectedCase] = useState<PatientComment | null>(null);

  // Status badge colors
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'escalated_cmo':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'in_audit':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      default:
        return 'bg-rose-100 text-rose-900 border-rose-200';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'escalated_cmo':
        return 'Escalated to CMO';
      case 'in_audit':
        return 'In Quality Audit';
      case 'resolved':
        return 'Audit Resolved';
      default:
        return 'Pending Review';
    }
  };

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-rose-700">Section 7</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Clinical Governance & Algorithmic Safety</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            AI Risk Monitoring & Clinical Safety Sentinel
          </h2>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-800 font-semibold border border-rose-200">
            {riskData.totalRiskFlagged} High-Priority Risk Events
          </span>
        </div>
      </div>

      {/* 3 Risk Severity Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {/* Card 1: Hallucination Traps */}
        <div
          onClick={() => setActiveCategory('hallucination')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            activeCategory === 'hallucination'
              ? 'bg-white border-amber-500 ring-1 ring-amber-500 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Hallucination Traps</span>
            <div className="w-7 h-7 rounded bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{riskData.hallucinationTraps.count} <span className="text-xs font-normal text-slate-500">Detected</span></div>
          <p className="text-xs text-slate-500 mt-1">
            Contradictory EHR auto-summaries, conflicting post-op instructions, or ambiguous clinical jargon.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-amber-800">
            Risk: Patient confusion & medication error
          </div>
        </div>

        {/* Card 2: Bias-Related Comments */}
        <div
          onClick={() => setActiveCategory('bias')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            activeCategory === 'bias'
              ? 'bg-white border-purple-500 ring-1 ring-purple-500 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Bias & Disparities</span>
            <div className="w-7 h-7 rounded bg-purple-50 flex items-center justify-center text-purple-600">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{riskData.biasRelatedComments.count} <span className="text-xs font-normal text-slate-500">Detected</span></div>
          <p className="text-xs text-slate-500 mt-1">
            Perceived demographic discrimination, postpartum symptom dismissal, or linguistic exclusion.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-purple-800">
            Risk: Civil rights violation & maternal mortality
          </div>
        </div>

        {/* Card 3: Cases Requiring Human Review */}
        <div
          onClick={() => setActiveCategory('human_review')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            activeCategory === 'human_review'
              ? 'bg-white border-rose-500 ring-1 ring-rose-500 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Human Review Escalations</span>
            <div className="w-7 h-7 rounded bg-rose-50 flex items-center justify-center text-rose-600">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{riskData.casesRequiringHumanReview.count} <span className="text-xs font-normal text-slate-500">Urgent</span></div>
          <p className="text-xs text-slate-500 mt-1">
            Acute coronary triage delays, unassisted fall hazards, and clinical infection deflections.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-rose-800">
            Risk: Sentinel adverse events & malpractice
          </div>
        </div>
      </div>

      {/* Interactive Case Tracker & Clinical Audit Panel */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-slate-900">
              Active Clinical Safety & Risk Audit Queue
            </h3>
            <span className="text-xs text-slate-500">({riskData.casesRequiringHumanReview.items.length} items logged)</span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium mr-1">Filter View:</span>
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium ${
                activeCategory === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              All Flags
            </button>
            <button
              onClick={() => setActiveCategory('hallucination')}
              className={`px-2.5 py-1 rounded text-xs font-medium ${
                activeCategory === 'hallucination' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              Hallucinations ({riskData.hallucinationTraps.count})
            </button>
            <button
              onClick={() => setActiveCategory('bias')}
              className={`px-2.5 py-1 rounded text-xs font-medium ${
                activeCategory === 'bias' ? 'bg-purple-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              Bias ({riskData.biasRelatedComments.count})
            </button>
            <button
              onClick={() => setActiveCategory('human_review')}
              className={`px-2.5 py-1 rounded text-xs font-medium ${
                activeCategory === 'human_review' ? 'bg-rose-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              Human Review ({riskData.casesRequiringHumanReview.count})
            </button>
          </div>
        </div>

        {/* List of Flagged Comments */}
        <div className="divide-y divide-slate-100">
          {(activeCategory === 'all'
            ? [...riskData.casesRequiringHumanReview.items, ...riskData.hallucinationTraps.items, ...riskData.biasRelatedComments.items].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
            : activeCategory === 'hallucination'
            ? riskData.hallucinationTraps.items
            : activeCategory === 'bias'
            ? riskData.biasRelatedComments.items
            : riskData.casesRequiringHumanReview.items
          ).map((item) => {
            const isSelected = selectedCase?.id === item.id;
            return (
              <div
                key={item.id}
                className={`p-4 transition-colors ${
                  isSelected ? 'bg-teal-50/50' : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-800">{item.id}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-semibold text-slate-900">{item.serviceLine}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">{item.persona}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getStatusBadge(item.humanReviewStatus)}`}>
                      {getStatusLabel(item.humanReviewStatus)}
                    </span>

                    {/* Quick status dropdown */}
                    {onUpdateStatus && (
                      <select
                        value={item.humanReviewStatus || 'pending'}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value as any)}
                        className="text-[11px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="pending">Pending Review</option>
                        <option value="in_audit">In Quality Audit</option>
                        <option value="escalated_cmo">Escalate to CMO</option>
                        <option value="resolved">Mark Resolved</option>
                      </select>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-700 italic mb-2 leading-relaxed bg-slate-50/80 p-2.5 rounded border border-slate-100">
                  "{item.rawComment}"
                </p>

                {item.riskDetails && (
                  <div className="text-xs text-rose-800 bg-rose-50/60 border border-rose-200/60 p-2 rounded flex items-start space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold">Clinical Governance Alert:</strong> {item.riskDetails}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
