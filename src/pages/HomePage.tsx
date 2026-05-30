import { useExam } from '../context/ExamContext';
import { Shield, Clock, BookOpen, Award, ChevronRight, ChartBar as BarChart2 } from 'lucide-react';
import { useState } from 'react';

const QUESTION_OPTIONS = [
  { count: 20, label: 'Quick Practice', desc: '~22 minutes', icon: '⚡' },
  { count: 50, label: 'Half Exam', desc: '~45 minutes', icon: '📘' },
  { count: 90, label: 'Full Exam', desc: '90 minutes', icon: '🎯' },
];

export default function HomePage() {
  const { startExam, status } = useExam();
  const [selected, setSelected] = useState<number | null>(null);

  const handleStart = async () => {
    if (selected === null) return;
    await startExam(selected);
  };

  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-badge">
          <Shield size={16} />
          <span>CompTIA Security+ SY0-701</span>
        </div>
        <h1 className="hero-title">
          Master Your<br />
          <span className="gradient-text">Security+ Certification</span>
        </h1>
        <p className="hero-subtitle">
          Practice with real exam-style questions across all six domains.
          Timed, scored, and reviewed — just like the actual exam.
        </p>

        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-number">90+</span>
            <span className="stat-label">Questions</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">6</span>
            <span className="stat-label">Domains</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">750</span>
            <span className="stat-label">Pass Score</span>
          </div>
        </div>
      </div>

      <div className="mode-selector">
        <h2 className="section-title">Choose Your Practice Mode</h2>
        <div className="mode-cards">
          {QUESTION_OPTIONS.map(opt => (
            <button
              key={opt.count}
              className={`mode-card ${selected === opt.count ? 'selected' : ''}`}
              onClick={() => setSelected(opt.count)}
            >
              <span className="mode-icon">{opt.icon}</span>
              <span className="mode-label">{opt.label}</span>
              <span className="mode-count">{opt.count} Questions</span>
              <span className="mode-desc">
                <Clock size={12} />
                {opt.desc}
              </span>
              {selected === opt.count && (
                <span className="mode-check">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="start-section">
        <button
          className="start-btn"
          onClick={handleStart}
          disabled={selected === null || status === 'loading'}
        >
          {status === 'loading' ? (
            <span className="btn-loading">
              <span className="spinner" />
              Preparing Exam...
            </span>
          ) : (
            <>
              Start Exam
              <ChevronRight size={20} />
            </>
          )}
        </button>
        {selected === null && (
          <p className="start-hint">Select a practice mode to begin</p>
        )}
      </div>

      <div className="domains-section">
        <h2 className="section-title">Exam Domains Covered</h2>
        <div className="domains-grid">
          {[
            { name: 'General Security Concepts', weight: '12%', icon: <Shield size={18} /> },
            { name: 'Threats, Vulnerabilities & Mitigations', weight: '22%', icon: <BarChart2 size={18} /> },
            { name: 'Security Architecture', weight: '18%', icon: <BookOpen size={18} /> },
            { name: 'Security Operations', weight: '28%', icon: <Clock size={18} /> },
            { name: 'Security Program Management', weight: '20%', icon: <Award size={18} /> },
          ].map(domain => (
            <div key={domain.name} className="domain-card">
              <span className="domain-icon">{domain.icon}</span>
              <span className="domain-name">{domain.name}</span>
              <span className="domain-weight">{domain.weight}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="info-cards">
        <div className="info-card">
          <Award size={24} />
          <h3>Passing Score</h3>
          <p>750 out of 900 scaled score required to pass the actual exam</p>
        </div>
        <div className="info-card">
          <Clock size={24} />
          <h3>Time Limit</h3>
          <p>90 minutes for the full exam — matching real exam conditions</p>
        </div>
        <div className="info-card">
          <BookOpen size={24} />
          <h3>Detailed Review</h3>
          <p>After each exam, review every answer with full explanations</p>
        </div>
      </div>
    </div>
  );
}
