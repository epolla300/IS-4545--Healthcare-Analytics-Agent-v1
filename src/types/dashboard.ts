export type ServiceLine =
  | 'Emergency Medicine'
  | 'Cardiology & Heart Center'
  | 'Orthopedics & Spine'
  | 'Oncology & Infusion'
  | 'General Surgery'
  | 'Pediatrics & Neonatal'
  | 'Obstetrics & Gynecology'
  | 'Telehealth & Virtual Care';

export type VisitType =
  | 'Inpatient Admission'
  | 'Outpatient Clinic'
  | 'Emergency Department'
  | 'Ambulatory Surgery'
  | 'Telehealth Video';

export type PatientPersona =
  | 'Chronically Ill Senior'
  | 'Tech-Savvy Young Adult'
  | 'Non-Native English Speaker'
  | 'Working Parent / Family'
  | 'Medicaid / Vulnerable Demographic';

export type Sentiment = 'positive' | 'neutral' | 'negative';

export type RiskCategory =
  | 'none'
  | 'hallucination_trap'
  | 'bias_discrimination'
  | 'human_review_required';

export type ProblemTag =
  | 'wait_time'
  | 'communication_bottleneck'
  | 'technology_issue'
  | 'scheduling_delay'
  | 'language_barrier'
  | 'accessibility_barrier'
  | 'digital_literacy';

export interface PatientComment {
  id: string;
  patientId: string;
  timestamp: string;
  serviceLine: ServiceLine;
  visitType: VisitType;
  persona: PatientPersona;
  satisfactionScore: number; // 1-5
  communicationRating: number; // 1-5
  followedUp: boolean; // follow-up compliance
  sentiment: Sentiment;
  themes: string[];
  keywords: string[];
  rawComment: string;
  problemTags: ProblemTag[];
  riskCategory: RiskCategory;
  riskDetails?: string;
  humanReviewStatus?: 'pending' | 'in_audit' | 'escalated_cmo' | 'resolved';
  equityFlags?: {
    language?: string;
    digitalBarrier?: boolean;
    accessibilityNeed?: string;
  };
}

export interface ExecutiveMetrics {
  totalComments: number;
  avgSatisfaction: number;
  avgCommunication: number;
  followUpComplianceRate: number;
  serviceLinesCount: number;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  riskFlagsCount: number;
  humanReviewCount: number;
}

export interface AIAgentOpportunity {
  id: string;
  name: string;
  category: 'Patient Communication' | 'Care Coordination' | 'Administrative Optimization' | 'Clinical Equity & Safety';
  purpose: string;
  expectedImpact: string;
  keyFeatures: string[];
  implementationHorizon: 'Quick Win (3 Mo)' | 'Medium (3-6 Mo)' | 'Strategic (6-12 Mo)';
  roiScore: number; // 1-100
  feasibilityScore: number; // 1-100
  targetServiceLines: ServiceLine[];
}

export interface ExecutivePriority {
  id: string;
  rank: number;
  title: string;
  category: 'Operational' | 'Clinical Communication' | 'Digital & Tech' | 'Health Equity' | 'Risk & Governance';
  description: string;
  targetMetric: string;
  timeframe: string;
  leadOwner: string;
  priorityLevel: 'Urgent' | 'High' | 'Medium';
}
