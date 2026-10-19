import { PatientComment, ServiceLine, VisitType, PatientPersona, Sentiment, RiskCategory, ProblemTag } from '../types/dashboard';

export interface UploadedDataset {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  comments: PatientComment[];
}

// RFC 4180 compliant CSV line tokenizer
export function parseCSVToRows(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        if (nextChar === '\n') i++;
        currentRow.push(currentField.trim());
        if (currentRow.some((f) => f.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.some((f) => f.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export function parseUploadedFileContent(fileName: string, content: string): PatientComment[] {
  // If JSON
  if (fileName.toLowerCase().endsWith('.json') || content.trim().startsWith('{') || content.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(content);
      const rawArray = Array.isArray(parsed)
        ? parsed
        : parsed.comments || parsed.data || parsed.feedback || parsed.records || [];

      if (!Array.isArray(rawArray) || rawArray.length === 0) {
        throw new Error('JSON does not contain an array of comments.');
      }

      return rawArray.map((item: any, idx: number) => normalizeCommentObject(item, idx + 1));
    } catch (err: any) {
      throw new Error(`JSON parse error: ${err.message}`);
    }
  }

  // Else parse CSV / TSV
  const rows = parseCSVToRows(content);
  if (rows.length < 2) {
    throw new Error('The uploaded file must contain a header row and at least one data row.');
  }

  const headerRow = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, '_'));

  // Column index lookups
  const commentIdx = findColIndex(headerRow, ['comment', 'rawcomment', 'feedback', 'review', 'text', 'notes', 'patient_feedback', 'message']);
  const scoreIdx = findColIndex(headerRow, ['satisfaction', 'satisfactionscore', 'score', 'rating', 'stars', 'overall_rating', 'csat']);
  const commIdx = findColIndex(headerRow, ['communication', 'communicationrating', 'comm_rating', 'communication_score']);
  const serviceIdx = findColIndex(headerRow, ['service_line', 'serviceline', 'service', 'department', 'specialty', 'clinic', 'unit']);
  const visitTypeIdx = findColIndex(headerRow, ['visit_type', 'visittype', 'setting', 'type', 'encounter_type']);
  const personaIdx = findColIndex(headerRow, ['persona', 'patient_persona', 'demographic', 'patient_type', 'cohort']);
  const followUpIdx = findColIndex(headerRow, ['followed_up', 'followup', 'followedup', 'compliance']);
  const sentimentIdx = findColIndex(headerRow, ['sentiment', 'polarity']);

  const comments: PatientComment[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0 || row.every((c) => !c)) continue;

    const rawComment = (commentIdx !== -1 ? row[commentIdx] : row[0]) || 'No comment text provided.';
    const scoreVal = scoreIdx !== -1 ? parseFloat(row[scoreIdx]) : inferScoreFromComment(rawComment);
    const commVal = commIdx !== -1 ? parseFloat(row[commIdx]) : Math.max(1, Math.min(5, Math.round(scoreVal)));

    const serviceLine = normalizeServiceLine(serviceIdx !== -1 ? row[serviceIdx] : inferServiceLine(rawComment));
    const visitType = normalizeVisitType(visitTypeIdx !== -1 ? row[visitTypeIdx] : 'Outpatient Clinic');
    const persona = normalizePersona(personaIdx !== -1 ? row[personaIdx] : inferPersona(rawComment));

    const sentiment = sentimentIdx !== -1
      ? normalizeSentiment(row[sentimentIdx])
      : scoreVal >= 4 ? 'positive' : scoreVal === 3 ? 'neutral' : 'negative';

    const followedUp = followUpIdx !== -1
      ? ['true', 'yes', '1', 'y', 'compliant'].includes((row[followUpIdx] || '').toLowerCase())
      : scoreVal >= 3;

    const themes = extractThemes(rawComment);
    const keywords = extractKeywords(rawComment);
    const problemTags = extractProblemTags(rawComment);
    const risk = evaluateRisk(rawComment);

    comments.push({
      id: `UP-${i}`,
      patientId: `PT-${2000 + i}`,
      timestamp: new Date().toISOString(),
      serviceLine,
      visitType,
      persona,
      satisfactionScore: isNaN(scoreVal) ? 3 : Math.max(1, Math.min(5, scoreVal)),
      communicationRating: isNaN(commVal) ? 3 : Math.max(1, Math.min(5, commVal)),
      followedUp,
      sentiment,
      themes,
      keywords,
      rawComment,
      problemTags,
      riskCategory: risk.category,
      riskDetails: risk.details,
      humanReviewStatus: risk.category === 'human_review_required' ? 'pending' : undefined,
      equityFlags: {
        language: rawComment.toLowerCase().includes('spanish') ? 'Spanish' : rawComment.toLowerCase().includes('cantonese') ? 'Cantonese' : undefined,
        digitalBarrier: problemTags.includes('digital_literacy'),
        accessibilityNeed: problemTags.includes('accessibility_barrier') ? 'Physical / Mobility Access' : undefined,
      }
    });
  }

  if (comments.length === 0) {
    throw new Error('No valid patient comment rows could be extracted from this file.');
  }

  return comments;
}

