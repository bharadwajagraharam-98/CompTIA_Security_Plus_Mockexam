import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Question, ExamSession, ExamAnswer } from '../lib/supabase';

export type ExamStatus = 'idle' | 'loading' | 'active' | 'paused' | 'completed';

type ExamContextValue = {
  status: ExamStatus;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, 'A' | 'B' | 'C' | 'D' | null>;
  flagged: Set<string>;
  timeLeft: number;
  session: ExamSession | null;
  examAnswers: ExamAnswer[];
  startExam: (questionCount: number) => Promise<void>;
  answerQuestion: (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => void;
  toggleFlag: (questionId: string) => void;
  goToQuestion: (index: number) => void;
  submitExam: () => Promise<void>;
  resetExam: () => void;
};

const ExamContext = createContext<ExamContextValue | null>(null);

const SESSION_KEY_STORAGE = 'comptia_session_key';
const EXAM_STATE_STORAGE = 'comptia_exam_state';
const EXAM_DURATION = 90 * 60; // 90 minutes in seconds

export function ExamProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ExamStatus>('idle');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | null>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [examAnswers, setExamAnswers] = useState<ExamAnswer[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submitRef = useRef<(() => Promise<void>) | undefined>(undefined);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback((initialTime: number) => {
    stopTimer();
    setTimeLeft(initialTime);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          submitRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  const startExam = useCallback(async (questionCount: number) => {
    setStatus('loading');
    try {
      const { data: allQuestions, error } = await supabase
        .from('questions')
        .select('*');

      if (error) throw error;

      const shuffled = [...(allQuestions || [])].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

      const sessionKey = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      const { data: sessionData, error: sessionError } = await supabase
        .from('exam_sessions')
        .insert({
          session_key: sessionKey,
          total_questions: selected.length,
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      const initialAnswers: Record<string, null> = {};
      selected.forEach(q => { initialAnswers[q.id] = null; });

      localStorage.setItem(SESSION_KEY_STORAGE, sessionKey);
      localStorage.setItem(EXAM_STATE_STORAGE, JSON.stringify({
        sessionId: sessionData.id,
        timeLeft: EXAM_DURATION,
        answers: initialAnswers,
        flagged: [],
        currentIndex: 0,
        questionIds: selected.map(q => q.id),
      }));

      setQuestions(selected);
      setAnswers(initialAnswers);
      setFlagged(new Set());
      setCurrentIndex(0);
      setSession(sessionData);
      setStatus('active');
      startTimer(EXAM_DURATION);
    } catch (err) {
      console.error('Failed to start exam:', err);
      setStatus('idle');
    }
  }, [startTimer]);

  const answerQuestion = useCallback((questionId: string, answer: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => {
      const updated = { ...prev, [questionId]: answer };
      const saved = JSON.parse(localStorage.getItem(EXAM_STATE_STORAGE) || '{}');
      localStorage.setItem(EXAM_STATE_STORAGE, JSON.stringify({ ...saved, answers: updated }));
      return updated;
    });
  }, []);

  const toggleFlag = useCallback((questionId: string) => {
    setFlagged(prev => {
      const updated = new Set(prev);
      if (updated.has(questionId)) {
        updated.delete(questionId);
      } else {
        updated.add(questionId);
      }
      const saved = JSON.parse(localStorage.getItem(EXAM_STATE_STORAGE) || '{}');
      localStorage.setItem(EXAM_STATE_STORAGE, JSON.stringify({ ...saved, flagged: Array.from(updated) }));
      return updated;
    });
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setCurrentIndex(index);
    const saved = JSON.parse(localStorage.getItem(EXAM_STATE_STORAGE) || '{}');
    localStorage.setItem(EXAM_STATE_STORAGE, JSON.stringify({ ...saved, currentIndex: index }));
  }, []);

  const submitExam = useCallback(async () => {
    if (!session || status === 'completed') return;
    stopTimer();
    setStatus('loading');

    const timeTaken = EXAM_DURATION - timeLeft;
    let correctCount = 0;

    const answersToInsert = questions.map(q => {
      const selected = answers[q.id] ?? null;
      const isCorrect = selected === q.correct_answer;
      if (isCorrect) correctCount++;
      return {
        session_id: session.id,
        question_id: q.id,
        selected_answer: selected,
        is_correct: isCorrect,
        flagged: flagged.has(q.id),
      };
    });

    const scorePercent = (correctCount / questions.length) * 100;
    const scaledScore = Math.round(100 + (scorePercent / 100) * 800);
    const passed = scaledScore >= 750;

    await supabase.from('exam_answers').insert(answersToInsert);

    const { data: updatedSession } = await supabase
      .from('exam_sessions')
      .update({
        answered_questions: Object.values(answers).filter(Boolean).length,
        correct_answers: correctCount,
        score_percent: scorePercent,
        scaled_score: scaledScore,
        passed,
        time_taken_seconds: timeTaken,
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', session.id)
      .select()
      .single();

    const { data: fetchedAnswers } = await supabase
      .from('exam_answers')
      .select('*')
      .eq('session_id', session.id);

    setExamAnswers(fetchedAnswers || []);
    if (updatedSession) setSession(updatedSession);
    localStorage.removeItem(EXAM_STATE_STORAGE);
    localStorage.removeItem(SESSION_KEY_STORAGE);
    setStatus('completed');
  }, [session, status, stopTimer, timeLeft, questions, answers, flagged]);

  submitRef.current = submitExam;

  const resetExam = useCallback(() => {
    stopTimer();
    setStatus('idle');
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged(new Set());
    setTimeLeft(EXAM_DURATION);
    setSession(null);
    setExamAnswers([]);
    localStorage.removeItem(EXAM_STATE_STORAGE);
    localStorage.removeItem(SESSION_KEY_STORAGE);
  }, [stopTimer]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  useEffect(() => {
    if (status === 'active') {
      const saved = JSON.parse(localStorage.getItem(EXAM_STATE_STORAGE) || '{}');
      if (saved.timeLeft) {
        const saved2 = { ...saved, timeLeft };
        localStorage.setItem(EXAM_STATE_STORAGE, JSON.stringify(saved2));
      }
    }
  }, [timeLeft, status]);

  return (
    <ExamContext.Provider value={{
      status, questions, currentIndex, answers, flagged, timeLeft,
      session, examAnswers, startExam, answerQuestion, toggleFlag,
      goToQuestion, submitExam, resetExam,
    }}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const ctx = useContext(ExamContext);
  if (!ctx) throw new Error('useExam must be used within ExamProvider');
  return ctx;
}
