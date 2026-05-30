import { useExam } from '../context/ExamContext';
import { CircleCheck as CheckCircle, Circle as XCircle, Award, Clock, ChartBar as BarChart2, RefreshCw, BookOpen, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import ReviewPage from './ReviewPage';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function ResultsPage() {
  const { session, questions, examAnswers, resetExam } = useExam();
  const [showReview, setShowReview] = useState(false);

  if (!session) return null;
  if (showReview) return <ReviewPage onBack={() => setShowReview(false)} />;

  const passed = session.passed;
  const score = session.scaled_score;
  const percent = Number(session.score_percent).toFixed(1);
  const timeTaken = session.time_taken_seconds;

  const domainStats: Record<string, { correct: number; total: number }> = {};
  questions.forEach(q => {
    if (!domainStats[q.domain]) domainStats[q.domain] = { correct: 0, total: 0 };
    domainStats[q.domain].total++;
    const ans = examAnswers.find(a => a.question_id === q.id);
    if (ans?.is_correct) domainStats[q.domain].correct++;
  });

  return (
    <div className="results-page">
      <div className="results-header">
        <div className={`result-status ${passed ? 'pass' : 'fail'}`}>
          {passed ? (
            <CheckCircle size={48} />
          ) : (
            <XCircle size={48} />
          )}
          <h1>{passed ? 'Congratulations!' : 'Keep Practicing'}</h1>
          <p>{passed ? 'You passed the mock exam!' : 'You did not reach the passing score this time.'}</p>
        </div>

        <div className="score-display">
          <div className={`score-circle ${passed ? 'pass' : 'fail'}`}>
            <span className="score-number">{score}</span>
            <span className="score-label">/ 900</span>
          </div>
          <div className="score-meta">
            <div className="score-threshold">
              <span className={passed ? 'pass-text' : 'fail-text'}>
                {passed ? '✓ PASSED' : '✗ FAILED'}
              </span>
              <span className="threshold-note">Passing score: 750</span>
            </div>
          </div>
        </div>
      </div>

      <div className="results-stats">
        <div className="stat-card">
          <CheckCircle size={22} className="stat-icon correct" />
          <span className="stat-val">{session.correct_answers}</span>
          <span className="stat-lbl">Correct</span>
        </div>
        <div className="stat-card">
          <XCircle size={22} className="stat-icon incorrect" />
          <span className="stat-val">{session.total_questions - session.correct_answers}</span>
          <span className="stat-lbl">Incorrect</span>
        </div>
        <div className="stat-card">
          <BarChart2 size={22} className="stat-icon percent" />
          <span className="stat-val">{percent}%</span>
          <span className="stat-lbl">Accuracy</span>
        </div>
        <div className="stat-card">
          <Clock size={22} className="stat-icon time" />
          <span className="stat-val">{formatTime(timeTaken)}</span>
          <span className="stat-lbl">Time Taken</span>
        </div>
      </div>

      <div className="domain-breakdown">
        <h2 className="section-title">
          <TrendingUp size={20} />
          Performance by Domain
        </h2>
        <div className="domain-bars">
          {Object.entries(domainStats).map(([domain, stats]) => {
            const pct = Math.round((stats.correct / stats.total) * 100);
            return (
              <div key={domain} className="domain-bar-item">
                <div className="domain-bar-header">
                  <span className="domain-bar-name">{domain}</span>
                  <span className="domain-bar-score">
                    {stats.correct}/{stats.total} ({pct}%)
                  </span>
                </div>
                <div className="domain-bar-track">
                  <div
                    className={`domain-bar-fill ${pct >= 70 ? 'good' : pct >= 50 ? 'average' : 'poor'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="score-breakdown">
        <h2 className="section-title">
          <Award size={20} />
          Score Breakdown
        </h2>
        <div className="breakdown-bar-wrap">
          <div className="breakdown-bar">
            <div
              className={`breakdown-fill ${passed ? 'pass' : 'fail'}`}
              style={{ width: `${(score / 900) * 100}%` }}
            />
            <div
              className="breakdown-threshold"
              style={{ left: `${(750 / 900) * 100}%` }}
            >
              <span className="threshold-label">750 Pass</span>
            </div>
          </div>
          <div className="breakdown-labels">
            <span>100</span>
            <span>900</span>
          </div>
        </div>
      </div>

      <div className="results-actions">
        <button className="review-btn" onClick={() => setShowReview(true)}>
          <BookOpen size={18} />
          Review All Answers
        </button>
        <button className="retake-btn" onClick={resetExam}>
          <RefreshCw size={18} />
          Take Another Exam
        </button>
      </div>
    </div>
  );
}