function findColIndex(headers: string[], candidates: string[]): number {
  for (const c of candidates) {
    const idx = headers.findIndex((h) => h === c || h.includes(c));
    if (idx !== -1) return idx;
  }
  return -1;
}

function normalizeCommentObject(item: any, index: number): PatientComment {
  const rawComment = item.rawComment || item.comment || item.text || item.feedback || item.review || 'No text';
  const score = item.satisfactionScore || item.score || item.rating || inferScoreFromComment(rawComment);
  const comm = item.communicationRating || item.communication || score;
  const service = normalizeServiceLine(item.serviceLine || item.service || inferServiceLine(rawComment));
  const visit = normalizeVisitType(item.visitType || item.setting || 'Outpatient Clinic');
  const persona = normalizePersona(item.persona || inferPersona(rawComment));
  const sentiment = item.sentiment ? normalizeSentiment(item.sentiment) : score >= 4 ? 'positive' : score === 3 ? 'neutral' : 'negative';
  const followedUp = item.followedUp !== undefined ? Boolean(item.followedUp) : score >= 3;

  const themes = item.themes && Array.isArray(item.themes) ? item.themes : extractThemes(rawComment);
  const keywords = item.keywords && Array.isArray(item.keywords) ? item.keywords : extractKeywords(rawComment);
  const problemTags = item.problemTags && Array.isArray(item.problemTags) ? item.problemTags : extractProblemTags(rawComment);
  const risk = evaluateRisk(rawComment);

  return {
    id: item.id || `UP-${index}`,
    patientId: item.patientId || `PT-${2000 + index}`,
    timestamp: item.timestamp || new Date().toISOString(),
    serviceLine: service,
    visitType: visit,
    persona,
    satisfactionScore: Math.max(1, Math.min(5, Math.round(Number(score)))),
    communicationRating: Math.max(1, Math.min(5, Math.round(Number(comm)))),
    followedUp,
    sentiment,
    themes,
    keywords,
    rawComment,
    problemTags,
    riskCategory: item.riskCategory || risk.category,
    riskDetails: item.riskDetails || risk.details,
    humanReviewStatus: item.humanReviewStatus || (risk.category === 'human_review_required' ? 'pending' : undefined),
    equityFlags: item.equityFlags || {
      digitalBarrier: problemTags.includes('digital_literacy'),
      accessibilityNeed: problemTags.includes('accessibility_barrier') ? 'Mobility Support' : undefined
    }
  };
}

function normalizeServiceLine(val?: string): ServiceLine {
  if (!val) return 'Emergency Medicine';
  const s = val.toLowerCase();
  if (s.includes('cardio') || s.includes('heart')) return 'Cardiology & Heart Center';
  if (s.includes('ortho') || s.includes('spine') || s.includes('bone')) return 'Orthopedics & Spine';
  if (s.includes('oncol') || s.includes('cancer') || s.includes('infus')) return 'Oncology & Infusion';
  if (s.includes('ped') || s.includes('child') || s.includes('neo')) return 'Pediatrics & Neonatal';
  if (s.includes('ob') || s.includes('gyn') || s.includes('matern') || s.includes('birth')) return 'Obstetrics & Gynecology';
  if (s.includes('tele') || s.includes('virt')) return 'Telehealth & Virtual Care';
  if (s.includes('surg') || s.includes('or')) return 'General Surgery';
  return 'Emergency Medicine';
}

