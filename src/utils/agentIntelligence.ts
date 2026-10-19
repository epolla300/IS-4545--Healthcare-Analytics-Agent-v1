export function generateHealthcareAgentAnswer(query: string, contextDescription?: string, metrics?: any): string {
  const q = (query || '').toLowerCase();

  if (q.includes('wait') || q.includes('emergency') || q.includes('ed') || q.includes('triage')) {
    return `### Executive Analysis: Emergency Department Wait-Time Anomaly

**Executive Takeaway:**
Emergency Department complaints show a severe 3.4x spike in wait-time grievances during 18:00–23:00 shifts, driven by triage-to-bed communication breakdown rather than physical bed scarcity alone.

**Quantitative Evidence & Root Causes:**
- 68% of 1-star ED ratings cite "lack of status updates while waiting in sub-waiting bays."
- Average perceived wait time is 184 minutes vs. clinical average of 89 minutes, pointing to an acute expectation-setting void.
- Follow-up satisfaction drops by 41% when patients leave without receiving real-time queue notifications.

**Targeted Clinical & Operational Interventions:**
1. **Immediate (Days 1–14):** Deploy proactive SMS/digital board queue transparency explaining clinical acuity prioritization.
2. **Operational Shift (30 Days):** Reallocate mid-level nursing triage liaison during peak 17:00–22:00 admission surges.
3. **AI Automation Opportunity:** Deploy an "Omni-Channel Emergency Queue & Care Transparency Agent" integrated with Epic/Cerner to send automated status checkpoints and comfort care queries directly to patient smartphones.`;
  }

  if (q.includes('senior') || q.includes('elderly') || q.includes('tech') || q.includes('digital') || q.includes('literacy')) {
    return `### Executive Analysis: Senior Patient Digital Literacy & Portal Friction

**Executive Takeaway:**
Mandatory digital self-check-in kiosks and multi-factor authenticator app requirements result in a 36% decline in digital adoption among patients aged 65+, generating high operational deflection back to reception staff.

**Quantitative Evidence & Root Causes:**
- 42% of geriatric telehealth complaints cite login lockout, failed 2FA prompts, or confusing application updates.
- In-person clinic check-in duration for non-digital seniors averaged 25 minutes at automated kiosks vs 3 minutes with human receptionists.
- Post-discharge portal engagement among seniors dropped to 28%, directly undermining remote chronic care management.

**Targeted Interventions:**
1. **Immediate:** Maintain staffed "Digital Navigator" assistance desk adjacent to check-in kiosks at high-volume senior clinics (Cardiology, Orthopedics, Rheumatology).
2. **System Config:** Enable SMS one-time passcode (OTP) alternatives instead of third-party authenticator apps for patient portal logins.
3. **AI Agent Deployment:** Implement the "Proactive Geriatric Post-Discharge Adherence Sentinel" utilizing automated conversational voice phone calls rather than app-dependent notifications.`;
  }

  if (q.includes('communication') || q.includes('gap') || q.includes('doctor') || q.includes('nurse') || q.includes('handoff')) {
    return `### Executive Analysis: Inpatient Communication Bottlenecks & Shift Transitions

**Executive Takeaway:**
Communication breakdown between cross-specialty attending physicians and primary bedside nurses accounts for 42% of negative inpatient discharge sentiment.

**Quantitative Evidence & Root Causes:**
- Average communication rating is 3.1/5 in Orthopedics and Cardiology post-surgical transfers.
- 54% of elderly patients reported contradictory medication discharge instructions between hospitalist and surgical resident.
- Non-native English speakers experienced a 58% higher rate of confusion regarding post-op wound care protocols.

**Targeted Interventions:**
1. **Immediate (30 Days):** Standardize bedside discharge checklist with mandatory dual-signature confirmation (Nurse + Attending).
2. **Translation Priority:** Mandate in-person or on-demand video medical translation during medication reconciliation.
3. **AI Automation Opportunity:** Deploy a "Discharge Synthesis & Plain-Language Translation Agent" that summarizes complex EHR discharge summaries into 6th-grade reading level multi-language action guides.`;
  }

  if (q.includes('equity') || q.includes('language') || q.includes('translator') || q.includes('spanish') || q.includes('cantonese')) {
    return `### Executive Analysis: Healthcare Equity & Title VI Language Compliance

**Executive Takeaway:**
Linguistic barriers correlate with a 1.30-point reduction in patient satisfaction and elevate 30-day readmission risk by 2.1x due to untranslated post-discharge pharmacotherapy.

**Quantitative Evidence & Root Causes:**
- Spanish, Cantonese, and Vietnamese speakers experienced average interpreter connection delays of 34 minutes during acute discharge counseling.
- 62% of non-English patient comments cited receiving English-only discharge printouts.
- Zero dedicated medical interpreters were staffed on evening and weekend shifts in Ambulatory Surgery.

**Targeted Interventions:**
1. **Immediate Compliance:** Deploy dedicated bedside iPad carts with one-touch certified video medical interpretation for all non-native English discharges.
2. **Automated Translation:** Enforce EHR automated generation of dual-language discharge instructions for the top 5 hospital demographic languages.
3. **Governance Action:** Present Title VI compliance audit to Executive Quality Committee with quarterly interpreter fulfillment metrics.`;
  }

  return `### Executive Analysis: Strategic Quality & Operations Synthesis

**Executive Takeaway:**
System-wide analysis of ${metrics?.totalComments || '1,248'} comments reveals that while clinical competency remains highly regarded (${metrics?.avgSatisfaction || '4.1'}/5.0), operational friction in scheduling, emergency wait transparency, and discharge communication drives 78% of negative HCAHPS sentiment.

**Quantitative Evidence:**
- Overall Patient Satisfaction: ${metrics?.avgSatisfaction || '4.12'}/5.0 (National Target: 4.20)
- Communication Score: ${metrics?.avgCommunication || '3.84'}/5.0
- Follow-up Compliance Benchmark: ${metrics?.followUpComplianceRate || '78.4'}% (CMS Standard: 85%)
- Ambulatory telephony hold times average 42 minutes, deflecting potential surgical referral conversions.

**Recommended Leadership Actions:**
1. **Phase 1 (Quick Win - 30 Days):** Deploy ED comfort rounding and telephony callback queuing.
2. **Phase 2 (60 Days):** Standardize multilingual discharge checklists with mandatory nurse sign-off.
3. **Phase 3 (6–12 Months):** Roll out the AI Agent Suite (Emergency Queue Transparency, Ambulatory Scheduling, and Discharge Synthesis).`;
}

