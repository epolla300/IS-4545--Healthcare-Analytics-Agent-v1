import React from 'react';
import { Target, Zap, Rocket, Calendar, UserCheck, ShieldCheck, TrendingUp, ArrowUpRight } from 'lucide-react';
import { EXECUTIVE_PRIORITIES } from '../data/patientFeedbackData';

interface Section9ExecutiveRecommendationsProps {
  onOpenMemo?: () => void;
}

export const Section9ExecutiveRecommendations: React.FC<Section9ExecutiveRecommendationsProps> = ({
  onOpenMemo,
}) => {
  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-teal-700">Section 9</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Boardroom Strategic Roadmap</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Executive Recommendations & Action Roadmap
          </h2>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center space-x-2">
          {onOpenMemo && (
            <button
              onClick={onOpenMemo}
              className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-2xs transition-colors"
            >
              <span>Export Executive Memo</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          )}
        </div>
      </div>

      {/* Top 5 Organizational Priorities Table/Cards */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs mb-6 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Top 5 Organizational Priorities
            </h3>
          </div>
          <span className="text-xs text-slate-500">Ranked by Clinical & Financial Urgency</span>
        </div>

        <div className="divide-y divide-slate-100">
          {EXECUTIVE_PRIORITIES.map((p) => {
            const isUrgent = p.priorityLevel === 'Urgent';
            return (
              <div key={p.id} className="p-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {p.rank}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {p.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                      isUrgent ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {p.priorityLevel}
                    </span>
                    <span className="text-xs text-slate-500 font-medium bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                      {p.timeframe}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-3 leading-relaxed pl-8.5">
                  {p.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8.5 text-xs">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200/70 text-slate-700">
                    <span className="font-semibold text-slate-900">Target Outcome Metric: </span>
                    <span>{p.targetMetric}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200/70 text-slate-700 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900">Lead Owner: </span>
                      <span>{p.leadOwner}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Quick Wins vs Long-Term AI Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quick Wins (Within 3 Months) */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 rounded bg-amber-50 flex items-center justify-center text-amber-600">
              <Zap className="w-4 h-4 fill-amber-500 stroke-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Quick Wins (Within 3 Months)
              </h3>
              <p className="text-xs text-slate-500">Immediate operational fixes with minimal capital expense</p>
            </div>
          </div>

          <div className="space-y-3 mt-4 text-xs text-slate-700">
            <div className="p-3 bg-amber-50/40 border border-amber-200/70 rounded-md">
              <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                <span>1. ED "Comfort & Status" Hourly Rounding Protocol</span>
                <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">30 Days</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Mandate a dedicated patient navigator to conduct 45-minute comfort check-ins with patients in the waiting bay, providing estimated triage pacing and water/blanket support.
              </p>
            </div>

            <div className="p-3 bg-amber-50/40 border border-amber-200/70 rounded-md">
              <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                <span>2. Telephony Hold Time Cap & Callback Queuing</span>
                <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">45 Days</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Activate automatic virtual hold with automated return calls when wait time exceeds 3 minutes across cardiology, orthopedics, and surgical clinics.
              </p>
            </div>

            <div className="p-3 bg-amber-50/40 border border-amber-200/70 rounded-md">
              <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                <span>3. Bedside Multilingual Discharge Checklists</span>
                <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">60 Days</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Require certified medical interpreter signature on discharge packets for non-native English speakers to eliminate contradictory medication confusion.
              </p>
            </div>
          </div>
        </div>

        {/* Long-Term AI Opportunities (6–12 Months) */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-teal-600">
              <Rocket className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Long-Term AI Opportunities (6–12 Months)
              </h3>
              <p className="text-xs text-slate-500">Transformative clinical automation & predictive systems</p>
            </div>
          </div>

          <div className="space-y-3 mt-4 text-xs text-slate-700">
            <div className="p-3 bg-teal-50/40 border border-teal-200/70 rounded-md">
              <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                <span>1. Autonomous EHR Discharge Synthesis Agent</span>
                <span className="text-[10px] text-teal-800 bg-teal-100 px-1.5 py-0.2 rounded font-semibold">Phase 1 Pilot</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Integration with Epic/Cerner to ingest raw physician clinical notes and generate patient-tailored, multi-language plain-English discharge instructions with audio readback.
              </p>
            </div>

            <div className="p-3 bg-teal-50/40 border border-teal-200/70 rounded-md">
              <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                <span>2. Dynamic Specialty Slot Rebalancing Engine</span>
                <span className="text-[10px] text-teal-800 bg-teal-100 px-1.5 py-0.2 rounded font-semibold">Phase 2 System</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                AI scheduling agent that predicts patient no-show probabilities, autonomous conversational SMS backfilling, and dynamic buffering of high-acuity referral queues.
              </p>
            </div>

            <div className="p-3 bg-teal-50/40 border border-teal-200/70 rounded-md">
              <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                <span>3. Continuous Patient Sentiment & Equity Sentinel</span>
                <span className="text-[10px] text-teal-800 bg-teal-100 px-1.5 py-0.2 rounded font-semibold">Enterprise</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Real-time unstructured feedback NLP stream connecting nurse call bells, portal messages, and CAHPS returns to automatically escalate acute patient risk flags within 4 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
