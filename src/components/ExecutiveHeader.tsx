import React from 'react';
import { Activity, Sparkles, FileText, Upload, RefreshCw, ShieldCheck } from 'lucide-react';

interface ExecutiveHeaderProps {
  activePresetName: string;
  uploadedFilesCount?: number;
  onOpenAskAgent: () => void;
  onOpenMemo: () => void;
  onOpenDatasetModal: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  activePresetName,
  uploadedFilesCount = 0,
  onOpenAskAgent,
  onOpenMemo,
  onOpenDatasetModal,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Activity className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-semibold tracking-tight text-white">
                  Healthcare Analytics Agent
                </span>
                <span className="text-xs font-medium text-teal-400 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
                  Executive Suite
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                <span>Hospital Quality & Operations Intelligence</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300 font-medium truncate max-w-xs">{activePresetName}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2.5">
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-md transition-colors border border-slate-700"
                title="Reset active slice filters"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

            <button
              onClick={onOpenDatasetModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700 rounded-md transition-colors border border-slate-700"
              title="View and manage only files that you upload"
            >
              <Upload className="w-3.5 h-3.5 text-teal-400" />
              <span>Uploaded Files {uploadedFilesCount > 0 ? `(${uploadedFilesCount})` : ''}</span>
            </button>

            <button
              onClick={onOpenMemo}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700 rounded-md transition-colors border border-slate-700"
            >
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Executive Memo</span>
            </button>

            <button
              onClick={onOpenAskAgent}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-md transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Analytics Agent</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
