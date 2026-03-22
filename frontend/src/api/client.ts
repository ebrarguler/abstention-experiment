import type { Demographics, TaskAssignment, TestResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}

export async function createParticipant(
  pythonProficiency: number
): Promise<{ id: string; condition: string; task_assignments: TaskAssignment[] }> {
  const response = await fetch(`${API_URL}/api/participants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ python_proficiency: pythonProficiency }),
  });
  return handleResponse(response);
}

export async function saveDemographics(
  participantId: string,
  data: Demographics
): Promise<void> {
  const response = await fetch(`${API_URL}/api/participants/${participantId}/demographics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function runTests(
  participantId: string,
  taskId: string,
  code: string,
  adoptionChoice: string
): Promise<{ test_results: TestResult[]; tests_passed: number; tests_total: number }> {
  const response = await fetch(`${API_URL}/api/participants/${participantId}/run-tests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      task_id: taskId,
      adoption_choice: adoptionChoice,
      participant_id: participantId,
    }),
  });
  return handleResponse(response);
}

export async function submitSolution(
  participantId: string,
  taskId: string,
  code: string,
  adoptionChoice: string,
  startedAt: string,
  timedOut: boolean
): Promise<{ test_results: TestResult[]; tests_passed: number; tests_total: number }> {
  const response = await fetch(`${API_URL}/api/participants/${participantId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      task_id: taskId,
      adoption_choice: adoptionChoice,
      started_at: startedAt,
      timed_out: timedOut,
    }),
  });
  return handleResponse(response);
}

export async function submitSurvey(
  participantId: string,
  surveyType: string,
  questionKey: string,
  responseValue: string,
  taskId?: string
): Promise<void> {
  const response = await fetch(`${API_URL}/api/participants/${participantId}/surveys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      survey_type: surveyType,
      question_key: questionKey,
      response_value: responseValue,
      task_id: taskId,
    }),
  });
  return handleResponse(response);
}

export async function logEvent(
  participantId: string,
  eventType: string,
  metadata: Record<string, unknown>,
  taskId?: string
): Promise<void> {
  const response = await fetch(`${API_URL}/api/participants/${participantId}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_type: eventType,
      metadata,
      task_id: taskId,
    }),
  });
  return handleResponse(response);
}

export async function completeParticipant(participantId: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/participants/${participantId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(response);
}
