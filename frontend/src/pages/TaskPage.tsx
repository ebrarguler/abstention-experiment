import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useExperiment } from '../contexts/ExperimentContext';
import { runTests, submitSolution, submitSurvey, logEvent } from '../api/client';
import type { TestResult, TaskAssignment } from '../types';
import Timer from '../components/Timer';
import AIPanel from '../components/AIPanel';
import CodeEditor from '../components/CodeEditor';
import TestResults from '../components/TestResults';

const layoutStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  padding: '24px',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '20px',
  maxWidth: '1400px',
  margin: '0 auto 20px',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  maxWidth: '1400px',
  margin: '0 auto',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
};

const btnPrimary: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
};

const btnSecondary: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#f1f5f9',
  color: '#334155',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
};

const btnDanger: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
};

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  const renderInline = (line: string): React.ReactNode => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={idx}>{part.slice(2, -2)}</strong>
        : part
    );
  };

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('### ')) {
      nodes.push(<h3 key={i} style={{ margin: '12px 0 4px', fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      nodes.push(<h2 key={i} style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{line.slice(3)}</h2>);
    } else if (line.trim() === '```') {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== '```') {
        codeLines.push(lines[i]);
        i++;
      }
      nodes.push(
        <pre key={i} style={{ backgroundColor: '#f1f5f9', borderRadius: '6px', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', overflowX: 'auto', margin: '6px 0', whiteSpace: 'pre-wrap' }}>
          {codeLines.join('\n')}
        </pre>
      );
    } else if (line.trim() === '') {
      nodes.push(<div key={i} style={{ height: '6px' }} />);
    } else {
      nodes.push(<p key={i} style={{ margin: '2px 0' }}>{renderInline(line)}</p>);
    }
    i++;
  }
  return nodes;
}

export default function TaskPage() {
  const { participantId, taskAssignments, currentTaskIndex, advanceTask } = useExperiment();
  const task: TaskAssignment = taskAssignments[currentTaskIndex];

  const [code, setCode] = useState(task?.starter_code ?? '');
  const [adoptionChoice, setAdoptionChoice] = useState<'used_ai' | 'wrote_scratch' | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testsRun, setTestsRun] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false);
  const [confidenceRating, setConfidenceRating] = useState<number | null>(null);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [submittedResults, setSubmittedResults] = useState<TestResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startedAtRef = useRef(new Date().toISOString());

  // Reset state when task changes
  useEffect(() => {
    setCode(task?.starter_code ?? '');
    setAdoptionChoice(null);
    setTestResults([]);
    setTestsRun(false);
    setShowConfirmSubmit(false);
    setShowConfidence(false);
    setConfidenceRating(null);
    setTaskCompleted(false);
    setTimedOut(false);
    setSubmittedResults(null);
    setError(null);
    startedAtRef.current = new Date().toISOString();
    if (participantId && task) {
      logEvent(participantId, 'task_start', { task_id: task.task_id, task_order: task.task_order }, task.task_id).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTaskIndex]);

  const handleUseAI = useCallback(() => {
    if (!task) return;
    setCode(task.ai_code_shown ?? '');
    setAdoptionChoice('used_ai');
    if (participantId) {
      logEvent(participantId, 'adoption_choice', { choice: 'used_ai' }, task.task_id).catch(() => {});
    }
  }, [task, participantId]);

  const handleWriteScratch = useCallback(() => {
    if (!task) return;
    setCode('');
    setAdoptionChoice('wrote_scratch');
    if (participantId) {
      logEvent(participantId, 'adoption_choice', { choice: 'wrote_scratch' }, task.task_id).catch(() => {});
    }
  }, [task, participantId]);

  async function handleRunTests() {
    if (!task || !participantId || !adoptionChoice) return;
    setIsRunningTests(true);
    setError(null);
    try {
      const res = await runTests(participantId, task.task_id, code, adoptionChoice);
      setTestResults(res.test_results);
      setTestsRun(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run tests');
    } finally {
      setIsRunningTests(false);
    }
  }

  async function doSubmit(isTimedOut = false) {
    if (!task || !participantId) return;
    const choice = adoptionChoice ?? 'wrote_scratch';
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await submitSolution(
        participantId,
        task.task_id,
        code,
        choice,
        startedAtRef.current,
        isTimedOut
      );
      setSubmittedResults(res.test_results);
      setTaskCompleted(true);
      setShowConfirmSubmit(false);
      setShowConfidence(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleTimeout() {
    setTimedOut(true);
    await doSubmit(true);
  }

  async function handleConfidenceSubmit() {
    if (confidenceRating === null || !participantId || !task) return;
    try {
      await submitSurvey(
        participantId,
        'post_task_confidence',
        'confidence',
        String(confidenceRating),
        task.task_id
      );
      await logEvent(participantId, 'confidence_rated', { rating: confidenceRating }, task.task_id);
    } catch {
      // continue even if logging fails
    }
    advanceTask();
  }

  if (!task) return <div style={{ padding: '40px' }}>No task found.</div>;

  return (
    <div style={layoutStyle}>
      {/* Header row */}
      <div style={headerStyle}>
        <div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
            Task {currentTaskIndex + 1} of {taskAssignments.length}
          </span>
          <h2 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>
            {task.title}
          </h2>
        </div>
        {!taskCompleted && (
          <Timer totalSeconds={480} onTimeout={handleTimeout} />
        )}
      </div>

      {/* Two-column grid */}
      <div style={gridStyle}>
        {/* Left column: description + AI panel */}
        <div>
          <div style={{ ...cardStyle, marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>
              Task Description
            </div>
            <div style={{ fontSize: '14px', color: '#1e293b', lineHeight: '1.7' }}>
              {renderMarkdown(task.description)}
            </div>
            <div style={{ marginTop: '16px', backgroundColor: '#f8fafc', borderRadius: '6px', padding: '12px', fontFamily: 'monospace', fontSize: '13px', color: '#475569' }}>
              {task.function_signature}
            </div>
          </div>

          <AIPanel
            aiResponseType={task.ai_response_type}
            aiCodeShown={task.ai_code_shown}
            onUseAI={handleUseAI}
            onWriteScratch={handleWriteScratch}
            adopted={adoptionChoice !== null ? adoptionChoice === 'used_ai' : null}
            hints={task.hints}
          />
        </div>

        {/* Right column: editor + test runner */}
        <div>
          <div style={{ ...cardStyle, marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>
              Code Editor
            </div>
            {adoptionChoice === null ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                Choose an approach in the AI panel to enable the editor.
              </div>
            ) : (
              <CodeEditor value={code} onChange={setCode} height="380px" />
            )}
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '12px', marginBottom: '12px', color: '#b91c1c', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button
              style={adoptionChoice && !taskCompleted ? btnSecondary : { ...btnSecondary, opacity: 0.5, cursor: 'not-allowed' }}
              disabled={!adoptionChoice || taskCompleted || isRunningTests}
              onClick={handleRunTests}
            >
              {isRunningTests ? 'Running...' : 'Run Tests'}
            </button>
            <button
              style={adoptionChoice && !taskCompleted ? btnPrimary : { ...btnPrimary, opacity: 0.5, cursor: 'not-allowed' }}
              disabled={!adoptionChoice || taskCompleted || isSubmitting}
              onClick={() => setShowConfirmSubmit(true)}
            >
              Submit Solution
            </button>
          </div>

          {(testsRun || submittedResults) && (
            <div style={cardStyle}>
              <TestResults results={submittedResults ?? testResults} testsRun={testsRun || !!submittedResults} visibleTests={task.visible_tests} />
            </div>
          )}
        </div>
      </div>

      {/* Confirm submit modal */}
      {showConfirmSubmit && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '32px', maxWidth: '400px', width: '90%' }}>
            <h3 style={{ marginTop: 0, color: '#0f172a' }}>Submit Solution?</h3>
            <p style={{ color: '#475569', fontSize: '14px' }}>
              Are you ready to submit? You cannot return to this task after submitting.
            </p>
            {timedOut && (
              <p style={{ color: '#d97706', fontSize: '13px' }}>Time has expired — this submission will be auto-submitted.</p>
            )}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button style={btnSecondary} onClick={() => setShowConfirmSubmit(false)}>Cancel</button>
              <button style={btnDanger} onClick={() => doSubmit(false)} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confidence rating modal */}
      {showConfidence && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '32px', maxWidth: '480px', width: '90%' }}>
            <h3 style={{ marginTop: 0, color: '#0f172a' }}>How confident are you?</h3>
            <p style={{ color: '#475569', fontSize: '14px', marginBottom: '24px' }}>
              How confident are you that your submitted solution is correct?
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '16px' }}>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button
                  key={n}
                  onClick={() => setConfidenceRating(n)}
                  style={{
                    padding: '12px 0',
                    border: confidenceRating === n ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    borderRadius: '6px',
                    backgroundColor: confidenceRating === n ? '#eff6ff' : '#f8fafc',
                    color: confidenceRating === n ? '#2563eb' : '#374151',
                    fontWeight: confidenceRating === n ? '700' : '400',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '24px' }}>
              <span>Not at all confident</span>
              <span>Extremely confident</span>
            </div>
            <button
              style={confidenceRating !== null ? btnPrimary : { ...btnPrimary, opacity: 0.5, cursor: 'not-allowed' }}
              disabled={confidenceRating === null}
              onClick={handleConfidenceSubmit}
            >
              {currentTaskIndex < taskAssignments.length - 1 ? 'Next Task' : 'Finish Tasks'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
