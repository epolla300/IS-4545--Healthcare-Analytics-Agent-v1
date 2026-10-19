import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { ServiceLine, VisitType, PatientPersona, Sentiment, RiskCategory } from '../types/dashboard';

interface FilterBarProps {
  selectedServiceLine: ServiceLine | 'ALL';
  onChangeServiceLine: (val: ServiceLine | 'ALL') => void;
  selectedPersona: PatientPersona | 'ALL';
  onChangePersona: (val: PatientPersona | 'ALL') => void;
  selectedVisitType: VisitType | 'ALL';
  onChangeVisitType: (val: VisitType | 'ALL') => void;
  selectedSentiment: Sentiment | 'ALL';
  onChangeSentiment: (val: Sentiment | 'ALL') => void;
  selectedRisk: RiskCategory | 'ALL';
  onChangeRisk: (val: RiskCategory | 'ALL') => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  totalFilteredCount: number;
  totalBaselineCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedServiceLine,
  onChangeServiceLine,
  selectedPersona,
  onChangePersona,
  selectedVisitType,
  onChangeVisitType,
  selectedSentiment,
  onChangeSentiment,
  selectedRisk,
  onChangeRisk,
  searchTerm,
  onSearchChange,
  totalFilteredCount,
  totalBaselineCount,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative min-w-[240px] max-w-sm flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient comments or keywords..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-slate-800 placeholder-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Select dropdowns for slicing */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center text-slate-500 font-medium mr-1">
            <Filter className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span>Slice Data:</span>
          </div>

          {/* Service Line */}
          <select
            value={selectedServiceLine}
            onChange={(e) => onChangeServiceLine(e.target.value as ServiceLine | 'ALL')}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
          >
            <option value="ALL">All Service Lines (8)</option>
            <option value="Emergency Medicine">Emergency Medicine</option>
            <option value="Cardiology & Heart Center">Cardiology & Heart Center</option>
            <option value="Orthopedics & Spine">Orthopedics & Spine</option>
            <option value="Oncology & Infusion">Oncology & Infusion</option>
            <option value="General Surgery">General Surgery</option>
            <option value="Pediatrics & Neonatal">Pediatrics & Neonatal</option>
            <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
            <option value="Telehealth & Virtual Care">Telehealth & Virtual Care</option>
          </select>

          {/* Persona */}
          <select
            value={selectedPersona}
            onChange={(e) => onChangePersona(e.target.value as PatientPersona | 'ALL')}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
          >
            <option value="ALL">All Patient Personas</option>
            <option value="Chronically Ill Senior">Chronically Ill Senior</option>
            <option value="Tech-Savvy Young Adult">Tech-Savvy Young Adult</option>
            <option value="Non-Native English Speaker">Non-Native English Speaker</option>
            <option value="Working Parent / Family">Working Parent / Family</option>
            <option value="Medicaid / Vulnerable Demographic">Medicaid / Vulnerable Demographic</option>
          </select>

          {/* Visit Type */}
          <select
            value={selectedVisitType}
            onChange={(e) => onChangeVisitType(e.target.value as VisitType | 'ALL')}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
          >
            <option value="ALL">All Visit Types</option>
            <option value="Emergency Department">Emergency Department</option>
            <option value="Inpatient Admission">Inpatient Admission</option>
            <option value="Outpatient Clinic">Outpatient Clinic</option>
            <option value="Ambulatory Surgery">Ambulatory Surgery</option>
            <option value="Telehealth Video">Telehealth Video</option>
          </select>

          {/* Sentiment */}
          <select
            value={selectedSentiment}
            onChange={(e) => onChangeSentiment(e.target.value as Sentiment | 'ALL')}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
          >
            <option value="ALL">All Sentiments</option>
            <option value="positive">Positive (Favorable)</option>
            <option value="neutral">Neutral (Mixed)</option>
            <option value="negative">Negative (Complaints)</option>
          </select>

          {/* AI Risk */}
          <select
            value={selectedRisk}
            onChange={(e) => onChangeRisk(e.target.value as RiskCategory | 'ALL')}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
          >
            <option value="ALL">All Risk Categories</option>
            <option value="hallucination_trap">Hallucination Trap</option>
            <option value="bias_discrimination">Bias / Discrimination</option>
            <option value="human_review_required">Human Review Required</option>
          </select>

          {/* Active count badge */}
          <div className="ml-auto text-xs text-slate-500 font-normal">
            Showing <span className="font-semibold text-slate-800">{totalFilteredCount}</span> of {totalBaselineCount} comments
          </div>
        </div>
      </div>
    </div>
  );
};
