import { ExamProvider, useExam } from './context/ExamContext';
import HomePage from './pages/HomePage';
import ExamPage from './pages/ExamPage';
import ResultsPage from './pages/ResultsPage';
import './App.css';

function AppContent() {
  const { status } = useExam();

  if (status === 'active') return <ExamPage />;
  if (status === 'completed') return <ResultsPage />;
  return <HomePage />;
}

export default function App() {
  return (
    <ExamProvider>
      <AppContent />
    </ExamProvider>
  );
}
