import React, { useState } from 'react';
import { HeartHandshake, Globe, Accessibility, Smartphone, CheckSquare, AlertTriangle } from 'lucide-react';
import { PatientComment } from '../types/dashboard';
import { computeEquityInsights } from '../utils/analytics';

interface Section6HealthcareEquityProps {
  comments: PatientComment[];
}

export const Section6HealthcareEquity: React.FC<Section6HealthcareEquityProps> = ({ comments }) => {
  const equity = computeEquityInsights(comments);
  const [activeFilter, setActiveFilter] = useState<'all' | 'language' | 'accessibility' | 'digital'>('all');

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-indigo-700">Section 6</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Civil Rights & Health Equity Framework</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Healthcare Equity and Accessibility
          </h2>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center space-x-2 text-xs text-slate-600 bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-md">
          <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
          <span>Title VI Compliance & Vulnerable Cohort Monitoring</span>
        </div>
      </div>

      {/* 4 Diagnostic Equity Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {/* Pillar 1: Language Barriers */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Language Barriers</span>
            <div className="w-7 h-7 rounded bg-amber-50 flex items-center justify-center text-amber-600">
              <Globe className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {equity.languageBarriers.count} <span className="text-xs font-normal text-slate-500">Grievances</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Interpreter unavailability and untranslated discharge documentation.
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-700 mb-1.5">Impacted Primary Languages:</div>
            <div className="flex flex-wrap gap-1 text-[11px]">
              {Object.entries(equity.languageBarriers.breakdown).map(([lang, count]) => (
                <span key={lang} className="bg-amber-50 text-amber-800 border border-amber-200/70 px-2 py-0.5 rounded">
                  {lang}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pillar 2: Accessibility Concerns */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Accessibility Needs</span>
            <div className="w-7 h-7 rounded bg-teal-50 flex items-center justify-center text-teal-600">
              <Accessibility className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {equity.accessibilityConcerns.count} <span className="text-xs font-normal text-slate-500">Concerns</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Physical transit, gurney delays, broken ramps, and home discharge barriers.
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Critical Risk:</span> High rate of unassisted falls when wheelchair transport staff are delayed &gt;30 mins.
          </div>
        </div>

        {/* Pillar 3: Digital Literacy Challenges */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Digital Exclusion</span>
            <div className="w-7 h-7 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {equity.digitalLiteracyChallenges.count} <span className="text-xs font-normal text-slate-500">Reported</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Patients locked out by multi-factor auth, kiosk check-in, or lack of smartphones.
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Disparity:</span> Senior follow-up adherence drops to 64% when only digital portal options are offered.
          </div>
        </div>
      </div>

      {/* Cross-Persona Comparative Disparity Table */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Differences Across Patient Personas
          </h3>
          <span className="text-xs text-slate-500">Care Transition & Communication Equity</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Patient Persona</th>
                <th className="py-2.5 px-3 text-center">Satisfaction</th>
                <th className="py-2.5 px-3 text-center">Communication Rating</th>
                <th className="py-2.5 px-3 text-center">Follow-up Adherence</th>
                <th className="py-2.5 px-3 text-center">Digital Friction</th>
                <th className="py-2.5 px-3">Equity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {equity.personaComparison.map((p) => {
                const isDisparate = p.avgSatisfaction < 3.5 || p.followUpRate < 70;
                return (
                  <tr key={p.persona} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {p.persona}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`font-bold ${isDisparate ? 'text-rose-600' : 'text-slate-900'}`}>
                        {p.avgSatisfaction} / 5.0
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-medium">
                      {p.avgCommunication} / 5.0
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`font-semibold ${p.followUpRate < 70 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {p.followUpRate}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-medium">
                      {p.digitalFrictionRate}%
                    </td>
                    <td className="py-3 px-3">
                      {isDisparate ? (
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                          Action Required
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          Stable Standard
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verbatim Equity Patient Narratives */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 mb-3">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Executive Narrative Callout: Equity & Access Vulnerabilities</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {equity.languageBarriers.comments.slice(0, 1).map((c) => (
            <div key={c.id} className="bg-white p-3 rounded border border-slate-200 text-slate-700">
              <div className="flex items-center justify-between text-[11px] font-medium text-amber-800 mb-1">
                <span>Language Access Deficit · {c.serviceLine}</span>
                <span>ID: {c.id}</span>
              </div>
              <p className="italic text-slate-600">"{c.rawComment}"</p>
            </div>
          ))}

          {equity.accessibilityConcerns.comments.slice(0, 1).map((c) => (
            <div key={c.id} className="bg-white p-3 rounded border border-slate-200 text-slate-700">
              <div className="flex items-center justify-between text-[11px] font-medium text-indigo-800 mb-1">
                <span>Mobility & Discharge Accessibility · {c.serviceLine}</span>
                <span>ID: {c.id}</span>
              </div>
              <p className="italic text-slate-600">"{c.rawComment}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
