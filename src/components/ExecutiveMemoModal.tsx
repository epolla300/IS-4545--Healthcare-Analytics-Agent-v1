import React, { useState, useEffect } from 'react';
import { FileText, X, Printer, Copy, Check, Sparkles, Loader2 } from 'lucide-react';
import { ExecutiveMetrics } from '../types/dashboard';
import { generateExecutiveBriefMemo } from '../utils/agentIntelligence';

interface ExecutiveMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: ExecutiveMetrics;
  activeDatasetName: string;
}

export const ExecutiveMemoModal: React.FC<ExecutiveMemoModalProps> = ({
  isOpen,
  onClose,
  metrics,
  activeDatasetName,
}) => {
  const [memoText, setMemoText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadMemo();
    }
  }, [isOpen, activeDatasetName]);

  const loadMemo = async () => {
    setIsLoading(true);
    const focusArea = `Hospital Quality, Operations & HCAHPS Optimization (${activeDatasetName})`;
    const metricPayload = {
      totalComments: metrics.totalComments,
      avgSatisfaction: metrics.avgSatisfaction,
      avgCommunication: metrics.avgCommunication,
      followUpRate: metrics.followUpComplianceRate,
      riskFlagsCount: metrics.riskFlagsCount,
    };

    try {
      const response = await fetch('/api/ai/executive-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          focusArea,
          metrics: metricPayload
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Non-JSON response from server');
      }

      const data = await response.json();
      setMemoText(data.brief || generateExecutiveBriefMemo(focusArea, metricPayload));
    } catch (err) {
      console.warn('Executive brief API route unavailable, using client-side memo synthesizer:', err);
      setMemoText(generateExecutiveBriefMemo(focusArea, metricPayload));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(memoText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white rounded-t-lg flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Executive Memorandum</h3>
              <p className="text-xs text-slate-400">Hospital Quality & Operations Leadership Briefing</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 font-serif text-slate-800 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-teal-600 mb-2" />
              <span>Synthesizing Boardroom Executive Memorandum...</span>
            </div>
          ) : (
            <div className="bg-white p-6 rounded border border-slate-200 shadow-2xs">
              {memoText}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Generated by Healthcare Analytics Agent · Board Governance Approved</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
