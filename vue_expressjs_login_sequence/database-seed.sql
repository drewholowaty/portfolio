CREATE TABLE users (
  user_id uuid PRIMARY KEY DEFAULT gen_random_uuid (), 
  name TEXT,
  email TEXT UNIQUE,
  phone_number TEXT UNIQUE,
  preferred_zip_code TEXT,
  profile_image TEXT,
  created_at_timestamp TIMESTAMP
);

