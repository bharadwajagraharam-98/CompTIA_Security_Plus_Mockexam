import { useExam } from '../context/ExamContext';
import { CircleCheck as CheckCircle, Circle as XCircle, ChevronLeft, ChevronRight, Flag, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

type Props = { onBack: () => void };

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

export default function ReviewPage({ onBack }: Props) {
  const { questions, examAnswers, flagged } = useExam();
  const [index, setIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'flagged'>('all');

  const filtered = questions.filter(q => {
    const ans = examAnswers.find(a => a.question_id === q.id);
    if (filter === 'incorrect') return ans && !ans.is_correct;
    if (filter === 'flagged') return flagged.has(q.id);
    return true;
  });

  const question = filtered[index];
  const answer = question ? examAnswers.find(a => a.question_id === question.id) : null;

  const options: [typeof OPTION_LABELS[number], string][] = question ? [
    ['A', question.option_a],
    ['B', question.option_b],
    ['C', question.option_c],
    ['D', question.option_d],
  ] : [];

  const incorrectCount = questions.filter(q => {
    const a = examAnswers.find(ea => ea.question_id === q.id);
    return a && !a.is_correct;
  }).length;

  const flaggedCount = flagged.size;

  return (
    <div className="review-page">
      <div className="review-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Results
        </button>
        <h1>Answer Review</h1>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => { setFilter('all'); setIndex(0); }}
          >
            All ({questions.length})
          </button>
          <button
            className={`filter-tab ${filter === 'incorrect' ? 'active' : ''}`}
            onClick={() => { setFilter('incorrect'); setIndex(0); }}
          >
            Incorrect ({incorrectCount})
          </button>
          <button
            className={`filter-tab ${filter === 'flagged' ? 'active' : ''}`}
            onClick={() => { setFilter('flagged'); setIndex(0); }}
          >
            <Flag size={13} /> Flagged ({flaggedCount})
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="review-empty">
          <CheckCircle size={48} className="empty-icon" />
          <p>No questions match this filter.</p>
        </div>
      ) : (
        <>
          <div className="review-body">
            <div className="review-question-header">
              <div className="question-number-badge">
                Question {index + 1} of {filtered.length}
              </div>
              <div className="review-tags">
                <span className="domain-tag">{question?.domain}</span>
                <span className={`difficulty-tag diff-${question?.difficulty}`}>
                  {question?.difficulty}
                </span>
                {answer?.is_correct ? (
                  <span className="result-tag correct">
                    <CheckCircle size={13} /> Correct
                  </span>
                ) : (
                  <span className="result-tag incorrect">
                    <XCircle size={13} /> Incorrect
                  </span>
                )}
              </div>
            </div>

            <div className="question-text">{question?.question_text}</div>

            <div className="options-list review-options">
              {options.map(([label, text]) => {
                const isSelected = answer?.selected_answer === label;
                const isCorrect = question?.correct_answer === label;
                let cls = 'option-btn review-option';
                if (isCorrect) cls += ' correct-answer';
                else if (isSelected && !isCorrect) cls += ' wrong-answer';
                return (
                  <div key={label} className={cls}>
                    <span className={`option-letter ${isCorrect ? 'correct' : isSelected ? 'wrong' : ''}`}>
                      {label}
                    </span>
                    <span className="option-text">{text}</span>
                    {isCorrect && (
                      <span className="answer-indicator correct">
                        <CheckCircle size={16} /> Correct Answer
                      </span>
                    )}
                    {isSelected && !isCorrect && (
                      <span className="answer-indicator wrong">
                        <XCircle size={16} /> Your Answer
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {!answer?.selected_answer && (
              <div className="unanswered-notice">
                <XCircle size={16} />
                This question was not answered.
              </div>
            )}

            <div className="explanation-box">
              <h3>Explanation</h3>
              <p>{question?.explanation}</p>
            </div>
          </div>

          <div className="review-footer">
            <button
              className="nav-btn prev"
              onClick={() => setIndex(i => Math.max(0, i - 1))}
              disabled={index === 0}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div className="review-progress">
              <div className="review-progress-bar">
                <div
                  className="review-progress-fill"
                  style={{ width: `${((index + 1) / filtered.length) * 100}%` }}
                />
              </div>
              <span>{index + 1} / {filtered.length}</span>
            </div>

            <button
              className="nav-btn next"
              onClick={() => setIndex(i => Math.min(filtered.length - 1, i + 1))}
              disabled={index === filtered.length - 1}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
