INSERT OR IGNORE INTO users 
(
  name, 
  email, 
  password, 
  email_verified, 
  verification_token, 
  is_admin
) VALUES (?, ?, ?, ?, ?, ?);