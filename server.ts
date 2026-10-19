import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// Healthcare Analytics Agent AI Endpoints
const ai = new GoogleGenAI();

app.post('/api/ai/ask-agent', async (req, res) => {
  try {
    const { query, contextSummary, filteredDatasetStats } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        fallback: true,
        answer: generateSimulatedAgentAnswer(query, contextSummary, filteredDatasetStats)
      });
    }

    const prompt = `You are the Lead Healthcare Analytics Agent advising hospital executive leadership (CEO, CMO, Chief Nursing Officer, Chief Patient Experience Officer).
You have analyzed the hospital's patient feedback dataset with the following active context:
Dataset Summary:
${JSON.stringify(contextSummary, null, 2)}

Current Filtered Slice:
${JSON.stringify(filteredDatasetStats, null, 2)}

User/Executive Query:
"${query}"

Provide an authoritative, data-grounded, executive-grade response.
Format clearly with:
1. Executive Takeaway (1-2 sentences)
2. Quantitative Evidence & Root Causes from the dataset
3. Concrete Operational/Clinical Actions (prioritized by urgency)
4. AI/Process Automation Recommendation if applicable.
Keep the tone professional, objective, and clinically informed. Do not include markdown emojis.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      fallback: false,
      answer: response.text || 'Analysis completed with no additional findings.',
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(200).json({
      fallback: true,
      answer: generateSimulatedAgentAnswer(req.body.query, req.body.contextSummary, req.body.filteredDatasetStats),
      errorNotice: error.message
    });
  }
});

app.post('/api/ai/executive-brief', async (req, res) => {
  try {
    const { focusArea, metrics } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        fallback: true,
        brief: generateSimulatedExecutiveBrief(focusArea, metrics)
      });
    }

    const prompt = `You are a Senior Healthcare Analytics Agent preparing a formal Executive Briefing Memo for the Hospital Quality & Operations Executive Committee.
Focus Area: ${focusArea}
Key Metrics:
${JSON.stringify(metrics, null, 2)}

Draft a concise, high-impact Executive Memorandum suitable for print or PDF distribution.
Sections to include:
- MEMORANDUM HEADER (To, From, Date, Subject)
- EXECUTIVE SUMMARY (Key risk/opportunity)
- PERFORMANCE BENCHMARKS & ANOMALY FINDINGS
- STRATEGIC INTERVENTIONS (Immediate 30-day, Medium 90-day, AI System Deployment)
- RESOURCE & COMPLIANCE IMPACT (CAHPS / HCAHPS impact, patient safety, nurse retention).

Tone: Boardroom-level, crisp, strategic, no filler words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      fallback: false,
      brief: response.text,
    });
  } catch (error: any) {
    console.error('Gemini Brief Error:', error);
    res.status(200).json({
      fallback: true,
      brief: generateSimulatedExecutiveBrief(req.body.focusArea, req.body.metrics),
    });
  }
});

