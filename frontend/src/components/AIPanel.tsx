import React, { useState } from 'react';

interface AIPanelProps {
  aiResponseType: 'correct' | 'incorrect' | 'abstention';
  aiCodeShown: string | null;
  onUseAI: () => void;
  onWriteScratch: () => void;
  adopted: boolean | null;
  hints?: string[];
}

function AIPanelWithCode({
  aiCodeShown,
  adopted,
  onUseAI,
  onWriteScratch,
  cardStyle,
  headerStyle,
  primaryButton,
  secondaryButton,
}: {
  aiCodeShown: string;
  adopted: boolean | null;
  onUseAI: () => void;
  onWriteScratch: () => void;
  cardStyle: React.CSSProperties;
  headerStyle: React.CSSProperties;
  primaryButton: React.CSSProperties;
  secondaryButton: React.CSSProperties;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>AI Suggestion</div>
      {!revealed ? (
        <div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
            An AI suggestion is available. You can reveal it or write your own solution.
          </div>
          <div>
            <button style={primaryButton} onClick={() => setRevealed(true)}>
              Reveal AI Suggestion
            </button>
            <button style={secondaryButton} onClick={onWriteScratch}>
              Write from Scratch
            </button>
          </div>
        </div>
      ) : (
        <>
          <pre
            style={{
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              padding: '14px',
              borderRadius: '6px',
              overflowX: 'auto',
              fontSize: '13px',
              lineHeight: '1.6',
              marginBottom: '12px',
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            }}
          >
            <code>{aiCodeShown}</code>
          </pre>
          {adopted === null ? (
            <div>
              <button style={primaryButton} onClick={onUseAI}>
                Use AI Suggestion
              </button>
              <button style={secondaryButton} onClick={onWriteScratch}>
                Write from Scratch
              </button>
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>
              {adopted
                ? 'You chose to use the AI suggestion as your starting point.'
                : 'You chose to write your own solution.'}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function AIPanel({
  aiResponseType,
  aiCodeShown,
  onUseAI,
  onWriteScratch,
  adopted,
  hints = [],
}: AIPanelProps) {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#ffffff',
    marginBottom: '16px',
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '12px',
  };

  const buttonBase: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'opacity 0.15s',
  };

  const primaryButton: React.CSSProperties = {
    ...buttonBase,
    backgroundColor: '#2563eb',
    color: '#ffffff',
    marginRight: '8px',
  };

  const secondaryButton: React.CSSProperties = {
    ...buttonBase,
    backgroundColor: '#f1f5f9',
    color: '#1e293b',
    border: '1px solid #cbd5e1',
  };

  if (aiResponseType === 'abstention') {
    return (
      <div style={cardStyle}>
        <div style={headerStyle}>AI Suggestion</div>
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '16px',
            color: '#64748b',
            marginBottom: '12px',
          }}
        >
          <div style={{ fontSize: '15px', marginBottom: '6px', fontWeight: '500' }}>
            I'm not confident enough to provide a suggestion for this task.
          </div>
          <div style={{ fontSize: '13px' }}>
            Please write your own solution from scratch.
          </div>
        </div>
        {hints.length > 0 && (
          <div
            style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '6px',
              padding: '12px 14px',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Hints
            </div>
            <ol style={{ margin: 0, paddingLeft: '18px' }}>
              {hints.map((hint, i) => (
                <li key={i} style={{ fontSize: '13px', color: '#78350f', marginBottom: i < hints.length - 1 ? '6px' : '0', lineHeight: '1.5' }}>
                  {hint}
                </li>
              ))}
            </ol>
          </div>
        )}
        {adopted === null ? (
          <button style={secondaryButton} onClick={onWriteScratch}>
            Write from Scratch
          </button>
        ) : (
          <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>
            You chose to write your own solution.
          </div>
        )}
      </div>
    );
  }

  if (aiCodeShown) {
    return (
      <AIPanelWithCode
        aiCodeShown={aiCodeShown}
        adopted={adopted}
        onUseAI={onUseAI}
        onWriteScratch={onWriteScratch}
        cardStyle={cardStyle}
        headerStyle={headerStyle}
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
      />
    );
  }

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>AI Suggestion</div>
      <div style={{ color: '#64748b', fontSize: '14px' }}>No AI suggestion available.</div>
    </div>
  );
}
