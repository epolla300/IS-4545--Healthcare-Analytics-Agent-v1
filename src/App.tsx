import React, { useState, useMemo } from 'react';
import { RAW_PATIENT_COMMENTS } from './data/patientFeedbackData';
import { PatientComment, ServiceLine, VisitType, PatientPersona, Sentiment, RiskCategory, AIAgentOpportunity } from './types/dashboard';
import { computeExecutiveMetrics } from './utils/analytics';
import { UploadedDataset } from './utils/csvParser';
import { ExecutiveHeader } from './components/ExecutiveHeader';
import { FilterBar } from './components/FilterBar';
import { Section1ExecutiveOverview } from './components/Section1ExecutiveOverview';
import { Section2SatisfactionInsights } from './components/Section2SatisfactionInsights';
import { Section3NLPAnalysis } from './components/Section3NLPAnalysis';
import { Section4HiddenProblems } from './components/Section4HiddenProblems';
import { Section6HealthcareEquity } from './components/Section6HealthcareEquity';
import { Section7AIRiskMonitoring } from './components/Section7AIRiskMonitoring';
import { Section8AIAgentOpportunities } from './components/Section8AIAgentOpportunities';
import { Section9ExecutiveRecommendations } from './components/Section9ExecutiveRecommendations';
import { AskAgentDrawer } from './components/AskAgentDrawer';
import { ExecutiveMemoModal } from './components/ExecutiveMemoModal';
import { CommentsTableModal } from './components/CommentsTableModal';
import { DatasetManagerModal } from './components/DatasetManagerModal';
import { AgentSimulationModal } from './components/AgentSimulationModal';
import { Upload, FileSpreadsheet, Plus } from 'lucide-react';

const INITIAL_UPLOADED_DATASET: UploadedDataset = {
  id: 'patient-feedback-q3',
  name: 'patient_feedback_q3.csv',
  size: '148.5 KB',
  uploadedAt: 'Today, 08:30 AM',
  comments: RAW_PATIENT_COMMENTS,
};

