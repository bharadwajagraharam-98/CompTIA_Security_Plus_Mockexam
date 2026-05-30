import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Question = {
  id: string;
  domain: string;
  subdomain: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

export type ExamSession = {
  id: string;
  session_key: string;
  total_questions: number;
  answered_questions: number;
  correct_answers: number;
  score_percent: number;
  scaled_score: number;
  passed: boolean;
  time_taken_seconds: number;
  completed: boolean;
  started_at: string;
  completed_at: string | null;
};

export type ExamAnswer = {
  id: string;
  session_id: string;
  question_id: string;
  selected_answer: 'A' | 'B' | 'C' | 'D' | null;
  is_correct: boolean;
  flagged: boolean;
};
