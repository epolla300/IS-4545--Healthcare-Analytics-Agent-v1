import React, { useState } from 'react';
import { AlertOctagon, Clock, PhoneCall, Laptop, Calendar, ChevronRight, Quote } from 'lucide-react';
import { PatientComment } from '../types/dashboard';
import { computeHiddenProblems, computeSatisfactionByServiceLine } from '../utils/analytics';

interface Section4HiddenProblemsProps {
  comments: PatientComment[];
  onOpenRawCommentsForTag?: (tag: string) => void;
}

export const Section4HiddenProblems: React.FC<Section4HiddenProblemsProps> = ({
  comments,
  onOpenRawCommentsForTag,
}) => {
  const problems = computeHiddenProblems(comments);
  const serviceLines = computeSatisfactionByServiceLine(comments);
  const highComplaintLines = serviceLines.filter((s) => s.complaintRate >= 35);

  const [activeCard, setActiveCard] = useState<'wait' | 'comm' | 'tech' | 'sched'>('wait');

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-rose-700">Section 4</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Root-Cause Diagnostics</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Hidden Organizational Problems
          </h2>
        </div>
        <div className="mt-2 sm:mt-0 text-xs text-slate-500 flex items-center">
          <AlertOctagon className="w-3.5 h-3.5 text-rose-600 mr-1.5" />
          <span>Surfacing latent operational friction masked by aggregate averages</span>
        </div>
      </div>

      {/* Top Banner: Service Lines with Unusually High Complaint Rates */}
      <div className="mb-5 bg-rose-50/70 border border-rose-200/90 rounded-lg p-4">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-xs">
              ALERT
            </div>
            <div>
              <h3 className="text-sm font-semibold text-rose-950">
                Service Lines with Unusually High Complaint Rates (&gt;35% Unfavorable)
              </h3>
              <p className="text-xs text-rose-800/90 mt-0.5">
                These clinical areas generate disproportionate negative sentiment and CAHPS penalties:
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3.5">
          {highComplaintLines.map((line) => (
            <div key={line.serviceLine} className="bg-white/90 p-3 rounded border border-rose-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-900">{line.serviceLine}</span>
                <span className="font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded text-[11px]">
                  {line.complaintRate}% Complaints
                </span>
              </div>
              <div className="text-xs text-slate-600 flex items-center justify-between mt-2">
                <span>Avg Rating: <strong className="text-slate-900">{line.avgSatisfaction}/5.0</strong></span>
                <span className="text-slate-400">{line.volume} reviews</span>
              </div>
              <div className="mt-2 text-[11px] text-rose-700 font-medium">
                Δ vs Nat'l Benchmark: {line.deltaToBenchmark} pts
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Interactive Problem Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        {/* Pillar 1: Wait-Time Complaints */}
        <div
          onClick={() => setActiveCard('wait')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            activeCard === 'wait'
              ? 'bg-white border-teal-600 ring-1 ring-teal-600 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Wait-Time Delays</span>
            <div className="w-7 h-7 rounded bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{problems.waitTime.count} <span className="text-xs font-normal text-slate-500">cases</span></div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="font-semibold text-rose-600">{problems.waitTime.pctOfTotal}%</span> of all complaints
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
            Avg satisfaction when delayed: <strong>{problems.waitTime.avgSatisfaction} / 5.0</strong>
          </div>
        </div>

        {/* Pillar 2: Communication Bottlenecks */}
        <div
          onClick={() => setActiveCard('comm')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            activeCard === 'comm'
              ? 'bg-white border-teal-600 ring-1 ring-teal-600 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Communication Gaps</span>
            <div className="w-7 h-7 rounded bg-teal-50 flex items-center justify-center text-teal-600">
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{problems.communicationBottlenecks.count} <span className="text-xs font-normal text-slate-500">cases</span></div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="font-semibold text-rose-600">{problems.communicationBottlenecks.pctOfTotal}%</span> of all complaints
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
            Handoffs & call-bell response delays
          </div>
        </div>

        {/* Pillar 3: Technology-Related Issues */}
        <div
          onClick={() => setActiveCard('tech')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            activeCard === 'tech'
              ? 'bg-white border-teal-600 ring-1 ring-teal-600 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Tech & Portal Friction</span>
            <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center text-blue-600">
              <Laptop className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{problems.technologyIssues.count} <span className="text-xs font-normal text-slate-500">cases</span></div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="font-semibold text-rose-600">{problems.technologyIssues.pctOfTotal}%</span> of all complaints
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
            2FA lockouts, video crashes, kiosk UX
          </div>
        </div>

        {/* Pillar 4: Scheduling Delays */}
        <div
          onClick={() => setActiveCard('sched')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            activeCard === 'sched'
              ? 'bg-white border-teal-600 ring-1 ring-teal-600 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Scheduling Gridlock</span>
            <div className="w-7 h-7 rounded bg-purple-50 flex items-center justify-center text-purple-600">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{problems.schedulingIssues.count} <span className="text-xs font-normal text-slate-500">cases</span></div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="font-semibold text-rose-600">{problems.schedulingIssues.pctOfTotal}%</span> of all complaints
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
            45m phone holds, cancelled slots
          </div>
        </div>
      </div>

      {/* Selected Problem Deep-Dive Card */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        {activeCard === 'wait' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Deep-Dive: Wait-Time & Triage Bottleneck
                </h4>
              </div>
              <span className="text-xs text-slate-500 font-medium">Impact: -1.45 pts on Satisfaction</span>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Patients do not merely object to absolute wait durations; their frustration compounds exponentially when left in sub-waiting bays with <strong>zero status updates or visibility into clinical acuity prioritization</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                <div className="text-xs font-semibold text-slate-800 mb-2">Primary Concentrated Service Lines:</div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {problems.waitTime.topServiceLines.map((item) => (
                    <div key={item.service} className="flex justify-between items-center py-0.5 border-b border-slate-200/60 last:border-0">
                      <span>{item.service}</span>
                      <span className="font-bold text-slate-900">{item.count} complaints</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-800">Verbatim Patient Evidence:</div>
                {problems.waitTime.sampleQuotes.map((q) => (
                  <div key={q.id} className="text-xs bg-slate-50 p-2.5 rounded border border-slate-200/70 text-slate-700 italic flex items-start space-x-2">
                    <Quote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span>"{q.text}"</span>
                      <div className="text-[10px] text-slate-500 not-italic mt-1 font-medium">{q.service} · {q.id}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeCard === 'comm' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-teal-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Deep-Dive: Communication Bottlenecks & Call Responsiveness
                </h4>
              </div>
              <span className="text-xs text-slate-500 font-medium">Impact: -1.22 pts on Satisfaction</span>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Communication gaps manifest most critically during <strong>shift handoffs, contradictory discharge medication advice, and delayed call-bell responses</strong>, heightening fall risks and anxiety.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                <div className="text-xs font-semibold text-slate-800 mb-2">Affected Service Lines:</div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {problems.communicationBottlenecks.topServiceLines.map((item) => (
                    <div key={item.service} className="flex justify-between items-center py-0.5 border-b border-slate-200/60 last:border-0">
                      <span>{item.service}</span>
                      <span className="font-bold text-slate-900">{item.count} complaints</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-800">Verbatim Patient Evidence:</div>
                {problems.communicationBottlenecks.sampleQuotes.map((q) => (
                  <div key={q.id} className="text-xs bg-slate-50 p-2.5 rounded border border-slate-200/70 text-slate-700 italic flex items-start space-x-2">
                    <Quote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span>"{q.text}"</span>
                      <div className="text-[10px] text-slate-500 not-italic mt-1 font-medium">{q.service} · {q.id}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeCard === 'tech' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Laptop className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Deep-Dive: Technology & Digital Portal Friction
                </h4>
              </div>
              <span className="text-xs text-slate-500 font-medium">Impact: -0.58 pts on Satisfaction</span>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Mandatory digital self-check-in kiosks and complex 2-factor authentication workflows create <strong>severe barriers for geriatric patients</strong> and lead to cancelled virtual appointments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                <div className="text-xs font-semibold text-slate-800 mb-2">Primary Friction Nodes:</div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {problems.technologyIssues.topServiceLines.map((item) => (
                    <div key={item.service} className="flex justify-between items-center py-0.5 border-b border-slate-200/60 last:border-0">
                      <span>{item.service}</span>
                      <span className="font-bold text-slate-900">{item.count} complaints</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-800">Verbatim Patient Evidence:</div>
                {problems.technologyIssues.sampleQuotes.map((q) => (
                  <div key={q.id} className="text-xs bg-slate-50 p-2.5 rounded border border-slate-200/70 text-slate-700 italic flex items-start space-x-2">
                    <Quote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span>"{q.text}"</span>
                      <div className="text-[10px] text-slate-500 not-italic mt-1 font-medium">{q.service} · {q.id}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeCard === 'sched' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Deep-Dive: Scheduling Gridlock & Telephony Friction
                </h4>
              </div>
              <span className="text-xs text-slate-500 font-medium">Impact: -1.15 pts on Satisfaction</span>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Legacy call-center phone trees result in average <strong>hold durations exceeding 40 minutes</strong> and high abandoned call rates, directly deflecting high-margin surgical referrals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                <div className="text-xs font-semibold text-slate-800 mb-2">Affected Specialty Clinics:</div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {problems.schedulingIssues.topServiceLines.map((item) => (
                    <div key={item.service} className="flex justify-between items-center py-0.5 border-b border-slate-200/60 last:border-0">
                      <span>{item.service}</span>
                      <span className="font-bold text-slate-900">{item.count} complaints</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-800">Verbatim Patient Evidence:</div>
                {problems.schedulingIssues.sampleQuotes.map((q) => (
                  <div key={q.id} className="text-xs bg-slate-50 p-2.5 rounded border border-slate-200/70 text-slate-700 italic flex items-start space-x-2">
                    <Quote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span>"{q.text}"</span>
                      <div className="text-[10px] text-slate-500 not-italic mt-1 font-medium">{q.service} · {q.id}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
