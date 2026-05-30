import { useExam } from '../context/ExamContext';
import { TriangleAlert as AlertTriangle, Send, X } from 'lucide-react';

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

export default function SubmitModal({ onConfirm, onCancel }: Props) {
  const { questions, answers, flagged } = useExam();

  const answered = Object.values(answers).filter(Boolean).length;
  const unanswered = questions.length - answered;
  const flaggedCount = flagged.size;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onCancel}>
          <X size={18} />
        </button>
        <div className="modal-icon">
          <Send size={28} />
        </div>
        <h2 className="modal-title">Submit Exam?</h2>
        <p className="modal-body">
          Are you sure you want to submit your exam? This cannot be undone.
        </p>

        <div className="modal-stats">
          <div className="modal-stat">
            <span className="mstat-val">{answered}</span>
            <span className="mstat-lbl">Answered</span>
          </div>
          <div className="modal-stat">
            <span className={`mstat-val ${unanswered > 0 ? 'warn' : ''}`}>{unanswered}</span>
            <span className="mstat-lbl">Unanswered</span>
          </div>
          {flaggedCount > 0 && (
            <div className="modal-stat">
              <span className="mstat-val flagged">{flaggedCount}</span>
              <span className="mstat-lbl">Flagged</span>
            </div>
          )}
        </div>

        {unanswered > 0 && (
          <div className="modal-warning">
            <AlertTriangle size={16} />
            You have {unanswered} unanswered question{unanswered !== 1 ? 's' : ''}.
            Unanswered questions will be marked as incorrect.
          </div>
        )}

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>
            Continue Exam
          </button>
          <button className="modal-confirm" onClick={onConfirm}>
            <Send size={16} />
            Submit Now
          </button>
        </div>
      </div>
    </div>
  );
}