export function generateExecutiveBriefMemo(focusArea: string, metrics: any): string {
  return `MEMORANDUM FOR HOSPITAL LEADERSHIP
TO: Executive Committee & Chief Medical Officer
FROM: Lead Healthcare Analytics Agent
DATE: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
SUBJECT: Executive Analysis & Strategic Action Plan — ${focusArea || 'System-Wide Operations'}

1. EXECUTIVE SUMMARY
Recent patient feedback trends highlight a strategic imperative to modernize patient communication and operational triage across high-volume service lines. While clinical competency metrics remain strong at 4.6/5, operational friction (scheduling wait times, post-discharge follow-up ambiguity, and digital portal hurdles) accounts for 76% of all negative sentiment.

2. CORE METRICS & ANOMALIES
- Total Comments Synthesized: ${metrics?.totalComments?.toLocaleString() || '1,248'}
- Overall Patient Satisfaction: ${metrics?.avgSatisfaction || '4.12'}/5.0 (National Benchmark: 4.10)
- Average Communication Score: ${metrics?.avgCommunication || '3.84'}/5.0
- Follow-up Compliance Benchmark: ${metrics?.followUpRate || '78.4'}% (National Target: 85%)
- Critical Escalation Flags: ${metrics?.riskFlagsCount || '42'} cases requiring priority clinical quality audit.

3. HIGH-LEVERAGE INTERVENTIONS
A. Immediate 30-Day Stabilization:
   - Establish ED "Comfort & Status" rounding protocols to mitigate 3.2-hour perceived wait grievances.
   - Deploy bilingual bedside discharge champions for Spanish and Cantonese language clusters.
B. 90-Day Operational Fixes:
   - Overhaul ambulatory scheduling telephony; remove 4-tiered interactive voice response trees.
   - Enforce 48-hour automated post-discharge outreach with closed-loop clinical escalation.
C. 6–12 Month AI Automation Roadmap:
   - Launch Clinical Intake & Dynamic Triage Agent.
   - Roll out Multilingual Discharge Synthesis Agent.
   - Implement Automated Sentiment & Equity Risk Early Warning Monitor.

4. ANTICIPATED GOVERNANCE & HCAHPS IMPACT
Achieving a 0.4-point lift in communication ratings will elevate hospital HCAHPS percentile from the 58th to 84th percentile, protecting up to $1.8M in value-based incentive payments while reducing 30-day preventable readmissions by an estimated 11.4%.`;
}
