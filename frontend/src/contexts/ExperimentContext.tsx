import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ExperimentStep, TaskAssignment } from '../types';

interface ExperimentContextValue {
  participantId: string | null;
  condition: string | null;
  taskAssignments: TaskAssignment[];
  currentStep: ExperimentStep;
  currentTaskIndex: number;
  setParticipantId: (id: string) => void;
  setCondition: (condition: string) => void;
  setTaskAssignments: (assignments: TaskAssignment[]) => void;
  setCurrentStep: (step: ExperimentStep) => void;
  advanceTask: () => void;
}

const ExperimentContext = createContext<ExperimentContextValue | null>(null);

const STORAGE_KEY = 'abstention_experiment_state';

interface PersistedState {
  participantId: string | null;
  condition: string | null;
  currentStep: ExperimentStep;
  currentTaskIndex: number;
  taskAssignments: TaskAssignment[];
}

function loadState(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Partial<PersistedState>;
  } catch {
    // Ignore parse errors
  }
  return {};
}

function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

export function ExperimentContextProvider({ children }: { children: React.ReactNode }) {
  const persisted = loadState();

  const [participantId, setParticipantIdState] = useState<string | null>(
    persisted.participantId ?? null
  );
  const [condition, setConditionState] = useState<string | null>(
    persisted.condition ?? null
  );
  const [taskAssignments, setTaskAssignmentsState] = useState<TaskAssignment[]>(
    persisted.taskAssignments ?? []
  );
  const [currentStep, setCurrentStepState] = useState<ExperimentStep>(
    persisted.currentStep ?? 'landing'
  );
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(
    persisted.currentTaskIndex ?? 0
  );

  // Persist state whenever it changes
  useEffect(() => {
    saveState({
      participantId,
      condition,
      currentStep,
      currentTaskIndex,
      taskAssignments,
    });
  }, [participantId, condition, currentStep, currentTaskIndex, taskAssignments]);

  const setParticipantId = (id: string) => setParticipantIdState(id);
  const setCondition = (c: string) => setConditionState(c);
  const setTaskAssignments = (assignments: TaskAssignment[]) =>
    setTaskAssignmentsState(assignments);
  const setCurrentStep = (step: ExperimentStep) => setCurrentStepState(step);

  const advanceTask = () => {
    const nextIndex = currentTaskIndex + 1;
    if (nextIndex >= 6) {
      setCurrentStepState('post_experiment_survey');
    } else {
      setCurrentTaskIndex(nextIndex);
      setCurrentStepState('task');
    }
  };

  return (
    <ExperimentContext.Provider
      value={{
        participantId,
        condition,
        taskAssignments,
        currentStep,
        currentTaskIndex,
        setParticipantId,
        setCondition,
        setTaskAssignments,
        setCurrentStep,
        advanceTask,
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
}

export function useExperiment(): ExperimentContextValue {
  const ctx = useContext(ExperimentContext);
  if (!ctx) {
    throw new Error('useExperiment must be used within ExperimentContextProvider');
  }
  return ctx;
}
