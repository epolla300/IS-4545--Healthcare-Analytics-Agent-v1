import React, { useState, useMemo } from 'react';
import { RAW_PATIENT_COMMENTS, DATASET_PRESETS } from './data/patientFeedbackData';
import { PatientComment, ServiceLine, VisitType, PatientPersona, Sentiment, RiskCategory, AIAgentOpportunity } from './types/dashboard';
import { computeExecutiveMetrics } from './utils/analytics';
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

export default function App() {
  // Dataset state
  const [activePresetId, setActivePresetId] = useState<string>('metro-q3');
  const [datasetName, setDatasetName] = useState<string>('Metro Health System Q3 (1,248 Comments)');
  const [allComments, setAllComments] = useState<PatientComment[]>(RAW_PATIENT_COMMENTS);

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
  const [activeSection, setActiveSection] = useState<string>('sec-1');

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

  // Executive Metrics (scaled relative to active dataset preset)
  const activePreset = DATASET_PRESETS.find((p) => p.id === activePresetId) || DATASET_PRESETS[0];
  const scaleMultiplier = activePreset.totalComments / 30; // 30 is base sample size
  const metrics = useMemo(() => {
    return computeExecutiveMetrics(filteredComments, scaleMultiplier);
  }, [filteredComments, scaleMultiplier]);

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

  const handleSelectPreset = (presetId: string) => {
    const found = DATASET_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setActivePresetId(found.id);
      setDatasetName(found.name);
      resetFilters();
    }
  };

  const handleCustomDatasetLoaded = (newComments: PatientComment[], name: string) => {
    setAllComments(newComments);
    setDatasetName(name);
    resetFilters();
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

      {/* Main Content Area */}
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
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        onCustomDatasetLoaded={handleCustomDatasetLoaded}
      />

      <AgentSimulationModal
        agent={simulationAgent}
        onClose={() => setSimulationAgent(null)}
      />
    </div>
  );
}
