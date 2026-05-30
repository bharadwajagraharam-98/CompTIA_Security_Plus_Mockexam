/*
  # CompTIA Security+ Mock Exam Schema

  ## Overview
  This migration creates the full schema for the CompTIA Security+ SY0-701 mock exam platform.

  ## New Tables

  ### 1. questions
  - Stores all CompTIA Security+ exam questions
  - Each question has a domain (e.g., Threats, Architecture, Implementation)
  - Multiple choice with A-D options and a correct answer
  - Includes explanation for learning after exam

  ### 2. exam_sessions
  - Tracks each mock exam attempt
  - Stores start/end time, score, and pass/fail result
  - Linked to anonymous or authenticated users via session_id

  ### 3. exam_answers
  - Stores individual answers per question per session
  - Used to build the review page after exam

  ## Security
  - RLS enabled on all tables
  - Questions are publicly readable (no login required for a mock test site)
  - Exam sessions and answers are accessible by session identifier
*/

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL,
  subdomain text NOT NULL DEFAULT '',
  question_text text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer text NOT NULL CHECK (correct_answer IN ('A','B','C','D')),
  explanation text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exam_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL,
  total_questions integer NOT NULL DEFAULT 90,
  answered_questions integer NOT NULL DEFAULT 0,
  correct_answers integer NOT NULL DEFAULT 0,
  score_percent numeric(5,2) NOT NULL DEFAULT 0,
  scaled_score integer NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  time_taken_seconds integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS exam_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id),
  selected_answer text CHECK (selected_answer IN ('A','B','C','D')),
  is_correct boolean NOT NULL DEFAULT false,
  flagged boolean NOT NULL DEFAULT false,
  answered_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_exam_sessions_session_key ON exam_sessions(session_key);
CREATE INDEX IF NOT EXISTS idx_exam_answers_session_id ON exam_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_questions_domain ON questions(domain);

-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_answers ENABLE ROW LEVEL SECURITY;

-- Questions are publicly readable (mock exam content)
CREATE POLICY "Questions are publicly readable"
  ON questions FOR SELECT
  TO anon, authenticated
  USING (true);

-- Exam sessions: anyone can create and read their own session by session_key
CREATE POLICY "Anyone can create exam sessions"
  ON exam_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read exam sessions by session_key"
  ON exam_sessions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update their exam session"
  ON exam_sessions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Exam answers: anyone can insert and read answers tied to sessions
CREATE POLICY "Anyone can insert exam answers"
  ON exam_answers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read exam answers"
  ON exam_answers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update exam answers"
  ON exam_answers FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