export default function App() {
  // Only files uploaded by the user
  const [uploadedDatasets, setUploadedDatasets] = useState<UploadedDataset[]>(() => {
    try {
      const saved = localStorage.getItem('healthcare_uploaded_datasets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }
    return [INITIAL_UPLOADED_DATASET];
  });

  const [activeDatasetId, setActiveDatasetId] = useState<string>(() => {
    return uploadedDatasets[0]?.id || 'patient-feedback-q3';
  });

  const activeDataset = useMemo(() => {
    return uploadedDatasets.find((d) => d.id === activeDatasetId) || uploadedDatasets[0] || null;
  }, [uploadedDatasets, activeDatasetId]);

  const [allComments, setAllComments] = useState<PatientComment[]>(() => {
    return uploadedDatasets[0]?.comments || RAW_PATIENT_COMMENTS;
  });

  const [datasetName, setDatasetName] = useState<string>(() => {
    return uploadedDatasets[0]?.name || 'patient_feedback_q3.csv';
  });

  // Filters state
  const [selectedServiceLine, setSelectedServiceLine] = useState<ServiceLine | 'ALL'>('ALL');
  const [selectedPersona, setSelectedPersona] = useState<PatientPersona | 'ALL'>('ALL');
  const [selectedVisitType, setSelectedVisitType] = useState<VisitType | 'ALL'>('ALL');
  const [selectedSentiment, setSelectedSentiment] = useState<Sentiment | 'ALL'>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<RiskCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals state
  const [isAskAgentOpen, setIsAskAgentOpen] = useState(false);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [isCommentsTableOpen, setIsCommentsTableOpen] = useState(false);
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);
  const [simulationAgent, setSimulationAgent] = useState<AIAgentOpportunity | null>(null);

  // Active section tab / scroll focus
  const [activeSection, setActiveSection] = useState<string>('sec-overview');

  // Filter application
  const filteredComments = useMemo(() => {
    return allComments.filter((c) => {
      if (selectedServiceLine !== 'ALL' && c.serviceLine !== selectedServiceLine) return false;
      if (selectedPersona !== 'ALL' && c.persona !== selectedPersona) return false;
      if (selectedVisitType !== 'ALL' && c.visitType !== selectedVisitType) return false;
      if (selectedSentiment !== 'ALL' && c.sentiment !== selectedSentiment) return false;
      if (selectedRisk !== 'ALL' && c.riskCategory !== selectedRisk) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesComment = c.rawComment.toLowerCase().includes(term);
        const matchesKeywords = c.keywords.some((k) => k.toLowerCase().includes(term));
        const matchesThemes = c.themes.some((t) => t.toLowerCase().includes(term));
        const matchesId = c.id.toLowerCase().includes(term);
        if (!matchesComment && !matchesKeywords && !matchesThemes && !matchesId) return false;
      }
      return true;
    });
  }, [allComments, selectedServiceLine, selectedPersona, selectedVisitType, selectedSentiment, selectedRisk, searchTerm]);

  // Executive Metrics directly computed from active uploaded file
  const metrics = useMemo(() => {
    return computeExecutiveMetrics(filteredComments, 1);
  }, [filteredComments]);

  // Check if any filter is active
  const hasActiveFilters =
    selectedServiceLine !== 'ALL' ||
    selectedPersona !== 'ALL' ||
    selectedVisitType !== 'ALL' ||
    selectedSentiment !== 'ALL' ||
    selectedRisk !== 'ALL' ||
    Boolean(searchTerm);

  const resetFilters = () => {
    setSelectedServiceLine('ALL');
    setSelectedPersona('ALL');
    setSelectedVisitType('ALL');
    setSelectedSentiment('ALL');
    setSelectedRisk('ALL');
    setSearchTerm('');
  };

  const handleUpdateStatus = (commentId: string, status: 'pending' | 'in_audit' | 'escalated_cmo' | 'resolved') => {
    setAllComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, humanReviewStatus: status } : c))
    );
  };

  const handleSelectDataset = (datasetId: string) => {
    const target = uploadedDatasets.find((d) => d.id === datasetId);
    if (target) {
      setActiveDatasetId(target.id);
      setAllComments(target.comments);
      setDatasetName(target.name);
      resetFilters();
    }
  };

  const handleUploadNewFile = (fileName: string, newComments: PatientComment[], fileSize: string) => {
    const newDataset: UploadedDataset = {
      id: `up-${Date.now()}`,
      name: fileName,
      size: fileSize,
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
      comments: newComments,
    };

    const updated = [newDataset, ...uploadedDatasets];
    setUploadedDatasets(updated);
    setActiveDatasetId(newDataset.id);
    setAllComments(newComments);
    setDatasetName(fileName);
    resetFilters();

    try {
      localStorage.setItem('healthcare_uploaded_datasets', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const handleDeleteDataset = (datasetId: string) => {
    const updated = uploadedDatasets.filter((d) => d.id !== datasetId);
    setUploadedDatasets(updated);

    try {
      localStorage.setItem('healthcare_uploaded_datasets', JSON.stringify(updated));
    } catch (e) {}

    if (activeDatasetId === datasetId) {
      if (updated.length > 0) {
        setActiveDatasetId(updated[0].id);
        setAllComments(updated[0].comments);
        setDatasetName(updated[0].name);
      } else {
        setActiveDatasetId('');
        setAllComments([]);
        setDatasetName('No file uploaded');
      }
      resetFilters();
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-800 antialiased selection:bg-teal-500 selection:text-white pb-20">
      {/* Executive Header */}
      <ExecutiveHeader
        activePresetName={datasetName}
        uploadedFilesCount={uploadedDatasets.length}
        onOpenAskAgent={() => setIsAskAgentOpen(true)}
        onOpenMemo={() => setIsMemoOpen(true)}
        onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
        onResetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Slicing & Filter Bar */}
      <FilterBar
        selectedServiceLine={selectedServiceLine}
        onChangeServiceLine={setSelectedServiceLine}
        selectedPersona={selectedPersona}
        onChangePersona={setSelectedPersona}
        selectedVisitType={selectedVisitType}
        onChangeVisitType={setSelectedVisitType}
        selectedSentiment={selectedSentiment}
        onChangeSentiment={setSelectedSentiment}
        selectedRisk={selectedRisk}
        onChangeRisk={setSelectedRisk}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalFilteredCount={filteredComments.length}
        totalBaselineCount={allComments.length}
      />

      {/* Sticky Section Navigator */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 text-xs font-medium no-scrollbar">
            {[
              { id: 'sec-overview', label: '1. Executive Overview' },
              { id: 'sec-satisfaction', label: '2. Satisfaction Insights' },
              { id: 'sec-nlp', label: '3. NLP Analysis' },
              { id: 'sec-problems', label: '4. Hidden Problems' },
              { id: 'sec-equity', label: '6. Healthcare Equity' },
              { id: 'sec-risks', label: '7. AI Risk Monitoring' },
              { id: 'sec-agents', label: '8. AI Agent Opportunities' },
              { id: 'sec-recommendations', label: '9. Executive Roadmap' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                  activeSection === tab.id
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Empty State Banner if no files are uploaded */}
      {allComments.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-white p-10 rounded-xl border-2 border-dashed border-teal-300 text-center shadow-xs">
            <FileSpreadsheet className="w-12 h-12 text-teal-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Patient Feedback Dataset Active</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
              Upload a patient feedback CSV or JSON file to immediately populate the executive overview, NLP analysis, and AI agent recommendations.
            </p>
            <button
              onClick={() => setIsDatasetModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-md shadow transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Dataset File</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {allComments.length > 0 && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {/* SECTION 1: Executive Overview */}
          <div id="sec-overview">
            <Section1ExecutiveOverview
              metrics={metrics}
              onExploreComments={() => setIsCommentsTableOpen(true)}
            />
          </div>

          {/* SECTION 2: Patient Satisfaction Insights */}
          <div id="sec-satisfaction">
            <Section2SatisfactionInsights
              comments={filteredComments}
              onSelectServiceLine={(sl) => setSelectedServiceLine(sl as ServiceLine)}
              onSelectPersona={(p) => setSelectedPersona(p as PatientPersona)}
            />
          </div>

          {/* SECTION 3: NLP Analysis */}
          <div id="sec-nlp">
            <Section3NLPAnalysis
              onKeywordClick={(kw) => setSearchTerm(kw)}
              onThemeClick={(th) => setSearchTerm(th)}
            />
          </div>

          {/* SECTION 4: Hidden Organizational Problems */}
          <div id="sec-problems">
            <Section4HiddenProblems
              comments={filteredComments}
              onOpenRawCommentsForTag={(tag) => {
                setSearchTerm(tag);
                setIsCommentsTableOpen(true);
              }}
            />
          </div>

          {/* SECTION 6: Healthcare Equity and Accessibility */}
          <div id="sec-equity">
            <Section6HealthcareEquity comments={filteredComments} />
          </div>

          {/* SECTION 7: AI Risk Monitoring */}
          <div id="sec-risks">
            <Section7AIRiskMonitoring
              comments={filteredComments}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>

          {/* SECTION 8: AI Agent Opportunities */}
          <div id="sec-agents">
            <Section8AIAgentOpportunities
              onSimulateAgent={(agent) => setSimulationAgent(agent)}
            />
          </div>

          {/* SECTION 9: Executive Recommendations */}
          <div id="sec-recommendations">
            <Section9ExecutiveRecommendations
              onOpenMemo={() => setIsMemoOpen(true)}
            />
          </div>
        </main>
      )}

      {/* Modals & Drawers */}
      <AskAgentDrawer
        isOpen={isAskAgentOpen}
        onClose={() => setIsAskAgentOpen(false)}
        metrics={metrics}
        activeContextDescription={`${datasetName} (${filteredComments.length} active sliced comments)`}
      />

      <ExecutiveMemoModal
        isOpen={isMemoOpen}
        onClose={() => setIsMemoOpen(false)}
        metrics={metrics}
        activeDatasetName={datasetName}
      />

      <CommentsTableModal
        isOpen={isCommentsTableOpen}
        onClose={() => setIsCommentsTableOpen(false)}
        comments={filteredComments}
        onUpdateStatus={handleUpdateStatus}
      />

      <DatasetManagerModal
        isOpen={isDatasetModalOpen}
        onClose={() => setIsDatasetModalOpen(false)}
        uploadedDatasets={uploadedDatasets}
        activeDatasetId={activeDatasetId}
        onSelectDataset={handleSelectDataset}
        onUploadNewFile={handleUploadNewFile}
        onDeleteDataset={handleDeleteDataset}
      />

      <AgentSimulationModal
        agent={simulationAgent}
        onClose={() => setSimulationAgent(null)}
      />
    </div>
  );
}
