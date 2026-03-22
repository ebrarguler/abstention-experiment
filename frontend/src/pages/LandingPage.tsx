import React, { useState } from 'react';
import { useExperiment } from '../contexts/ExperimentContext';
import { createParticipant } from '../api/client';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  backgroundColor: '#f8fafc',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  padding: '40px',
  maxWidth: '640px',
  width: '100%',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
};

export default function LandingPage() {
  const { setParticipantId, setCondition, setTaskAssignments, setCurrentStep } = useExperiment();

  const [proficiency, setProficiency] = useState<number>(5);
  const [yearsExperience, setYearsExperience] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIneligible, setShowIneligible] = useState(false);

  const yearsNum = parseInt(yearsExperience, 10);
  const isEligible = proficiency >= 5 && !isNaN(yearsNum) && yearsNum >= 1;
  const hasAnswered = yearsExperience !== '' && !isNaN(yearsNum) && yearsNum > 0;
  const isIneligible = hasAnswered && !isEligible;

  async function handleBegin() {
    if (!isEligible) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await createParticipant(proficiency);
      setParticipantId(result.id);
      setCondition(result.condition);
      setTaskAssignments(result.task_assignments);
      setCurrentStep('consent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start study. Please try again.');
      setIsLoading(false);
    }
  }

  function handleCheckEligibility() {
    const years = parseInt(yearsExperience, 10);
    if (proficiency < 5 || isNaN(years) || years < 1) {
      setShowIneligible(true);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#2563eb',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Research Study
          </div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '0 0 12px 0',
              lineHeight: '1.2',
            }}
          >
            Developer AI Interaction Study
          </h1>
          <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
            We are conducting a study on how developers interact with AI-generated code
            suggestions. The study takes approximately{' '}
            <strong>80–90 minutes</strong> and involves completing Python coding tasks with AI
            assistance.
          </p>
        </div>

        {/* Eligibility criteria */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '12px',
            }}
          >
            Eligibility Requirements
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 20px', color: '#334155', fontSize: '14px' }}>
            <li style={{ marginBottom: '6px' }}>Python proficiency of 5/10 or higher</li>
            <li style={{ marginBottom: '6px' }}>At least 1 year of programming experience</li>
            <li>Ability to read English programming descriptions</li>
          </ul>
        </div>

        {/* Proficiency slider */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '8px',
            }}
          >
            Rate your Python proficiency
            <span style={{ fontWeight: '400', color: '#64748b' }}>
              {' '}
              (1 = complete beginner, 10 = expert)
            </span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <input
              type="range"
              min={1}
              max={10}
              value={proficiency}
              onChange={(e) => {
                setProficiency(parseInt(e.target.value, 10));
                setShowIneligible(false);
              }}
              style={{ flex: 1, accentColor: '#2563eb' }}
            />
            <span
              style={{
                minWidth: '40px',
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: '700',
                color: proficiency >= 5 ? '#2563eb' : '#dc2626',
              }}
            >
              {proficiency}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#94a3b8',
              marginTop: '4px',
            }}
          >
            <span>Beginner</span>
            <span>Expert</span>
          </div>
        </div>

        {/* Years experience */}
        <div style={{ marginBottom: '28px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '8px',
            }}
          >
            Years of programming experience
          </label>
          <input
            type="number"
            min={0}
            value={yearsExperience}
            onChange={(e) => {
              setYearsExperience(e.target.value);
              setShowIneligible(false);
            }}
            onBlur={handleCheckEligibility}
            placeholder="e.g. 3"
            style={{
              width: '120px',
              padding: '8px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#1e293b',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Ineligible message */}
        {(showIneligible || isIneligible) && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              color: '#b91c1c',
              fontSize: '14px',
            }}
          >
            <strong>We're sorry</strong> — based on your responses, you do not meet the
            eligibility criteria for this study. Thank you for your interest.
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              color: '#b91c1c',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* Begin button */}
        <button
          onClick={handleBegin}
          disabled={!isEligible || isLoading}
          style={{
            width: '100%',
            padding: '12px 24px',
            backgroundColor: isEligible && !isLoading ? '#2563eb' : '#94a3b8',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isEligible && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.15s',
          }}
        >
          {isLoading ? 'Starting study...' : 'Begin Study'}
        </button>

        <p
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#94a3b8',
            marginTop: '16px',
            marginBottom: 0,
          }}
        >
          By clicking "Begin Study" you will be taken to the informed consent page.
        </p>
      </div>
    </div>
  );
}
