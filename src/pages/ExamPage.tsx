import { useExam } from '../context/ExamContext';
import { Flag, ChevronLeft, ChevronRight, Send, CircleAlert as AlertCircle, BookOpen } from 'lucide-react';
import { useState } from 'react';
import ExamTimer from '../components/ExamTimer';
import QuestionGrid from '../components/QuestionGrid';
import SubmitModal from '../components/SubmitModal';

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

export default function ExamPage() {
  const {
    questions, currentIndex, answers, flagged,
    answerQuestion, toggleFlag, goToQuestion, submitExam,
  } = useExam();
  const [showGrid, setShowGrid] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);

  const question = questions[currentIndex];
  if (!question) return null;

  const options: [typeof OPTION_LABELS[number], string][] = [
    ['A', question.option_a],
    ['B', question.option_b],
    ['C', question.option_c],
    ['D', question.option_d],
  ];

  const selectedAnswer = answers[question.id];
  const isFlagged = flagged.has(question.id);
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const flaggedCount = flagged.size;

  const handlePrev = () => {
    if (currentIndex > 0) goToQuestion(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) goToQuestion(currentIndex + 1);
  };

  return (
    <div className="exam-page">
      <div className="exam-header">
        <div className="exam-header-left">
          <span className="exam-logo">
            <BookOpen size={18} />
            Security+ Mock Exam
          </span>
          <div className="exam-meta">
            <span className="meta-badge answered">
              {answeredCount}/{questions.length} Answered
            </span>
            {flaggedCount > 0 && (
              <span className="meta-badge flagged">
                <Flag size={12} /> {flaggedCount} Flagged
              </span>
            )}
          </div>
        </div>
        <ExamTimer />
        <div className="exam-header-right">
          <button className="nav-grid-btn" onClick={() => setShowGrid(v => !v)}>
            <span className="grid-icon">⊞</span>
            Navigator
          </button>
          <button className="submit-btn-header" onClick={() => setShowSubmit(true)}>
            <Send size={15} />
            Submit
          </button>
        </div>
      </div>

      <div className="exam-body">
        <div className="question-panel">
          <div className="question-header">
            <div className="question-number-badge">
              Question {currentIndex + 1} of {questions.length}
            </div>
            <div className="question-tags">
              <span className="domain-tag">{question.domain}</span>
              <span className={`difficulty-tag diff-${question.difficulty}`}>
                {question.difficulty}
              </span>
            </div>
          </div>

          <div className="question-progress-bar">
            <div
              className="question-progress-fill"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="question-text">{question.question_text}</div>

          <div className="options-list">
            {options.map(([label, text]) => (
              <button
                key={label}
                className={`option-btn ${selectedAnswer === label ? 'selected' : ''}`}
                onClick={() => answerQuestion(question.id, label)}
              >
                <span className={`option-letter ${selectedAnswer === label ? 'selected' : ''}`}>
                  {label}
                </span>
                <span className="option-text">{text}</span>
              </button>
            ))}
          </div>

          <div className="question-actions">
            <button
              className={`flag-btn ${isFlagged ? 'flagged' : ''}`}
              onClick={() => toggleFlag(question.id)}
            >
              <Flag size={15} />
              {isFlagged ? 'Flagged for Review' : 'Flag for Review'}
            </button>

            {!selectedAnswer && (
              <span className="unanswered-hint">
                <AlertCircle size={14} />
                Not yet answered
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="exam-footer">
        <button
          className="nav-btn prev"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        <div className="footer-center">
          {Array.from({ length: Math.min(5, questions.length) }, (_, i) => {
            const start = Math.max(0, Math.min(currentIndex - 2, questions.length - 5));
            const idx = start + i;
            const q = questions[idx];
            if (!q) return null;
            return (
              <button
                key={idx}
                className={`page-dot ${idx === currentIndex ? 'active' : ''} ${answers[q.id] ? 'done' : ''} ${flagged.has(q.id) ? 'flagged' : ''}`}
                onClick={() => goToQuestion(idx)}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <button
          className="nav-btn next"
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>

      {showGrid && (
        <QuestionGrid onClose={() => setShowGrid(false)} />
      )}
      {showSubmit && (
        <SubmitModal
          onConfirm={async () => { setShowSubmit(false); await submitExam(); }}
          onCancel={() => setShowSubmit(false)}
        />
      )}
    </div>
  );
}
