/*
  # Fix user creation and authentication policies

  1. Security Updates
    - Update RLS policies for users table to allow proper user creation
    - Add policy for service role to handle auth triggers
    - Ensure authenticated users can create their own profiles

  2. Database Functions
    - Create or update trigger function for handling new user creation
    - Ensure proper user profile creation on auth signup

  3. Triggers
    - Update trigger to handle new user creation from auth.users
*/

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create or replace the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, username, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    CASE 
      WHEN new.email = 'admin@islamic.com' THEN 'admin'::text
      ELSE 'user'::text
    END
  );
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- User already exists, just return
    RETURN new;
  WHEN OTHERS THEN
    -- Log error but don't fail the auth process
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update RLS policies for users table
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- Allow service role to insert users (for triggers)
CREATE POLICY "Service role can insert users"
  ON public.users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow public to insert users (for signup process)
CREATE POLICY "Allow user creation during signup"
  ON public.users
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Ensure the function has proper permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;