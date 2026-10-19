import { PatientComment, ExecutiveMetrics, ServiceLine, VisitType, PatientPersona } from '../types/dashboard';
import { TOP_NLP_THEMES, KEYWORD_FREQUENCY } from '../data/patientFeedbackData';

export function computeExecutiveMetrics(comments: PatientComment[], baseTotalMultiplier: number = 1): ExecutiveMetrics {
  const total = comments.length;
  if (total === 0) {
    return {
      totalComments: 0,
      avgSatisfaction: 0,
      avgCommunication: 0,
      followUpComplianceRate: 0,
      serviceLinesCount: 0,
      positivePct: 0,
      neutralPct: 0,
      negativePct: 0,
      riskFlagsCount: 0,
      humanReviewCount: 0,
    };
  }

  const sumSat = comments.reduce((acc, c) => acc + c.satisfactionScore, 0);
  const sumComm = comments.reduce((acc, c) => acc + c.communicationRating, 0);
  const followedUpCount = comments.filter(c => c.followedUp).length;
  const uniqueServiceLines = new Set(comments.map(c => c.serviceLine));

  const positive = comments.filter(c => c.sentiment === 'positive').length;
  const neutral = comments.filter(c => c.sentiment === 'neutral').length;
  const negative = comments.filter(c => c.sentiment === 'negative').length;

  const riskFlags = comments.filter(c => c.riskCategory !== 'none').length;
  const humanReview = comments.filter(c => c.riskCategory === 'human_review_required' || c.humanReviewStatus).length;

  return {
    totalComments: Math.round(total * baseTotalMultiplier),
    avgSatisfaction: Number((sumSat / total).toFixed(2)),
    avgCommunication: Number((sumComm / total).toFixed(2)),
    followUpComplianceRate: Number(((followedUpCount / total) * 100).toFixed(1)),
    serviceLinesCount: uniqueServiceLines.size,
    positivePct: Math.round((positive / total) * 100),
    neutralPct: Math.round((neutral / total) * 100),
    negativePct: Math.round((negative / total) * 100),
    riskFlagsCount: Math.round(riskFlags * baseTotalMultiplier),
    humanReviewCount: Math.round(humanReview * baseTotalMultiplier),
  };
}

export function computeSatisfactionDistribution(comments: PatientComment[]) {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  comments.forEach(c => {
    const s = Math.min(5, Math.max(1, Math.round(c.satisfactionScore)));
    counts[s] = (counts[s] || 0) + 1;
  });

  const total = comments.length || 1;
  return [1, 2, 3, 4, 5].map(rating => ({
    stars: rating,
    count: counts[rating] || 0,
    percentage: Math.round(((counts[rating] || 0) / total) * 100),
  }));
}

export function computeSatisfactionByServiceLine(comments: PatientComment[]) {
  const grouped: Record<string, { total: number; sumSat: number; sumComm: number; negatives: number }> = {};

  comments.forEach(c => {
    if (!grouped[c.serviceLine]) {
      grouped[c.serviceLine] = { total: 0, sumSat: 0, sumComm: 0, negatives: 0 };
    }
    grouped[c.serviceLine].total += 1;
    grouped[c.serviceLine].sumSat += c.satisfactionScore;
    grouped[c.serviceLine].sumComm += c.communicationRating;
    if (c.sentiment === 'negative') {
      grouped[c.serviceLine].negatives += 1;
    }
  });

  // National hospital benchmark reference ~4.10
  const nationalBenchmark = 4.10;

  return Object.entries(grouped).map(([serviceLine, data]) => {
    const avgSat = Number((data.sumSat / data.total).toFixed(2));
    const avgComm = Number((data.sumComm / data.total).toFixed(2));
    const complaintRate = Number(((data.negatives / data.total) * 100).toFixed(1));
    const deltaToBenchmark = Number((avgSat - nationalBenchmark).toFixed(2));

    return {
      serviceLine: serviceLine as ServiceLine,
      volume: data.total,
      avgSatisfaction: avgSat,
      avgCommunication: avgComm,
      complaintRate,
      deltaToBenchmark,
      status: avgSat >= 4.2 ? 'Leader' : avgSat >= 3.8 ? 'On Target' : 'At Risk',
    };
  }).sort((a, b) => b.complaintRate - a.complaintRate); // Highlight highest complaint rate first
}

