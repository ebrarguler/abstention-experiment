import React, { useState } from 'react';
import { useExperiment } from '../contexts/ExperimentContext';
import { logEvent } from '../api/client';

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

const sectionStyle: React.CSSProperties = {
  marginBottom: '20px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '700',
  color: '#1e293b',
  marginBottom: '6px',
};

const sectionBodyStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#475569',
  lineHeight: '1.7',
  margin: 0,
};

export default function ConsentPage() {
  const { participantId, setCurrentStep } = useExperiment();
  const [consented, setConsented] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleConsent() {
    if (!consented || !participantId) return;
    setIsLoading(true);
    try {
      await logEvent(participantId, 'consent_given', { timestamp: new Date().toISOString() });
    } catch {
      // Continue even if logging fails
    }
    setCurrentStep('demographics');
    setIsLoading(false);
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#0f172a',
            marginTop: 0,
            marginBottom: '8px',
          }}
        >
          Informed Consent
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>
          Please read the following information carefully before proceeding.
        </p>

        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '28px',
          }}
        >
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Purpose of the Study</div>
            <p style={sectionBodyStyle}>
              This study investigates how software developers interact with AI-generated code
              suggestions. We aim to understand when and why developers choose to use, modify,
              or discard AI recommendations in the context of programming tasks.
            </p>
          </div>

          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Procedure</div>
            <p style={sectionBodyStyle}>
              You will complete 6 Python coding tasks with the assistance of an AI coding
              assistant. For each task, you will be shown an AI suggestion and asked to either
              use it or write your own solution. After the coding tasks, you will complete a
              brief survey about your experience. The session will be timed (8 minutes per task).
            </p>
          </div>

          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Duration</div>
            <p style={sectionBodyStyle}>
              The study takes approximately <strong>80–90 minutes</strong> to complete,
              including the coding tasks and survey.
            </p>
          </div>

          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Risks</div>
            <p style={sectionBodyStyle}>
              Risks are minimal. You may experience mild frustration from challenging programming
              tasks. You may stop at any time without penalty.
            </p>
          </div>

          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Benefits</div>
            <p style={sectionBodyStyle}>
              You will receive compensation for your participation as described in the study
              listing. Additionally, you will contribute to research that may improve the design
              of AI coding tools.
            </p>
          </div>

          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Data and Privacy</div>
            <p style={sectionBodyStyle}>
              Your responses will be anonymized and stored securely. Data will be used only
              for research purposes and will not be linked to your personal identity. Your
              participant ID is a randomly generated code with no connection to your name or
              contact information.
            </p>
          </div>

          <div style={{ ...sectionStyle, marginBottom: 0 }}>
            <div style={sectionTitleStyle}>Voluntary Participation</div>
            <p style={sectionBodyStyle}>
              Participation is entirely voluntary. You may withdraw at any time without
              consequence. If you withdraw, your data will not be used in the analysis.
              For questions about this study, contact the research team at{' '}
              <strong>researcher@university.edu</strong>.
            </p>
          </div>
        </div>

        {/* Consent checkbox */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            cursor: 'pointer',
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: consented ? '#f0fdf4' : '#f8fafc',
            border: `1px solid ${consented ? '#86efac' : '#e2e8f0'}`,
            borderRadius: '8px',
            transition: 'all 0.15s',
          }}
        >
          <input
            type="checkbox"
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
            style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#16a34a', flexShrink: 0 }}
          />
          <span style={{ fontSize: '14px', color: '#1e293b', lineHeight: '1.5' }}>
            I have read and understood the above information. I am at least 18 years of age, and
            I voluntarily agree to participate in this research study.
          </span>
        </label>

        <button
          onClick={handleConsent}
          disabled={!consented || isLoading}
          style={{
            width: '100%',
            padding: '12px 24px',
            backgroundColor: consented && !isLoading ? '#2563eb' : '#94a3b8',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: consented && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.15s',
          }}
        >
          {isLoading ? 'Continuing...' : 'I Agree and Continue'}
        </button>
      </div>
    </div>
  );
}
