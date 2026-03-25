import type { TestResult, VisibleTest } from '../types';

interface TestResultsProps {
  results: TestResult[];
  testsRun: boolean;
  visibleTests?: VisibleTest[];
}

export default function TestResults({ results, testsRun, visibleTests }: TestResultsProps) {
  if (!testsRun) {
    return (
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: '#ffffff',
          color: '#94a3b8',
          fontSize: '14px',
          textAlign: 'center',
        }}
      >
        Run tests to see results here.
      </div>
    );
  }

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const allPassed = passed === total;

  return (
    <div
      style={{
        border: `1px solid ${allPassed ? '#16a34a' : '#dc2626'}`,
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#ffffff',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <span style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>
          Test Results
        </span>
        <span
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: allPassed ? '#16a34a' : '#dc2626',
            backgroundColor: allPassed ? '#f0fdf4' : '#fef2f2',
            padding: '4px 10px',
            borderRadius: '20px',
            border: `1px solid ${allPassed ? '#bbf7d0' : '#fecaca'}`,
          }}
        >
          {passed} / {total} passing
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {results.map((result, idx) => (
          <div
            key={idx}
            style={{
              border: `1px solid ${result.passed ? '#bbf7d0' : '#fecaca'}`,
              borderRadius: '6px',
              padding: '10px 12px',
              backgroundColor: result.passed ? '#f0fdf4' : '#fef2f2',
            }}
          >
            {(() => {
              const vt = visibleTests?.[idx];
              return vt ? (
                <div style={{ marginBottom: '6px', fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
                  <span style={{ fontWeight: '600' }}>Input: </span>
                  {vt.input_args.map((a) => JSON.stringify(a)).join(', ')}
                  <span style={{ margin: '0 6px', color: '#cbd5e1' }}>→</span>
                  <span style={{ fontWeight: '600' }}>Expected: </span>
                  {JSON.stringify(vt.expected_output)}
                </div>
              ) : null;
            })()}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: result.error || !result.passed ? '6px' : '0',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: result.passed ? '#16a34a' : '#dc2626',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  lineHeight: '18px',
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                {result.passed ? '✓' : '✗'}
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: result.passed ? '#15803d' : '#b91c1c',
                  fontFamily: 'monospace',
                }}
              >
                {result.name}
              </span>
            </div>

            {!result.passed && (
              <div style={{ paddingLeft: '26px', fontSize: '12px', color: '#475569' }}>
                {result.expected && (
                  <div style={{ marginBottom: '3px' }}>
                    <span style={{ fontWeight: '600' }}>Expected: </span>
                    <code
                      style={{
                        backgroundColor: '#e2e8f0',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        fontFamily: 'monospace',
                      }}
                    >
                      {result.expected}
                    </code>
                  </div>
                )}
                {result.actual && (
                  <div style={{ marginBottom: '3px' }}>
                    <span style={{ fontWeight: '600' }}>Got: </span>
                    <code
                      style={{
                        backgroundColor: '#fee2e2',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        fontFamily: 'monospace',
                      }}
                    >
                      {result.actual}
                    </code>
                  </div>
                )}
                {result.error && (
                  <div
                    style={{
                      marginTop: '4px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '4px',
                      padding: '6px 8px',
                      color: '#b91c1c',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                    }}
                  >
                    {result.error}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
