import React, { useState, useRef } from 'react';
import { X, Upload, Check, Trash2, FileSpreadsheet, FileText, AlertCircle, Plus, Download, HardDrive } from 'lucide-react';
import { PatientComment } from '../types/dashboard';
import { parseUploadedFileContent, UploadedDataset } from '../utils/csvParser';

interface DatasetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadedDatasets: UploadedDataset[];
  activeDatasetId: string;
  onSelectDataset: (datasetId: string) => void;
  onUploadNewFile: (fileName: string, comments: PatientComment[], fileSize: string) => void;
  onDeleteDataset: (datasetId: string) => void;
}

export const DatasetManagerModal: React.FC<DatasetManagerModalProps> = ({
  isOpen,
  onClose,
  uploadedDatasets,
  activeDatasetId,
  onSelectDataset,
  onUploadNewFile,
  onDeleteDataset,
}) => {
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessFile = (file: File) => {
    setParseError(null);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const fileSizeStr = (file.size / 1024).toFixed(1) + ' KB';
        const parsedComments = parseUploadedFileContent(file.name, text);

        onUploadNewFile(file.name, parsedComments, fileSizeStr);
        setParseError(null);
      } catch (err: any) {
        setParseError(`Parsing error in "${file.name}": ${err.message}`);
      }
    };

    reader.onerror = () => {
      setParseError('Failed to read file from disk.');
    };

    reader.readAsText(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDownloadSampleCSV = () => {
    const sampleCSV = `comment,satisfaction,communication,service_line,visit_type,persona,followed_up
"Waited 4 hours in the Emergency Department waiting room with severe vomiting before triage checked on us.",2,2,"Emergency Medicine","Emergency Department","Working Parent / Family",false
"Dr. Vance in Cardiology sat down with my family and carefully explained my new beta-blocker schedule.",5,5,"Cardiology & Heart Center","Inpatient Admission","Chronically Ill Senior",true
"Chemotherapy consultation had no Spanish translator present and only provided English pamphlets.",2,1,"Oncology & Infusion","Outpatient Clinic","Non-Native English Speaker",true
"The telehealth portal video connection crashed twice and then locked me out with a 2FA prompt.",1,3,"Telehealth & Virtual Care","Telehealth Video","Tech-Savvy Young Adult",false
"Laparoscopic gallbladder surgery was smoothly handled. Night nurses were extremely attentive and kind.",4,4,"General Surgery","Inpatient Admission","Chronically Ill Senior",true
"Left on a gurney in the hallway for 3 hours with chest tightness before any EKG was conducted.",1,1,"Emergency Medicine","Emergency Department","Chronically Ill Senior",false`;

    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'patient_feedback_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white rounded-t-lg flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">My Uploaded Datasets</h3>
              <p className="text-xs text-slate-400">Only showing files uploaded by your organization</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Upload Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-5 text-center transition-colors ${
              isDragging ? 'border-teal-500 bg-teal-50/50' : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".csv,.json,.tsv,.txt"
              className="hidden"
            />

            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 mx-auto flex items-center justify-center mb-2">
              <Upload className="w-5 h-5" />
            </div>

            <p className="text-xs font-semibold text-slate-800">
              Drop your patient feedback file here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-teal-700 hover:text-teal-900 underline font-bold inline"
              >
                browse local files
              </button>
            </p>

            <p className="text-[11px] text-slate-500 mt-1">
              Supports CSV, JSON, TSV exports with patient comments, satisfaction scores, and service lines.
            </p>
          </div>

          {parseError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{parseError}</span>
            </div>
          )}

          {/* List of Uploaded Datasets ONLY */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
                <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                <span>Uploaded Files ({uploadedDatasets.length})</span>
              </h4>
              <button
                onClick={handleDownloadSampleCSV}
                className="inline-flex items-center space-x-1 text-[11px] text-teal-700 hover:text-teal-900 font-medium"
              >
                <Download className="w-3 h-3" />
                <span>Download Sample CSV Template</span>
              </button>
            </div>

            {uploadedDatasets.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
                <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="font-semibold text-slate-700">No uploaded files yet</div>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1">
                  Upload a CSV or JSON file above to see your hospital's patient feedback visualized across all 9 dashboard sections.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {uploadedDatasets.map((ds) => {
                  const isActive = ds.id === activeDatasetId;
                  const isCSV = ds.name.toLowerCase().endsWith('.csv');

                  return (
                    <div
                      key={ds.id}
                      className={`p-3.5 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                        isActive
                          ? 'bg-teal-50/60 border-teal-600 ring-1 ring-teal-600 shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                            isCSV ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isCSV ? <FileSpreadsheet className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">{ds.name}</span>
                            {isActive && (
                              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300">
                                <Check className="w-2.5 h-2.5 mr-0.5" /> Active
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
                            <span>{ds.comments.length} comments</span>
                            <span>·</span>
                            <span>{ds.size}</span>
                            <span>·</span>
                            <span>Uploaded {ds.uploadedAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-end sm:self-center">
                        {!isActive ? (
                          <button
                            onClick={() => {
                              onSelectDataset(ds.id);
                              onClose();
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
                          >
                            Activate
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-teal-800 px-2 py-1">
                            In View
                          </span>
                        )}

                        <button
                          onClick={() => onDeleteDataset(ds.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete this uploaded file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>{uploadedDatasets.length} total file(s) uploaded</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
