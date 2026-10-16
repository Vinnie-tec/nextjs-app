CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email_verified INTEGER DEFAULT 0,           -- 0 = not verified, 1 = verified
  verification_token TEXT DEFAULT NULL,       -- token for email verification
  is_admin INTEGER DEFAULT 0,                 -- 0 = regular user, 1 = admin
  password_reset_token TEXT DEFAULT NULL,     -- token for password reset
  password_reset_expires DATETIME DEFAULT NULL -- expiration timestamp for reset link
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  course_id INTEGER NOT NULL,            -- ✅ link message to a course
  text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  edited_at DATETIME,                    -- ✅ timestamp for edits
  FOREIGN KEY (user_id) REFERENCES users(id)
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subTitle TEXT,
  description TEXT,
  course_slug TEXT UNIQUE,
  original_price TEXT,
  courseRating TEXT,
  numberOfStudents TEXT,
  duration TEXT,
  language TEXT,
  big_image TEXT,
  is_paid BOOLEAN DEFAULT 1,
  isBestseller BOOLEAN DEFAULT 0,
  thingsToLearn TEXT,
  courseCurriculum TEXT
);