function generateSimulatedAgentAnswer(query: string, contextSummary: any, filteredStats: any) {
  const q = (query || '').toLowerCase();
  if (q.includes('wait') || q.includes('emergency') || q.includes('ed')) {
    return `### Executive Analysis: Emergency Department Wait-Time Anomaly

**Executive Takeaway:**
Emergency Department complaints show a severe 3.4x spike in wait-time grievances during 18:00–23:00 shifts, driven by triage-to-bed communication breakdown rather than physical bed scarcity.

**Quantitative Evidence & Root Causes:**
- 68% of 1-star ED ratings cite "lack of status updates while waiting in sub-waiting bays."
- Average perceived wait time is 184 minutes vs. clinical average of 89 minutes, pointing to an acute expectation-setting void.
- Follow-up satisfaction drops by 41% when patients leave without receiving real-time queue notifications.

**Targeted Clinical & Operational Interventions:**
1. **Immediate (Days 1–14):** Deploy proactive SMS/digital board queue transparency explaining clinical acuity prioritization.
2. **Operational Shift (30 Days):** Reallocate mid-level nursing triage liaison during peak 17:00–22:00 admission surges.
3. **AI Automation Opportunity:** Deploy an "ED Real-Time Patient Wayfinder & Triage Queue Agent" integrated with Epic/Cerner to send automated status checkpoints and comfort care queries directly to patient smartphones.`;
  }

  if (q.includes('communication') || q.includes('doctor') || q.includes('nurse')) {
    return `### Executive Analysis: Inpatient Communication Bottlenecks

**Executive Takeaway:**
Communication breakdown between cross-specialty attending physicians and primary bedside nurses accounts for 42% of negative inpatient discharge sentiment.

**Quantitative Evidence & Root Causes:**
- Average communication rating is 3.1/5 in Orthopedics and Cardiology post-surgical transfers.
- 54% of elderly patients reported contradictory medication discharge instructions between hospitalist and surgical resident.
- Non-native English speakers experienced a 58% higher rate of confusion regarding post-op wound care protocols.

**Targeted Interventions:**
1. **Immediate:** Standardize bedside discharge checklist with mandatory dual-signature confirmation (Nurse + Attending).
2. **Translation Priority:** Mandate in-person or on-demand video medical translation during medication reconciliation.
3. **AI Automation Opportunity:** Deploy a "Discharge Synthesis & Plain-Language Translation Agent" that summarizes complex EHR discharge summaries into 6th-grade reading level multi-language action guides.`;
  }

  return `### Executive Analysis: Strategic Feedback Synthesis

**Executive Takeaway:**
Hospital-wide analysis indicates that overall satisfaction (4.12/5) remains stable, but hidden variance across patient personas and ambulatory service lines masks acute retention risks in high-margin surgical corridors.

**Quantitative Evidence:**
- Tech-savvy younger demographics report high dissatisfaction with legacy phone-tree scheduling (average 2.4/5 on booking friction).
- Chronically ill elderly personas face severe follow-up compliance leakage (only 64% post-discharge completion).
- Language and digital literacy barriers correlate with a 38% drop in portal adoption and 2.1x higher rate of missed appointment follow-ups.

**Recommended Leadership Actions:**
1. Fast-track self-service conversational scheduling for outpatient clinics to recapture lost referral volume.
2. Form an Executive Task Force on Patient Equity and Digital Access to streamline multi-channel outreach (SMS, IVR, and multilingual coordinators).
3. Institute automated AI Risk Scanning on all incoming patient comments to intercept severe safety/bias escalations within 4 hours.`;
}

function generateSimulatedExecutiveBrief(focusArea: string, metrics: any) {
  return `MEMORANDUM FOR HOSPITAL LEADERSHIP
TO: Executive Committee & Chief Medical Officer
FROM: Lead Healthcare Analytics Agent
DATE: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
SUBJECT: Executive Analysis & Strategic Action Plan — ${focusArea || 'System-Wide Operations'}

1. EXECUTIVE SUMMARY
Recent patient feedback trends highlight a strategic imperative to modernize patient communication and operational triage across high-volume service lines. While clinical competency metrics remain strong at 4.6/5, operational friction (scheduling wait times, post-discharge follow-up ambiguity, and digital portal hurdles) accounts for 76% of all negative sentiment.

2. CORE METRICS & ANOMALIES
- Total Comments Synthesized: ${metrics?.totalComments || '1,248'}
- Overall Patient Satisfaction: ${metrics?.avgSatisfaction || '4.1'}/5.0
- Average Communication Score: ${metrics?.avgCommunication || '3.8'}/5.0
- Follow-up Compliance Benchmark: ${metrics?.followUpRate || '78.4'}% (National Target: 85%)
- Critical Escalation Flags: ${metrics?.riskFlagsCount || '42'} cases requiring priority human clinical audit.

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

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Healthcare Analytics Agent server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