export function computeSatisfactionByVisitType(comments: PatientComment[]) {
  const grouped: Record<string, { total: number; sumSat: number; followedUp: number }> = {};

  comments.forEach(c => {
    if (!grouped[c.visitType]) {
      grouped[c.visitType] = { total: 0, sumSat: 0, followedUp: 0 };
    }
    grouped[c.visitType].total += 1;
    grouped[c.visitType].sumSat += c.satisfactionScore;
    if (c.followedUp) grouped[c.visitType].followedUp += 1;
  });

  return Object.entries(grouped).map(([visitType, data]) => ({
    visitType: visitType as VisitType,
    volume: data.total,
    avgSatisfaction: Number((data.sumSat / data.total).toFixed(2)),
    followUpRate: Number(((data.followedUp / data.total) * 100).toFixed(1)),
  })).sort((a, b) => b.avgSatisfaction - a.avgSatisfaction);
}

export function computeSatisfactionByPersona(comments: PatientComment[]) {
  const grouped: Record<string, { total: number; sumSat: number; sumComm: number; followedUp: number; techIssues: number }> = {};

  comments.forEach(c => {
    if (!grouped[c.persona]) {
      grouped[c.persona] = { total: 0, sumSat: 0, sumComm: 0, followedUp: 0, techIssues: 0 };
    }
    grouped[c.persona].total += 1;
    grouped[c.persona].sumSat += c.satisfactionScore;
    grouped[c.persona].sumComm += c.communicationRating;
    if (c.followedUp) grouped[c.persona].followedUp += 1;
    if (c.problemTags.includes('technology_issue') || c.problemTags.includes('digital_literacy')) {
      grouped[c.persona].techIssues += 1;
    }
  });

  return Object.entries(grouped).map(([persona, data]) => ({
    persona: persona as PatientPersona,
    volume: data.total,
    avgSatisfaction: Number((data.sumSat / data.total).toFixed(2)),
    avgCommunication: Number((data.sumComm / data.total).toFixed(2)),
    followUpRate: Number(((data.followedUp / data.total) * 100).toFixed(1)),
    digitalFrictionRate: Number(((data.techIssues / data.total) * 100).toFixed(1)),
  })).sort((a, b) => a.avgSatisfaction - b.avgSatisfaction); // Lowest satisfaction on top for equity visibility
}

