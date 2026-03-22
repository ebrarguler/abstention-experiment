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

const stepBoxStyle: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  alignItems: 'flex-start',
  padding: '16px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  marginBottom: '12px',
};

const stepNumStyle: React.CSSProperties = {
  width: '28px',
  height: '28px',
  backgroundColor: '#2563eb',
  color: '#fff',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '13px',
  fontWeight: '700',
  flexShrink: 0,
};

const steps = [
  {
    title: 'Read the Task Description',
    body: 'Each task presents a Python function to implement, with examples showing the expected inputs and outputs.',
  },
  {
    title: 'View the AI Suggestion Panel',
    body: 'After reading the description, an AI suggestion will appear. You can choose to use the AI\'s code or write your own from scratch.',
  },
  {
    title: 'Choose Your Approach',
    body: 'Click "Use AI Suggestion" to load the AI\'s code into the editor, or "Write from Scratch" to start with an empty editor.',
  },
  {
    title: 'Edit Code in the Editor',
    body: 'Use the Monaco code editor (the same engine as VS Code) to write or modify your solution.',
  },
  {
    title: 'Run Tests',
    body: 'Click "Run Tests" to execute your code against the visible test cases. You can run tests as many times as you like before submitting.',
  },
  {
    title: 'Submit Your Solution',
    body: 'When satisfied, click "Submit Solution". A confirmation dialog will appear. You cannot return to a task after submitting.',
  },
  {
    title: 'Rate Your Confidence',
    body: 'After submitting, rate how confident you are that your solution is correct on a 7-point scale.',
  },
];

export default function TrainingPage() {
  const { participantId, condition, setCurrentStep } = useExperiment();
  const [quizAnswer, setQuizAnswer] = useState<string>('');
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const correctAnswer = 'run_submit';
  const isCorrect = quizAnswer === correctAnswer;

  async function handleBeginTasks() {
    setIsLoading(true);
    try {
      if (participantId) {
        await logEvent(participantId, 'training_completed', {});
      }
    } catch {
      // continue
    }
    setCurrentStep('task');
    setIsLoading(false);
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginTop: 0, marginBottom: '8px' }}>
          Platform Tutorial
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>
          Before starting the coding tasks, please read through this quick tutorial to understand
          how the platform works.
        </p>

        <div style={{ marginBottom: '24px' }}>
          {steps.map((step, i) => (
            <div key={i} style={stepBoxStyle}>
              <div style={stepNumStyle}>{i + 1}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                  {step.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        {condition === 'abstention' && (
          <div style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '14px',
            color: '#78350f',
          }}>
            <strong>Note:</strong> The AI assistant may occasionally indicate that it is not
            confident enough to provide a suggestion for a particular task. This is a normal
            feature of the system. When this happens, you will see a message instead of code,
            and you should write the solution yourself.
          </div>
        )}

        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0369a1', marginBottom: '12px' }}>
            Comprehension Check
          </div>
          <p style={{ fontSize: '14px', color: '#0c4a6e', marginBottom: '12px' }}>
            What should you do after writing your code?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { value: 'submit_directly', label: 'Submit directly without running tests' },
              { value: 'run_submit', label: 'Run tests, then submit when satisfied' },
              { value: 'ask_ai', label: 'Ask the AI for the correct answer' },
            ].map((opt) => (
              <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#1e293b' }}>
                <input
                  type="radio"
                  name="quiz"
                  value={opt.value}
                  checked={quizAnswer === opt.value}
                  onChange={(e) => setQuizAnswer(e.target.value)}
                  style={{ accentColor: '#2563eb' }}
                />
                {opt.label}
              </label>
            ))}
          </div>
          {quizSubmitted && !isCorrect && (
            <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px' }}>
              Please select the correct answer: "Run tests, then submit when satisfied."
            </p>
          )}
          {quizSubmitted && isCorrect && (
            <p style={{ color: '#16a34a', fontSize: '13px', marginTop: '8px' }}>
              Correct! You're ready to begin.
            </p>
          )}
        </div>

        <button
          onClick={() => {
            if (!quizAnswer) { setQuizSubmitted(true); return; }
            if (!isCorrect) { setQuizSubmitted(true); return; }
            handleBeginTasks();
          }}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px 24px',
            backgroundColor: isLoading ? '#94a3b8' : '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Starting...' : 'Begin Tasks'}
        </button>
      </div>
    </div>
  );
}
