import React, { useState } from 'react';
import { Star, TrendingUp, AlertCircle, Users, Layers, ShieldAlert } from 'lucide-react';
import { PatientComment } from '../types/dashboard';
import {
  computeSatisfactionDistribution,
  computeSatisfactionByServiceLine,
  computeSatisfactionByVisitType,
  computeSatisfactionByPersona,
} from '../utils/analytics';

interface Section2SatisfactionInsightsProps {
  comments: PatientComment[];
  onSelectServiceLine?: (sl: string) => void;
  onSelectPersona?: (p: string) => void;
}

export const Section2SatisfactionInsights: React.FC<Section2SatisfactionInsightsProps> = ({
  comments,
  onSelectServiceLine,
  onSelectPersona,
}) => {
  const distribution = computeSatisfactionDistribution(comments);
  const byServiceLine = computeSatisfactionByServiceLine(comments);
  const byVisitType = computeSatisfactionByVisitType(comments);
  const byPersona = computeSatisfactionByPersona(comments);

  const [activeTab, setActiveTab] = useState<'all' | 'serviceline' | 'persona'>('all');

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-teal-700">Section 2</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Patient Sentiment & Multi-Dimensional Segmentation</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Patient Satisfaction Insights
          </h2>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              activeTab === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Executive Grid
          </button>
          <button
            onClick={() => setActiveTab('serviceline')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              activeTab === 'serviceline' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Service Lines
          </button>
          <button
            onClick={() => setActiveTab('persona')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              activeTab === 'persona' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Patient Personas
          </button>
        </div>
      </div>

      {/* Main Grid Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Visual 1: Satisfaction Distribution Histogram (Left 4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                1. Satisfaction Distribution
              </h3>
              <span className="text-xs text-slate-500">1 to 5 Stars</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Distribution of numeric scores across all analyzed patient interactions.
            </p>

            <div className="space-y-3">
              {distribution.slice().reverse().map((item) => (
                <div key={item.stars} className="flex items-center text-xs">
                  <div className="w-14 flex items-center font-medium text-slate-700">
                    <span className="mr-1">{item.stars}</span>
                    <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                  </div>
                  <div className="flex-1 mx-2 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.stars >= 4 ? 'bg-emerald-500' : item.stars === 3 ? 'bg-amber-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.max(item.percentage, 4)}%` }}
                    />
                  </div>
                  <div className="w-16 text-right font-medium text-slate-600">
                    {item.percentage}% <span className="text-slate-400">({item.count})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 text-xs text-slate-500 bg-slate-50/80 p-2.5 rounded">
            <span className="font-semibold text-slate-700">Key Finding:</span> 1-star ratings are concentrated heavily in emergency triage and post-op care transitions.
          </div>
        </div>

        {/* Visual 2: Satisfaction by Service Line (Center/Right 8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-900">
              2. Satisfaction by Clinical Service Line
            </h3>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span className="w-2.5 h-0.5 bg-blue-500 inline-block"></span>
              <span>Nat'l Benchmark: 4.10</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Comparison of average satisfaction score, complaint frequency, and benchmark delta. Click any line to filter.
          </p>

          <div className="space-y-3">
            {byServiceLine.map((sl) => {
              const scorePct = (sl.avgSatisfaction / 5.0) * 100;
              const isLow = sl.avgSatisfaction < 3.8;
              return (
                <div
                  key={sl.serviceLine}
                  onClick={() => onSelectServiceLine && onSelectServiceLine(sl.serviceLine)}
                  className="group p-2 rounded hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-800 group-hover:text-teal-700 transition-colors">
                      {sl.serviceLine}
                    </span>
                    <div className="flex items-center space-x-3 text-slate-600">
                      <span className="text-slate-400">{sl.volume} comments</span>
                      <span className={`font-semibold ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>
                        {sl.avgSatisfaction} / 5.0
                      </span>
                      <span className={`text-[11px] font-medium px-1.5 py-0.2 rounded ${
                        sl.complaintRate > 40 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {sl.complaintRate}% complaints
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar: Score with Benchmark Guide */}
                  <div className="relative w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    {/* Benchmark vertical indicator at 82% (4.1/5.0) */}
                    <div className="absolute left-[82%] top-0 bottom-0 w-0.5 bg-blue-500 z-10" />
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        sl.avgSatisfaction >= 4.2
                          ? 'bg-emerald-500'
                          : sl.avgSatisfaction >= 3.8
                          ? 'bg-teal-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${scorePct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual 3: Satisfaction by Visit Type (Left 6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center">
              <Layers className="w-4 h-4 mr-1.5 text-teal-600" />
              3. Satisfaction by Visit Type
            </h3>
            <span className="text-xs text-slate-500">Acuity & Setting</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Comparison of satisfaction and post-encounter follow-up compliance across care settings.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {byVisitType.map((vt) => (
              <div key={vt.visitType} className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-md">
                <div className="text-xs font-semibold text-slate-800 truncate mb-1">
                  {vt.visitType}
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold text-slate-900">{vt.avgSatisfaction} <span className="text-xs font-normal text-slate-500">/ 5.0</span></span>
                  <span className="text-xs text-slate-500">{vt.volume} reviews</span>
                </div>
                <div className="mt-2 text-xs flex items-center justify-between text-slate-600">
                  <span>Follow-up Rate:</span>
                  <span className={`font-semibold ${vt.followUpRate >= 75 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {vt.followUpRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual 4: Satisfaction by Patient Persona (Right 6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center">
              <Users className="w-4 h-4 mr-1.5 text-indigo-600" />
              4. Satisfaction by Patient Persona
            </h3>
            <span className="text-xs text-slate-500">Demographic Variance</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Revealing satisfaction disparities and digital friction across distinct patient cohorts.
          </p>

          <div className="space-y-2.5">
            {byPersona.map((p) => {
              const isDisparate = p.avgSatisfaction < 3.5;
              return (
                <div
                  key={p.persona}
                  onClick={() => onSelectPersona && onSelectPersona(p.persona)}
                  className="p-2.5 rounded-md border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 cursor-pointer transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800">{p.persona}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${isDisparate ? 'text-rose-600' : 'text-slate-900'}`}>
                        {p.avgSatisfaction} / 5.0
                      </span>
                      {isDisparate && (
                        <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded font-medium">
                          Equity Gap
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-100 text-slate-500 text-[11px]">
                    <div>
                      Comm. Score: <span className="font-semibold text-slate-700">{p.avgCommunication}</span>
                    </div>
                    <div>
                      Follow-up: <span className="font-semibold text-slate-700">{p.followUpRate}%</span>
                    </div>
                    <div>
                      Tech Friction: <span className="font-semibold text-slate-700">{p.digitalFrictionRate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
