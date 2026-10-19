import React, { useState } from 'react';
import { Sparkles, MessageSquare, Tag, Cloud, BarChart2 } from 'lucide-react';
import { TOP_NLP_THEMES, KEYWORD_FREQUENCY } from '../data/patientFeedbackData';

interface Section3NLPAnalysisProps {
  onKeywordClick?: (keyword: string) => void;
  onThemeClick?: (theme: string) => void;
}

export const Section3NLPAnalysis: React.FC<Section3NLPAnalysisProps> = ({
  onKeywordClick,
  onThemeClick,
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // Word cloud sizing helper
  const maxWordCount = Math.max(...KEYWORD_FREQUENCY.map((k) => k.count));
  const minWordCount = Math.min(...KEYWORD_FREQUENCY.map((k) => k.count));

  const getFontSize = (count: number) => {
    const minSize = 12;
    const maxSize = 28;
    const size = minSize + ((count - minWordCount) / (maxWordCount - minWordCount)) * (maxSize - minSize);
    return Math.round(size);
  };

  const getWordColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return 'text-emerald-700 hover:text-emerald-900 bg-emerald-50/70 border-emerald-200/80';
      case 'negative':
        return 'text-rose-700 hover:text-rose-900 bg-rose-50/70 border-rose-200/80';
      default:
        return 'text-slate-700 hover:text-slate-900 bg-slate-100/80 border-slate-200';
    }
  };

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-teal-700">Section 3</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Natural Language Processing & Unstructured Feedback</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            NLP Analysis & Sentiment Mining
          </h2>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center text-xs text-slate-500 space-x-4">
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span>
            Positive Polarity
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5"></span>
            Negative / Grievance
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 cols: Top Themes Identified from Comments */}
        <div className="lg:col-span-7 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center">
              <Tag className="w-4 h-4 mr-1.5 text-teal-600" />
              1. Top Themes Identified from Comments
            </h3>
            <span className="text-xs text-slate-500">Theme Distribution</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Algorithmic clustering of 1,248 unstructured patient narratives, ranked by volume and sentiment split.
          </p>

          <div className="space-y-3.5">
            {TOP_NLP_THEMES.map((t) => {
              const total = t.count;
              const posPct = t.sentimentBreakdown.positive;
              const neuPct = t.sentimentBreakdown.neutral;
              const negPct = t.sentimentBreakdown.negative;

              return (
                <div
                  key={t.theme}
                  onClick={() => onThemeClick && onThemeClick(t.theme)}
                  className="p-3 rounded-md border border-slate-100 hover:border-slate-300 hover:bg-slate-50/60 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-900 hover:text-teal-700">
                      {t.theme}
                    </span>
                    <div className="flex items-center space-x-2 text-slate-500">
                      <span className="font-medium text-slate-700">{total} mentions</span>
                      <span className="text-slate-300">·</span>
                      <span className={`font-semibold ${t.impactOnSatisfaction >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {t.impactOnSatisfaction >= 0 ? `+${t.impactOnSatisfaction}` : t.impactOnSatisfaction} pts
                      </span>
                    </div>
                  </div>

                  {/* Multi-segment Sentiment Distribution Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 flex overflow-hidden mb-2">
                    <div style={{ width: `${posPct}%` }} className="bg-emerald-500 h-full" title={`Positive: ${posPct}%`} />
                    <div style={{ width: `${neuPct}%` }} className="bg-slate-300 h-full" title={`Neutral: ${neuPct}%`} />
                    <div style={{ width: `${negPct}%` }} className="bg-rose-500 h-full" title={`Negative: ${negPct}%`} />
                  </div>

                  {/* Keywords in Theme */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="text-slate-400">Keywords:</span>
                    {t.sampleKeywords.map((kw, i) => (
                      <span key={i} className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 cols: Word Cloud & Most Frequently Occurring Keywords */}
        <div className="lg:col-span-5 space-y-5">
          {/* Word Cloud */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center">
                <Cloud className="w-4 h-4 mr-1.5 text-indigo-600" />
                2. Semantic Word Cloud
              </h3>
              <span className="text-xs text-slate-500">Weighted by Frequency</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Interactive token frequency map. Click any term to drill into raw records.
            </p>

            <div className="p-3.5 bg-slate-50/80 rounded-md border border-slate-200/70 min-h-[190px] flex flex-wrap items-center justify-center gap-2 text-center">
              {KEYWORD_FREQUENCY.map((item) => {
                const fontSize = getFontSize(item.count);
                const colorClass = getWordColor(item.sentiment);
                const isSelected = selectedWord === item.word;

                return (
                  <button
                    key={item.word}
                    onClick={() => {
                      setSelectedWord(item.word);
                      if (onKeywordClick) onKeywordClick(item.word);
                    }}
                    style={{ fontSize: `${fontSize}px` }}
                    className={`font-medium transition-all px-2 py-0.5 rounded border inline-block cursor-pointer ${colorClass} ${
                      isSelected ? 'ring-2 ring-teal-600 scale-105 shadow-xs font-bold' : ''
                    }`}
                    title={`${item.word}: ${item.count} occurrences (${item.sentiment})`}
                  >
                    {item.word}
                  </button>
                );
              })}
            </div>
            {selectedWord && (
              <div className="mt-2 text-right text-xs">
                <button
                  onClick={() => {
                    setSelectedWord(null);
                    if (onKeywordClick) onKeywordClick('');
                  }}
                  className="text-teal-700 hover:text-teal-900 font-medium underline"
                >
                  Clear "{selectedWord}" filter
                </button>
              </div>
            )}
          </div>

          {/* Most Frequently Occurring Keywords Ranking */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center">
                <BarChart2 className="w-4 h-4 mr-1.5 text-teal-600" />
                3. Most Frequently Occurring Keywords
              </h3>
              <span className="text-xs text-slate-500">Top 6 Tokens</span>
            </div>

            <div className="space-y-2.5 mt-3">
              {KEYWORD_FREQUENCY.slice(0, 6).map((k) => (
                <div key={k.word} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-800 capitalize">{k.word}</span>
                    <span className="text-slate-500 font-semibold">{k.count} mentions</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        k.sentiment === 'positive'
                          ? 'bg-emerald-500'
                          : k.sentiment === 'negative'
                          ? 'bg-rose-500'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${(k.count / maxWordCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