export function computeHiddenProblems(comments: PatientComment[]) {
  const total = comments.length || 1;

  const waitTimeComments = comments.filter(c => c.problemTags.includes('wait_time'));
  const commBottleneckComments = comments.filter(c => c.problemTags.includes('communication_bottleneck'));
  const techIssueComments = comments.filter(c => c.problemTags.includes('technology_issue'));
  const schedulingComments = comments.filter(c => c.problemTags.includes('scheduling_delay'));

  return {
    waitTime: {
      count: waitTimeComments.length,
      pctOfTotal: Number(((waitTimeComments.length / total) * 100).toFixed(1)),
      avgSatisfaction: waitTimeComments.length ? Number((waitTimeComments.reduce((a, b) => a + b.satisfactionScore, 0) / waitTimeComments.length).toFixed(2)) : 0,
      topServiceLines: getTopServiceLinesForProblem(waitTimeComments),
      sampleQuotes: waitTimeComments.slice(0, 3).map(c => ({ id: c.id, text: c.rawComment, service: c.serviceLine })),
    },
    communicationBottlenecks: {
      count: commBottleneckComments.length,
      pctOfTotal: Number(((commBottleneckComments.length / total) * 100).toFixed(1)),
      avgSatisfaction: commBottleneckComments.length ? Number((commBottleneckComments.reduce((a, b) => a + b.satisfactionScore, 0) / commBottleneckComments.length).toFixed(2)) : 0,
      topServiceLines: getTopServiceLinesForProblem(commBottleneckComments),
      sampleQuotes: commBottleneckComments.slice(0, 3).map(c => ({ id: c.id, text: c.rawComment, service: c.serviceLine })),
    },
    technologyIssues: {
      count: techIssueComments.length,
      pctOfTotal: Number(((techIssueComments.length / total) * 100).toFixed(1)),
      avgSatisfaction: techIssueComments.length ? Number((techIssueComments.reduce((a, b) => a + b.satisfactionScore, 0) / techIssueComments.length).toFixed(2)) : 0,
      topServiceLines: getTopServiceLinesForProblem(techIssueComments),
      sampleQuotes: techIssueComments.slice(0, 3).map(c => ({ id: c.id, text: c.rawComment, service: c.serviceLine })),
    },
    schedulingIssues: {
      count: schedulingComments.length,
      pctOfTotal: Number(((schedulingComments.length / total) * 100).toFixed(1)),
      avgSatisfaction: schedulingComments.length ? Number((schedulingComments.reduce((a, b) => a + b.satisfactionScore, 0) / schedulingComments.length).toFixed(2)) : 0,
      topServiceLines: getTopServiceLinesForProblem(schedulingComments),
      sampleQuotes: schedulingComments.slice(0, 3).map(c => ({ id: c.id, text: c.rawComment, service: c.serviceLine })),
    },
  };
}

function getTopServiceLinesForProblem(problemComments: PatientComment[]) {
  const counts: Record<string, number> = {};
  problemComments.forEach(c => {
    counts[c.serviceLine] = (counts[c.serviceLine] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([service, count]) => ({ service, count }));
}

export function computeEquityInsights(comments: PatientComment[]) {
  const languageComments = comments.filter(c => c.problemTags.includes('language_barrier') || c.equityFlags?.language);
  const accessibilityComments = comments.filter(c => c.problemTags.includes('accessibility_barrier') || c.equityFlags?.accessibilityNeed);
  const digitalLiteracyComments = comments.filter(c => c.problemTags.includes('digital_literacy') || c.equityFlags?.digitalBarrier);

  // Group languages
  const languageCounts: Record<string, number> = {};
  languageComments.forEach(c => {
    const lang = c.equityFlags?.language || 'Non-English General';
    languageCounts[lang] = (languageCounts[lang] || 0) + 1;
  });

  return {
    languageBarriers: {
      count: languageComments.length,
      breakdown: languageCounts,
      comments: languageComments,
    },
    accessibilityConcerns: {
      count: accessibilityComments.length,
      comments: accessibilityComments,
    },
    digitalLiteracyChallenges: {
      count: digitalLiteracyComments.length,
      comments: digitalLiteracyComments,
    },
    personaComparison: computeSatisfactionByPersona(comments),
  };
}

export function computeAIRiskMonitoring(comments: PatientComment[]) {
  const hallucinationComments = comments.filter(c => c.riskCategory === 'hallucination_trap');
  const biasComments = comments.filter(c => c.riskCategory === 'bias_discrimination');
  const humanReviewCases = comments.filter(c => c.riskCategory === 'human_review_required' || c.humanReviewStatus);

  return {
    totalRiskFlagged: hallucinationComments.length + biasComments.length + humanReviewCases.length,
    hallucinationTraps: {
      count: hallucinationComments.length,
      items: hallucinationComments,
    },
    biasRelatedComments: {
      count: biasComments.length,
      items: biasComments,
    },
    casesRequiringHumanReview: {
      count: humanReviewCases.length,
      items: humanReviewCases,
    },
  };
}
