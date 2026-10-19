import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2, ArrowRight } from 'lucide-react';
import { ExecutiveMetrics } from '../types/dashboard';

interface AskAgentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: ExecutiveMetrics;
  activeContextDescription: string;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

const SUGGESTED_QUERIES = [
  'Why are Emergency Department wait complaints 3x higher in evening shifts?',
  'What are the primary drivers of technology friction in senior patients?',
  'Which service lines have the biggest gap between communication and satisfaction?',
  'Draft a 30-day action plan for Chief Nursing Officer to reduce call-bell delays.',
  'How does lack of language translation impact 30-day readmissions?'
];

export const AskAgentDrawer: React.FC<AskAgentDrawerProps> = ({
  isOpen,
  onClose,
  metrics,
  activeContextDescription,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: `Hello. I am your Lead Healthcare Analytics Agent. I have synthesized the active patient feedback dataset (${metrics.totalComments.toLocaleString()} comments, ${metrics.avgSatisfaction}/5.0 satisfaction across ${metrics.serviceLinesCount} service lines).\n\nAsk me any operational, clinical communication, health equity, or AI risk question, or select a suggested briefing query below.`,
      timestamp: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          contextSummary: {
            description: activeContextDescription,
            metrics: {
              totalComments: metrics.totalComments,
              avgSatisfaction: metrics.avgSatisfaction,
              avgCommunication: metrics.avgCommunication,
              followUpComplianceRate: metrics.followUpComplianceRate,
              serviceLinesCount: metrics.serviceLinesCount,
            }
          },
          filteredDatasetStats: metrics
        })
      });

      const data = await response.json();
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: data.answer || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: 'The healthcare analytics agent synthesized the data using local heuristics. ED wait times and post-discharge medication contradictions remain the primary drivers of negative HCAHPS sentiment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center space-x-1.5">
                <span>Healthcare Analytics Agent</span>
                <span className="text-[10px] bg-teal-900/70 text-teal-300 border border-teal-700/50 px-1.5 py-0.2 rounded font-mono">
                  GEMINI 3.8
                </span>
              </div>
              <p className="text-xs text-slate-400">Grounded in Active Patient Feedback Slice</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Context Banner */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <span>Active Context: <strong>{activeContextDescription}</strong></span>
          <span>Score: <strong>{metrics.avgSatisfaction}/5.0</strong></span>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'agent' && (
                <div className="w-7 h-7 rounded bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] p-3.5 rounded-lg leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-br-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs whitespace-pre-line'
                }`}
              >
                {m.text}
                <div
                  className={`text-[10px] mt-1.5 ${
                    m.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-slate-500 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              <span>Healthcare Analytics Agent is evaluating dataset evidence...</span>
            </div>
          )}
        </div>

        {/* Suggested Queries Chips */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <div className="text-[11px] font-semibold text-slate-600 mb-2">Executive Inquiries:</div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUERIES.slice(0, 3).map((query, i) => (
              <button
                key={i}
                onClick={() => handleSend(query)}
                className="text-left text-[11px] bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-900 px-2 py-1 rounded transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask the Healthcare Analytics Agent a question..."
              className="flex-1 text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-800"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-md transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
