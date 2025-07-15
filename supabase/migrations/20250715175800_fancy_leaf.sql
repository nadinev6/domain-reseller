/*
  # Create user_hashtags table for CopyForge Studio

  1. New Tables
    - `user_hashtags`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `hashtags` (text array for storing hashtag strings)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_hashtags` table
    - Add policies for authenticated users to manage their own hashtags
*/

CREATE TABLE IF NOT EXISTS user_hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hashtags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_hashtags ENABLE ROW LEVEL SECURITY;

-- Create policies for user hashtags
CREATE POLICY "Users can view their own hashtags"
  ON user_hashtags
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hashtags"
  ON user_hashtags
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hashtags"
  ON user_hashtags
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hashtags"
  ON user_hashtags
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS user_hashtags_user_id_idx ON user_hashtags(user_id);