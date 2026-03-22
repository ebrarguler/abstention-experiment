import React, { useEffect, useState } from 'react';
import { useExperiment } from '../contexts/ExperimentContext';
import { completeParticipant } from '../api/client';

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

export default function DebriefPage() {
  const { participantId } = useExperiment();
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (participantId && !completed) {
      completeParticipant(participantId).then(() => setCompleted(true)).catch(() => setCompleted(true));
    }
  }, [participantId, completed]);

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '60px', height: '60px', backgroundColor: '#f0fdf4',
            borderRadius: '50%', fontSize: '28px', marginBottom: '16px',
          }}>
            ✓
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px' }}>
            Study Debrief — Thank You!
          </h1>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
            You have completed all tasks and the survey. Your participation is greatly appreciated.
          </p>
        </div>

        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginTop: 0, marginBottom: '12px' }}>
            True Purpose of This Study
          </h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: 0 }}>
            This study investigated whether <strong>AI abstention</strong> — an AI coding assistant
            saying "I don't know" — changes how developers evaluate and check AI-generated code.
            Specifically, we tested whether encountering an AI that sometimes declines to answer
            reduces <strong>overreliance</strong>: the tendency to accept AI suggestions without
            critical evaluation.
          </p>
        </div>

        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginTop: 0, marginBottom: '12px' }}>
            The Two Conditions
          </h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', marginBottom: '12px' }}>
            Participants were randomly assigned to one of two groups:
          </p>
          <ul style={{ fontSize: '14px', color: '#475569', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
            <li><strong>Group A (Always-Answers):</strong> The AI always provided code suggestions for every task.</li>
            <li><strong>Group B (Abstention):</strong> For two tasks, the AI responded with "I'm not confident enough to provide a suggestion," and participants had to write the solution themselves.</li>
          </ul>
        </div>

        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#92400e', marginTop: 0, marginBottom: '12px' }}>
            About the AI Suggestions
          </h2>
          <p style={{ fontSize: '14px', color: '#78350f', lineHeight: '1.7', margin: 0 }}>
            <strong>Important:</strong> Some of the AI-generated code suggestions were
            intentionally incorrect — they contained subtle bugs designed to look plausible but
            fail on certain test cases. This was necessary to measure whether participants would
            critically evaluate the AI's output or accept it without checking. We apologize if
            this caused frustration, and want you to know that incorrect suggestions were an
            intentional part of the experimental design.
          </p>
        </div>

        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#14532d', marginTop: 0, marginBottom: '12px' }}>
            Correct Solutions
          </h2>
          <p style={{ fontSize: '14px', color: '#166534', lineHeight: '1.7', marginBottom: '8px' }}>
            All six tasks had clear, correct solutions using standard Python patterns:
          </p>
          <ul style={{ fontSize: '14px', color: '#166534', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
            <li><strong>Remove Duplicate Characters:</strong> Iterate with a seen-set, preserving first occurrence order.</li>
            <li><strong>Chunk List:</strong> List comprehension with <code>range(0, len(lst), n)</code>.</li>
            <li><strong>Is Palindrome:</strong> Filter non-alphanumeric chars, lowercase, compare to reverse.</li>
            <li><strong>Rotate List:</strong> Use negative indexing: <code>lst[-k:] + lst[:-k]</code>.</li>
            <li><strong>Flatten Nested List:</strong> Recursive approach checking <code>isinstance(item, list)</code>.</li>
            <li><strong>Valid Parentheses:</strong> Stack-based matching with a bracket mapping dictionary.</li>
          </ul>
        </div>

        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginTop: 0, marginBottom: '8px' }}>
            Please Do Not Share
          </h2>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: 0 }}>
            To protect the validity of this study for future participants, please do not share
            the task descriptions, AI suggestions, or the nature of the experiment with others
            who might participate. Thank you for helping us maintain the integrity of our research.
          </p>
        </div>

        <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
            For questions about this study, contact:
          </p>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#2563eb', margin: 0 }}>
            researcher@university.edu
          </p>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '16px' }}>
            Your compensation will be processed within 5 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