function normalizeVisitType(val?: string): VisitType {
  if (!val) return 'Outpatient Clinic';
  const s = val.toLowerCase();
  if (s.includes('emer') || s.includes('ed') || s.includes('er')) return 'Emergency Department';
  if (s.includes('inp') || s.includes('admit')) return 'Inpatient Admission';
  if (s.includes('surg') || s.includes('ambulat')) return 'Ambulatory Surgery';
  if (s.includes('tele') || s.includes('video') || s.includes('virt')) return 'Telehealth Video';
  return 'Outpatient Clinic';
}

function normalizePersona(val?: string): PatientPersona {
  if (!val) return 'Chronically Ill Senior';
  const s = val.toLowerCase();
  if (s.includes('young') || s.includes('tech') || s.includes('adult')) return 'Tech-Savvy Young Adult';
  if (s.includes('lang') || s.includes('spanish') || s.includes('canton') || s.includes('foreign') || s.includes('non-native')) return 'Non-Native English Speaker';
  if (s.includes('parent') || s.includes('family') || s.includes('mom') || s.includes('dad')) return 'Working Parent / Family';
  if (s.includes('medic') || s.includes('uninsured') || s.includes('vulner') || s.includes('low')) return 'Medicaid / Vulnerable Demographic';
  return 'Chronically Ill Senior';
}

function normalizeSentiment(val?: string): Sentiment {
  if (!val) return 'neutral';
  const s = val.toLowerCase();
  if (s.includes('pos') || s.includes('good') || s.includes('great')) return 'positive';
  if (s.includes('neg') || s.includes('bad') || s.includes('poor')) return 'negative';
  return 'neutral';
}

function inferScoreFromComment(comment: string): number {
  const c = comment.toLowerCase();
  if (c.includes('horrible') || c.includes('worst') || c.includes('unacceptable') || c.includes('scolded') || c.includes('ignored')) return 1;
  if (c.includes('waited') || c.includes('delay') || c.includes('frustrated') || c.includes('rushed') || c.includes('confused')) return 2;
  if (c.includes('okay') || c.includes('average') || c.includes('fine') || c.includes('routine')) return 3;
  if (c.includes('good') || c.includes('helpful') || c.includes('swift') || c.includes('prompt')) return 4;
  if (c.includes('exceptional') || c.includes('compassionate') || c.includes('angel') || c.includes('master') || c.includes('saved my life') || c.includes('love this clinic')) return 5;
  return 3;
}

function inferServiceLine(comment: string): string {
  const c = comment.toLowerCase();
  if (c.includes('chemo') || c.includes('cancer') || c.includes('radiation') || c.includes('oncolog')) return 'Oncology & Infusion';
  if (c.includes('heart') || c.includes('cardio') || c.includes('catheter') || c.includes('ekg') || c.includes('chest pain')) return 'Cardiology & Heart Center';
  if (c.includes('knee') || c.includes('hip') || c.includes('bone') || c.includes('spine') || c.includes('ortho')) return 'Orthopedics & Spine';
  if (c.includes('child') || c.includes('pediatric') || c.includes('toddler') || c.includes('baby') || c.includes('nicu')) return 'Pediatrics & Neonatal';
  if (c.includes('postpartum') || c.includes('birth') || c.includes('labor') || c.includes('delivery') || c.includes('lactation')) return 'Obstetrics & Gynecology';
  if (c.includes('video') || c.includes('virtual') || c.includes('app ') || c.includes('telehealth')) return 'Telehealth & Virtual Care';
  if (c.includes('surgery') || c.includes('hernia') || c.includes('gallbladder') || c.includes('incision')) return 'General Surgery';
  return 'Emergency Medicine';
}

