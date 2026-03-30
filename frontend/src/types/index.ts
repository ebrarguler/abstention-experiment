export interface Participant {
  id: string;
  condition: 'always_answers' | 'abstention';
  status: string;
}

export interface TaskAssignment {
  task_id: string;
  task_order: number;
  slug: string;
  title: string;
  description: string;
  function_signature: string;
  starter_code: string;
  visible_tests: VisibleTest[];
  ai_response_type: 'correct' | 'incorrect' | 'abstention';
  ai_code_shown: string | null;
  hints: string[];
}

export interface VisibleTest {
  name: string;
  function_name: string;
  input_args: unknown[];
  expected_output: unknown;
}

export interface TestResult {
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  error: string | null;
}

export interface Demographics {
  age_range: string;
  gender: string;
  education: string;
  years_experience: number;
  python_proficiency: number;
  primary_language: string;
  ai_tool_frequency: string;
  ai_tool_name: string;
  current_role: string;
}

export type ExperimentStep =
  | 'landing'
  | 'consent'
  | 'demographics'
  | 'training'
  | 'task'
  | 'post_experiment_survey'
  | 'debrief';
