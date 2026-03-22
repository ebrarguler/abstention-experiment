import React, { useState } from 'react';
import { useExperiment } from '../contexts/ExperimentContext';
import { submitSurvey } from '../api/client';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '40px 24px',
  backgroundColor: '#f8fafc',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  padding: '40px',
  maxWidth: '720px',
  width: '100%',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
};

const likertLabels = [
  'Strongly Disagree',
  'Disagree',
  'Somewhat Disagree',
  'Neutral',
  'Somewhat Agree',
  'Agree',
  'Strongly Agree',
];

const tamQuestions = [
  { key: 'tam_useful', text: 'The AI coding assistant was useful for completing the tasks.' },
  { key: 'tam_reliable', text: 'I found the AI coding assistant to be reliable.' },
  { key: 'tam_trust_work', text: 'I would trust the AI coding assistant\'s suggestions in real work.' },
  { key: 'tam_accurate', text: 'The AI coding assistant\'s suggestions were accurate.' },
  { key: 'tam_use_future', text: 'I would use an AI coding assistant in my regular work.' },
  { key: 'tam_confident', text: 'I felt confident using the AI coding assistant.' },
];

interface Ratings {
  [key: string]: number | undefined;
}

export default function PostExperimentSurvey() {
  const { participantId, condition, setCurrentStep } = useExperiment();
  const [ratings, setRatings] = useState<Ratings>({});
  const [strategyOpen, setStrategyOpen] = useState('');
  const [abstentionOpen, setAbstentionOpen] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAbstention = condition === 'abstention';

  const tamComplete = tamQuestions.every((q) => ratings[q.key] !== undefined);
  const isValid = tamComplete && strategyOpen.trim().length > 0;

  async function handleSubmit() {
    if (!isValid || !participantId) return;
    setIsLoading(true);
    setError(null);
    try {
      for (const q of tamQuestions) {
        await submitSurvey(participantId, 'post_experiment', q.key, String(ratings[q.key]));
      }
      await submitSurvey(participantId, 'post_experiment', 'strategy_open', strategyOpen);
      if (isAbstention) {
        await submitSurvey(participantId, 'abstention_notice', 'abstention_notice_open', abstentionOpen);
      }
      setCurrentStep('debrief');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginTop: 0, marginBottom: '8px' }}>
          Post-Experiment Survey
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>
          Please answer the following questions about your experience with the AI coding assistant.
        </p>

        {/* TAM Likert items */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
            AI Coding Assistant Experience
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            Rate each statement from 1 (Strongly Disagree) to 7 (Strongly Agree).
          </p>

          {tamQuestions.map((q) => (
            <div key={q.key} style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', color: '#334155', marginBottom: '10px', lineHeight: '1.5' }}>
                {q.text}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <button
                    key={n}
                    title={likertLabels[n - 1]}
                    onClick={() => setRatings((prev) => ({ ...prev, [q.key]: n }))}
                    style={{
                      padding: '10px 0',
                      border: ratings[q.key] === n ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      borderRadius: '6px',
                      backgroundColor: ratings[q.key] === n ? '#eff6ff' : '#f8fafc',
                      color: ratings[q.key] === n ? '#2563eb' : '#374151',
                      fontWeight: ratings[q.key] === n ? '700' : '400',
                      cursor: 'pointer',
                      fontSize: '15px',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
            </div>
          ))}
        </div>

        {/* Open-ended strategy question */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
            Describe how you decided whether to use or modify the AI's suggestion.
          </label>
          <textarea
            value={strategyOpen}
            onChange={(e) => setStrategyOpen(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#1e293b',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
            placeholder="Please describe your decision-making process..."
          />
        </div>

        {/* Group B only: abstention question */}
        {isAbstention && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              Did you notice the AI declining to answer on some tasks? If so, how did it affect your approach to other tasks?
            </label>
            <textarea
              value={abstentionOpen}
              onChange={(e) => setAbstentionOpen(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#1e293b',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
              placeholder="Please describe your experience..."
            />
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#b91c1c', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          style={{
            width: '100%',
            padding: '12px 24px',
            backgroundColor: isValid && !isLoading ? '#2563eb' : '#94a3b8',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isValid && !isLoading ? 'pointer' : 'not-allowed',
          }}
        >
          {isLoading ? 'Submitting...' : 'Submit Survey'}
        </button>
      </div>
    </div>
  );
}
