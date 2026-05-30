import { useExam } from '../context/ExamContext';
import { Clock, TriangleAlert as AlertTriangle } from 'lucide-react';

export default function ExamTimer() {
  const { timeLeft } = useExam();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft <= 600; // 10 minutes
  const isCritical = timeLeft <= 180; // 3 minutes

  return (
    <div className={`exam-timer ${isWarning ? 'warning' : ''} ${isCritical ? 'critical' : ''}`}>
      {isCritical && <AlertTriangle size={16} className="timer-alert-icon" />}
      {!isCritical && <Clock size={16} className="timer-icon" />}
      <span className="timer-value">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
      {isWarning && <span className="timer-label">Remaining</span>}
    </div>
  );
}
