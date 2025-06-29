/*
  # Fix User Creation RLS Policies

  1. Security Updates
    - Add INSERT policy for authenticated users to create their own profiles
    - Ensure users can insert their own data during signup process
    - Fix any missing RLS policies that prevent user creation

  2. Changes
    - Add policy for users to insert their own profile data
    - Ensure the policy allows profile creation during the signup flow
*/

-- Ensure RLS is enabled on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing INSERT policy if it exists to recreate it properly
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own profile" ON users;

-- Create a comprehensive INSERT policy that allows users to create their own profiles
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also ensure we have a policy for service role (used during signup process)
DROP POLICY IF EXISTS "Service role can insert users" ON users;
CREATE POLICY "Service role can insert users"
  ON users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Make sure the existing SELECT policies are comprehensive
DROP POLICY IF EXISTS "Public can read basic user info" ON users;
CREATE POLICY "Public can read basic user info"
  ON users
  FOR SELECT
  TO public
  USING (true);

-- Ensure authenticated users can read their own data
DROP POLICY IF EXISTS "Users can read own data" ON users;
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Ensure users can update their own data
DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);