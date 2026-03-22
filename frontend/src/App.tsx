import React from 'react';
import { ExperimentContextProvider, useExperiment } from './contexts/ExperimentContext';
import LandingPage from './pages/LandingPage';
import ConsentPage from './pages/ConsentPage';
import DemographicsPage from './pages/DemographicsPage';
import TrainingPage from './pages/TrainingPage';
import TaskPage from './pages/TaskPage';
import PostExperimentSurvey from './pages/PostExperimentSurvey';
import DebriefPage from './pages/DebriefPage';

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  color: '#1e293b',
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
};

function AppContent() {
  const { currentStep } = useExperiment();

  return (
    <div style={containerStyle}>
      {currentStep === 'landing' && <LandingPage />}
      {currentStep === 'consent' && <ConsentPage />}
      {currentStep === 'demographics' && <DemographicsPage />}
      {currentStep === 'training' && <TrainingPage />}
      {currentStep === 'task' && <TaskPage />}
      {currentStep === 'post_experiment_survey' && <PostExperimentSurvey />}
      {currentStep === 'debrief' && <DebriefPage />}
    </div>
  );
}

export default function App() {
  return (
    <ExperimentContextProvider>
      <AppContent />
    </ExperimentContextProvider>
  );
}
