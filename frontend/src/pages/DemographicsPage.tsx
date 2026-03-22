import React, { useState } from 'react';
import { useExperiment } from '../contexts/ExperimentContext';
import { saveDemographics } from '../api/client';
import type { Demographics } from '../types';

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
  maxWidth: '640px',
  width: '100%',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
};

const fieldStyle: React.CSSProperties = {
  marginBottom: '20px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '14px',
  color: '#1e293b',
  backgroundColor: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
};

export default function DemographicsPage() {
  const { participantId, setCurrentStep } = useExperiment();

  // We retrieve python_proficiency from localStorage/context indirectly via a stored value
  // The proficiency was collected on the landing page. We'll display it from state if available.
  const [form, setForm] = useState<Omit<Demographics, 'python_proficiency'> & { python_proficiency?: number }>({
    age_range: '',
    gender: '',
    education: '',
    years_experience: 1,
    primary_language: '',
    ai_tool_frequency: '',
    ai_tool_name: '',
    current_role: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const isValid =
    form.age_range !== '' &&
    form.gender !== '' &&
    form.education !== '' &&
    form.years_experience >= 1 &&
    form.primary_language.trim() !== '' &&
    form.ai_tool_frequency !== '' &&
    form.current_role !== '';

  async function handleSubmit() {
    if (!isValid || !participantId) return;
    setIsLoading(true);
    setError(null);
    try {
      const demographics: Demographics = {
        age_range: form.age_range,
        gender: form.gender,
        education: form.education,
        years_experience: form.years_experience,
        python_proficiency: form.python_proficiency ?? 5,
        primary_language: form.primary_language,
        ai_tool_frequency: form.ai_tool_frequency,
        ai_tool_name: form.ai_tool_name,
        current_role: form.current_role,
      };
      await saveDemographics(participantId, demographics);
      setCurrentStep('training');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save. Please try again.');
      setIsLoading(false);
    }
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
          Background Information
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>
          Please answer a few questions about your background. This information helps us
          contextualize the study results.
        </p>

        {/* Age range */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Age range</label>
          <select
            style={selectStyle}
            value={form.age_range}
            onChange={(e) => update('age_range', e.target.value)}
          >
            <option value="">Select...</option>
            <option value="18-24">18–24</option>
            <option value="25-34">25–34</option>
            <option value="35-44">35–44</option>
            <option value="45-54">45–54</option>
            <option value="55+">55+</option>
          </select>
        </div>

        {/* Gender */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Gender</label>
          <select
            style={selectStyle}
            value={form.gender}
            onChange={(e) => update('gender', e.target.value)}
          >
            <option value="">Select...</option>
            <option value="man">Man</option>
            <option value="woman">Woman</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Education */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Highest level of education</label>
          <select
            style={selectStyle}
            value={form.education}
            onChange={(e) => update('education', e.target.value)}
          >
            <option value="">Select...</option>
            <option value="some_high_school">Some high school</option>
            <option value="high_school">High school diploma / GED</option>
            <option value="bachelors">Bachelor's degree</option>
            <option value="masters">Master's degree</option>
            <option value="phd">PhD</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Years of experience */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Years of programming experience</label>
          <input
            type="number"
            min={1}
            style={{ ...inputStyle, width: '120px' }}
            value={form.years_experience}
            onChange={(e) =>
              update('years_experience', Math.max(1, parseInt(e.target.value, 10) || 1))
            }
          />
        </div>

        {/* Primary language */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Primary programming language</label>
          <input
            type="text"
            style={inputStyle}
            placeholder="e.g. Python, JavaScript, Java..."
            value={form.primary_language}
            onChange={(e) => update('primary_language', e.target.value)}
          />
        </div>

        {/* AI tool frequency */}
        <div style={fieldStyle}>
          <label style={labelStyle}>How often do you use AI coding tools?</label>
          <select
            style={selectStyle}
            value={form.ai_tool_frequency}
            onChange={(e) => update('ai_tool_frequency', e.target.value)}
          >
            <option value="">Select...</option>
            <option value="never">Never</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
        </div>

        {/* AI tool name */}
        <div style={fieldStyle}>
          <label style={labelStyle}>
            Preferred AI coding tool{' '}
            <span style={{ fontWeight: '400', color: '#64748b' }}>(optional)</span>
          </label>
          <input
            type="text"
            style={inputStyle}
            placeholder="e.g. GitHub Copilot, ChatGPT, Cursor..."
            value={form.ai_tool_name}
            onChange={(e) => update('ai_tool_name', e.target.value)}
          />
        </div>

        {/* Current role */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Current role</label>
          <select
            style={selectStyle}
            value={form.current_role}
            onChange={(e) => update('current_role', e.target.value)}
          >
            <option value="">Select...</option>
            <option value="student">Student</option>
            <option value="professional_developer">Professional developer</option>
            <option value="both">Both (student and professional)</option>
            <option value="other">Other</option>
          </select>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#b91c1c',
              fontSize: '14px',
            }}
          >
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
            transition: 'background-color 0.15s',
          }}
        >
          {isLoading ? 'Saving...' : 'Continue to Tutorial'}
        </button>
      </div>
    </div>
  );
}