function inferPersona(comment: string): string {
  const c = comment.toLowerCase();
  if (c.includes('spanish') || c.includes('cantonese') || c.includes('vietnamese') || c.includes('arabic') || c.includes('interpreter') || c.includes('translator')) return 'Non-Native English Speaker';
  if (c.includes('78 years old') || c.includes('elderly') || c.includes('senior') || c.includes('husband and i are in our 80s')) return 'Chronically Ill Senior';
  if (c.includes('toddler') || c.includes('my son') || c.includes('my daughter') || c.includes('kids') || c.includes('parent')) return 'Working Parent / Family';
  if (c.includes('medicaid') || c.includes('state insurance') || c.includes('voucher') || c.includes('afford')) return 'Medicaid / Vulnerable Demographic';
  if (c.includes('app') || c.includes('iphone') || c.includes('portal') || c.includes('login') || c.includes('mri upload')) return 'Tech-Savvy Young Adult';
  return 'Chronically Ill Senior';
}

function extractThemes(comment: string): string[] {
  const c = comment.toLowerCase();
  const themes: string[] = [];
  if (c.includes('wait') || c.includes('hours') || c.includes('delay')) themes.push('Wait Time & Delays');
  if (c.includes('kind') || c.includes('compassion') || c.includes('caring') || c.includes('angel')) themes.push('Clinical Competency & Empathy');
  if (c.includes('discharge') || c.includes('instruction') || c.includes('packet') || c.includes('medication')) themes.push('Discharge & Medication Clarity');
  if (c.includes('portal') || c.includes('app') || c.includes('login') || c.includes('kiosk')) themes.push('Portal & Tech Usability');
  if (c.includes('call button') || c.includes('rushed') || c.includes('phone') || c.includes('on hold')) themes.push('Communication Bottlenecks & Call Responsiveness');
  if (c.includes('spanish') || c.includes('cantonese') || c.includes('translator') || c.includes('wheelchair')) themes.push('Healthcare Equity, Language & Accessibility');
  return themes.length > 0 ? themes : ['General Patient Experience'];
}

function extractKeywords(comment: string): string[] {
  const words = comment.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'was', 'were', 'have', 'had', 'from', 'they', 'our', 'out', 'but', 'not']);
  const filtered = words.filter((w) => w.length > 4 && !stopWords.has(w));
  return Array.from(new Set(filtered)).slice(0, 4);
}

function extractProblemTags(comment: string): ProblemTag[] {
  const c = comment.toLowerCase();
  const tags: ProblemTag[] = [];
  if (c.includes('wait') || c.includes('delay') || c.includes('hours')) tags.push('wait_time');
  if (c.includes('call') || c.includes('phone') || c.includes('handoff') || c.includes('unanswered') || c.includes('hold')) tags.push('communication_bottleneck');
  if (c.includes('app') || c.includes('login') || c.includes('portal') || c.includes('kiosk') || c.includes('error')) tags.push('technology_issue');
  if (c.includes('schedule') || c.includes('appointment') || c.includes('weeks to see') || c.includes('cancelled')) tags.push('scheduling_delay');
  if (c.includes('spanish') || c.includes('cantonese') || c.includes('translator') || c.includes('interpreter') || c.includes('language')) tags.push('language_barrier');
  if (c.includes('wheelchair') || c.includes('ramp') || c.includes('transit') || c.includes('stairs')) tags.push('accessibility_barrier');
  if (c.includes('elderly') || c.includes('cannot log in') || c.includes('authenticator') || c.includes('confusing tablet')) tags.push('digital_literacy');
  return tags;
}

function evaluateRisk(comment: string): { category: RiskCategory; details?: string } {
  const c = comment.toLowerCase();
  if (c.includes('chest pain') || c.includes('chest pressure') || c.includes('ekg delay') || c.includes('bleeding') || c.includes('fell') || c.includes('fall risk') || c.includes('unassisted') || c.includes('infection') || c.includes('spreading red')) {
    return {
      category: 'human_review_required',
      details: 'Urgent patient clinical safety or triage escalation flagged for immediate review.'
    };
  }
  if (c.includes('narcotics') || c.includes('state insurance') || c.includes('judged') || c.includes('dismissed') || c.includes('language access') || c.includes('no translator')) {
    return {
      category: 'bias_discrimination',
      details: 'Potential demographic bias or language access compliance hazard.'
    };
  }
  if (c.includes('contradictory') || c.includes('discharge packet said') || c.includes('ai summary') || c.includes('portal note contradicted')) {
    return {
      category: 'hallucination_trap',
      details: 'Contradictory clinical documentation or EHR auto-summary confusion.'
    };
  }
  return { category: 'none' };
}
