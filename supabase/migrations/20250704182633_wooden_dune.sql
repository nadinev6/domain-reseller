/*
  # Create user_cards table for saving card designs

  1. New Tables
    - `user_cards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, card name/title)
      - `card_data` (jsonb, stores elements and canvas settings)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_cards` table
    - Add policies for authenticated users to manage their own cards
*/

CREATE TABLE IF NOT EXISTS user_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  card_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own cards
CREATE POLICY "Users can read own cards"
  ON user_cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own cards
CREATE POLICY "Users can insert own cards"
  ON user_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own cards
CREATE POLICY "Users can update own cards"
  ON user_cards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own cards
CREATE POLICY "Users can delete own cards"
  ON user_cards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS user_cards_user_id_idx ON user_cards(user_id);
CREATE INDEX IF NOT EXISTS user_cards_created_at_idx ON user_cards(created_at DESC);