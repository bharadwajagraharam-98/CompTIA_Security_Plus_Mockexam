import { Component, type ReactNode } from 'react';
import { ExamProvider, useExam } from './context/ExamContext';
import HomePage from './pages/HomePage';
import ExamPage from './pages/ExamPage';
import ResultsPage from './pages/ResultsPage';
import './App.css';

type ErrorState = { hasError: boolean; message: string };

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorState> {
  state: ErrorState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorState {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui' }}>
          <h2 style={{ color: '#dc2626' }}>Something went wrong</h2>
          <p style={{ color: '#64748b', marginTop: 8 }}>{this.state.message}</p>
          <button
            style={{ marginTop: 16, padding: '8px 20px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { status } = useExam();

  if (status === 'active') return <ExamPage />;
  if (status === 'completed') return <ResultsPage />;
  return <HomePage />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ExamProvider>
        <AppContent />
      </ExamProvider>
    </ErrorBoundary>
  );
}
