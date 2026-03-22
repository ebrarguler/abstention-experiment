import React, { useState, useEffect, useRef } from 'react';

interface TimerProps {
  totalSeconds: number;
  onTimeout: () => void;
}

export default function Timer({ totalSeconds, onTimeout }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeoutRef.current();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeoutRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  let color = '#1e293b';
  let fontWeight: React.CSSProperties['fontWeight'] = 'normal';
  if (secondsLeft <= 30) {
    color = '#dc2626';
    fontWeight = 'bold';
  } else if (secondsLeft <= 120) {
    color = '#d97706';
    fontWeight = 'bold';
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '6px',
        border: `2px solid ${color}`,
        backgroundColor: secondsLeft <= 30 ? '#fee2e2' : secondsLeft <= 120 ? '#fef3c7' : '#f1f5f9',
      }}
    >
      <span style={{ fontSize: '13px', color: '#64748b' }}>Time remaining:</span>
      <span style={{ fontSize: '20px', fontFamily: 'monospace', color, fontWeight }}>
        {display}
      </span>
    </div>
  );
}
