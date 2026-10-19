import React, { useState } from 'react';
import { X, Search, Filter, Star, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { PatientComment } from '../types/dashboard';

interface CommentsTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: PatientComment[];
  onUpdateStatus?: (commentId: string, status: 'pending' | 'in_audit' | 'escalated_cmo' | 'resolved') => void;
}

export const CommentsTableModal: React.FC<CommentsTableModalProps> = ({
  isOpen,
  onClose,
  comments,
  onUpdateStatus,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');

  if (!isOpen) return null;

  const filtered = comments.filter((c) => {
    const matchesQuery =
      c.rawComment.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.serviceLine.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.persona.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(filterQuery.toLowerCase());

    const matchesTag =
      selectedTag === 'ALL' ||
      (selectedTag === 'risk' && c.riskCategory !== 'none') ||
      (selectedTag === 'negative' && c.sentiment === 'negative') ||
      (selectedTag === 'positive' && c.sentiment === 'positive') ||
      c.problemTags.includes(selectedTag as any);

    return matchesQuery && matchesTag;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white rounded-t-lg flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Patient Feedback Comments Explorer</h3>
            <p className="text-xs text-slate-400">Verbatim comments with NLP tags, sentiment, and clinical review status</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search comments by keyword, ID, service..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Quick Filter:</span>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 py-1.5 px-2 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="ALL">All ({comments.length})</option>
              <option value="risk">Risk Flagged</option>
              <option value="negative">Negative Sentiment</option>
              <option value="positive">Positive Sentiment</option>
              <option value="wait_time">Wait-Time Delays</option>
              <option value="communication_bottleneck">Communication Gaps</option>
              <option value="technology_issue">Technology Issues</option>
              <option value="scheduling_delay">Scheduling Delays</option>
            </select>

            <span className="text-slate-500 ml-2">Showing {filtered.length} of {comments.length}</span>
          </div>
        </div>

        {/* Comments Table */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No patient comments match your criteria.
            </div>
          ) : (
            filtered.map((c) => (
              <div key={c.id} className="p-4 hover:bg-slate-50/70 transition-colors text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-800">{c.id}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-slate-900">{c.serviceLine}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-600">{c.visitType}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">{c.persona}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center font-bold text-slate-800">
                      <span className="mr-1">{c.satisfactionScore}</span>
                      <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                    </div>

                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        c.sentiment === 'positive'
                          ? 'bg-emerald-50 text-emerald-800'
                          : c.sentiment === 'negative'
                          ? 'bg-rose-50 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.sentiment}
                    </span>

                    {c.riskCategory !== 'none' && (
                      <span className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded font-bold text-[10px]">
                        {c.riskCategory.replace('_', ' ').toUpperCase()}
                      </span>
                    )}

                    {onUpdateStatus && c.humanReviewStatus && (
                      <select
                        value={c.humanReviewStatus}
                        onChange={(e) => onUpdateStatus(c.id, e.target.value as any)}
                        className="bg-slate-100 border border-slate-200 text-slate-800 rounded px-1 py-0.5 text-[11px]"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_audit">In Audit</option>
                        <option value="escalated_cmo">Escalated</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    )}
                  </div>
                </div>

                <p className="text-slate-800 italic leading-relaxed mb-2 bg-slate-50 p-2.5 rounded border border-slate-100">
                  "{c.rawComment}"
                </p>

                {c.riskDetails && (
                  <div className="text-[11px] text-rose-800 bg-rose-50 border border-rose-200 px-2 py-1 rounded mb-2">
                    <strong>Audit Flag:</strong> {c.riskDetails}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="text-slate-400">Themes:</span>
                  {c.themes.map((t, idx) => (
                    <span key={idx} className="bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                      {t}
                    </span>
                  ))}
                  <span className="text-slate-300 mx-1">·</span>
                  <span className="text-slate-400">Keywords:</span>
                  {c.keywords.map((k, idx) => (
                    <span key={idx} className="text-teal-700 font-mono text-[10px]">
                      #{k}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Total records: {filtered.length}</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
