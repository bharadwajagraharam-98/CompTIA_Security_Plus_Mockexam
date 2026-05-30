import { useExam } from '../context/ExamContext';
import { Flag, X } from 'lucide-react';

type Props = { onClose: () => void };

export default function QuestionGrid({ onClose }: Props) {
  const { questions, answers, flagged, currentIndex, goToQuestion } = useExam();

  const unanswered = questions.filter(q => !answers[q.id]).length;

  return (
    <div className="grid-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="grid-panel">
        <div className="grid-header">
          <h3>Question Navigator</h3>
          <button className="grid-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="grid-legend">
          <span className="legend-item">
            <span className="legend-dot answered" /> Answered
          </span>
          <span className="legend-item">
            <span className="legend-dot unanswered" /> Unanswered
          </span>
          <span className="legend-item">
            <span className="legend-dot flagged-dot" /> Flagged
          </span>
          <span className="legend-item">
            <span className="legend-dot current" /> Current
          </span>
        </div>

        <div className="grid-summary">
          <span>{questions.length - unanswered} answered</span>
          <span className="sep">•</span>
          <span>{unanswered} remaining</span>
          {flagged.size > 0 && (
            <>
              <span className="sep">•</span>
              <span><Flag size={12} /> {flagged.size} flagged</span>
            </>
          )}
        </div>

        <div className="question-grid">
          {questions.map((q, i) => {
            const isAnswered = Boolean(answers[q.id]);
            const isFlagged = flagged.has(q.id);
            const isCurrent = i === currentIndex;
            return (
              <button
                key={q.id}
                className={`grid-cell ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''} ${isFlagged ? 'flagged' : ''}`}
                onClick={() => { goToQuestion(i); onClose(); }}
                title={`Question ${i + 1}${isFlagged ? ' (Flagged)' : ''}${isAnswered ? ' (Answered)' : ''}`}
              >
                {isFlagged ? <Flag size={10} /> : i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
