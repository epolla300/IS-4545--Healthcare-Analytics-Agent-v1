import React from 'react';
import { MessageSquare, Star, MessageCircle, CheckCircle2, Building2, TrendingUp, AlertTriangle } from 'lucide-react';
import { ExecutiveMetrics } from '../types/dashboard';

interface Section1ExecutiveOverviewProps {
  metrics: ExecutiveMetrics;
  onExploreComments?: () => void;
}

export const Section1ExecutiveOverview: React.FC<Section1ExecutiveOverviewProps> = ({
  metrics,
  onExploreComments,
}) => {
  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-teal-700">Section 1</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">C-Suite Quality & Experience Scorecard</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Executive Overview
          </h2>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center space-x-3 text-xs text-slate-500">
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
            HCAHPS Target: ≥4.20
          </span>
          <span>·</span>
          <span>Rolling 90-Day Analysis</span>
        </div>
      </div>

      {/* 5 Primary Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-5">
        {/* KPI 1: Comments Analyzed */}
        <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">Total Comments</span>
            <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-600">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {metrics.totalComments.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span className="text-emerald-700 font-semibold flex items-center mr-1">
              <TrendingUp className="w-3 h-3 mr-0.5 inline" /> +14.2%
            </span>
            <span>vs previous quarter</span>
          </div>
        </div>

        {/* KPI 2: Patient Satisfaction */}
        <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">Avg Satisfaction</span>
            <div className="w-7 h-7 rounded bg-amber-50 flex items-center justify-center text-amber-600">
              <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics.avgSatisfaction}
            </div>
            <span className="text-xs font-medium text-slate-400">/ 5.0</span>
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span className={metrics.avgSatisfaction >= 4.0 ? 'text-emerald-700 font-semibold mr-1' : 'text-amber-700 font-semibold mr-1'}>
              {metrics.avgSatisfaction >= 4.1 ? 'Above Nat’l Avg (4.10)' : 'Below Nat’l Avg (4.10)'}
            </span>
          </div>
        </div>

        {/* KPI 3: Communication Rating */}
        <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">Communication</span>
            <div className="w-7 h-7 rounded bg-teal-50 flex items-center justify-center text-teal-600">
              <MessageCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics.avgCommunication}
            </div>
            <span className="text-xs font-medium text-slate-400">/ 5.0</span>
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span className="text-slate-600 font-medium">Physician & Nurse clarity</span>
          </div>
        </div>

        {/* KPI 4: Follow-up Compliance Rate */}
        <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">Follow-up Compliance</span>
            <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center text-blue-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics.followUpComplianceRate}%
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span className={metrics.followUpComplianceRate >= 80 ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
              {metrics.followUpComplianceRate >= 80 ? 'Meets CMS standard' : 'Lagging Target (85%)'}
            </span>
          </div>
        </div>

        {/* KPI 5: Service Lines Represented */}
        <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">Service Lines</span>
            <div className="w-7 h-7 rounded bg-purple-50 flex items-center justify-center text-purple-600">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics.serviceLinesCount}
            </div>
            <span className="text-xs font-medium text-slate-400">Specialties</span>
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span>Inpatient & Ambulatory</span>
          </div>
        </div>
      </div>

      {/* Secondary Strategic Pulse Bar: Sentiment & Escalations */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-slate-700">Sentiment Distribution:</span>
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center text-emerald-800 font-medium">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 mr-1.5"></span>
              {metrics.positivePct}% Favorable
            </span>
            <span className="inline-flex items-center text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-400 mr-1.5"></span>
              {metrics.neutralPct}% Neutral
            </span>
            <span className="inline-flex items-center text-rose-800 font-medium">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 mr-1.5"></span>
              {metrics.negativePct}% Unfavorable
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-slate-600">
          {metrics.riskFlagsCount > 0 && (
            <div className="flex items-center text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded font-medium">
              <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
              <span>{metrics.riskFlagsCount} AI Risk Flags Detected</span>
            </div>
          )}
          {metrics.humanReviewCount > 0 && (
            <div className="flex items-center text-rose-800 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded font-medium">
              <span>{metrics.humanReviewCount} Cases Require Clinical Review</span>
            </div>
          )}
          {onExploreComments && (
            <button
              onClick={onExploreComments}
              className="text-teal-700 hover:text-teal-800 font-semibold underline underline-offset-2 ml-2"
            >
              Browse Verbatim Comments →
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
