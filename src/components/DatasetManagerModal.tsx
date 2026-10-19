import React, { useState } from 'react';
import { X, Upload, Check, Database, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { DATASET_PRESETS, RAW_PATIENT_COMMENTS } from '../data/patientFeedbackData';
import { PatientComment } from '../types/dashboard';

interface DatasetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  onCustomDatasetLoaded: (comments: PatientComment[], name: string) => void;
}

export const DatasetManagerModal: React.FC<DatasetManagerModalProps> = ({
  isOpen,
  onClose,
  activePresetId,
  onSelectPreset,
  onCustomDatasetLoaded,
}) => {
  const [customJsonInput, setCustomJsonInput] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onCustomDatasetLoaded(parsed, file.name);
            onClose();
          } else {
            setParseError('JSON must be an array of patient comment objects.');
          }
        } else {
          // Parse CSV lines
          const lines = text.split('\n').filter(Boolean);
          const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
          const comments: PatientComment[] = lines.slice(1).map((line, i) => {
            const cols = line.split(',');
            return {
              id: `CSV-${i + 1}`,
              patientId: `PT-${1000 + i}`,
              timestamp: new Date().toISOString(),
              serviceLine: 'Emergency Medicine',
              visitType: 'Emergency Department',
              persona: 'Working Parent / Family',
              satisfactionScore: Math.max(1, Math.min(5, parseInt(cols[1]) || 3)),
              communicationRating: 3,
              followedUp: true,
              sentiment: 'neutral',
              themes: ['Operational Delays'],
              keywords: ['feedback'],
              rawComment: cols[0] || 'Patient feedback recorded in file.',
              problemTags: ['wait_time'],
              riskCategory: 'none',
            };
          });

          onCustomDatasetLoaded(comments, file.name);
          onClose();
        }
      } catch (err: any) {
        setParseError(`Failed to parse file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handlePasteSubmit = () => {
    try {
      setParseError(null);
      const parsed = JSON.parse(customJsonInput);
      if (Array.isArray(parsed) && parsed.length > 0) {
        onCustomDatasetLoaded(parsed, 'Pasted Custom Dataset');
        onClose();
      } else {
        setParseError('Pasted text must be a JSON array of patient comment objects.');
      }
    } catch (err: any) {
      setParseError(`JSON format error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white rounded-t-lg flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">Select or Upload Patient Feedback Dataset</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Preset Selection */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Hospital Executive Benchmark Datasets</h4>
            <div className="space-y-2.5">
              {DATASET_PRESETS.map((preset) => {
                const isSelected = activePresetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onSelectPreset(preset.id);
                      onClose();
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50/50 border-teal-600 ring-1 ring-teal-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                      <span>{preset.name}</span>
                      {isSelected && (
                        <span className="flex items-center text-teal-700 text-xs font-bold">
                          <Check className="w-3.5 h-3.5 mr-1" /> Active
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 mb-2">{preset.description}</p>
                    <div className="flex items-center space-x-3 text-slate-600 text-[11px]">
                      <span>{preset.totalComments} Comments</span>
                      <span>·</span>
                      <span>Avg Satisfaction: {preset.avgSatisfaction}/5.0</span>
                      <span>·</span>
                      <span>Follow-up Rate: {preset.followUpComplianceRate}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upload Custom File */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1.5">Upload Custom Patient Feedback File</h4>
            <p className="text-slate-500 mb-3">
              Upload a custom CSV or JSON export containing patient satisfaction reviews and comments.
            </p>

            <div className="flex items-center space-x-3">
              <label className="inline-flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-800 font-semibold cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>Choose .csv or .json</span>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-slate-400">Accepted formats: .csv, .json</span>
            </div>

            {parseError && (
              <div className="mt-2 text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{parseError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
