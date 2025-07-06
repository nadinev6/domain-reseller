/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `subject` (text, required)
      - `message` (text, required)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for anonymous users to insert contact submissions
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy for anonymous users to insert contact submissions
CREATE POLICY "Allow anon insert for contact submissions"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS contact_submissions_email_idx ON contact_submissions(email);