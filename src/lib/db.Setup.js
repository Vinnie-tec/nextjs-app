import Database from "better-sqlite3";
import path from "path";

// Path to SQLITE file (auto-created if missing)
const dbPath = path.join(process.cwd(), "src/data/app.db");
const db = new Database(dbPath);

db.exec(
  `
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, 
    email TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    text TEXT NOT NULL, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    );
`,
);

// const count = db.prepare("SELECT COUNT(*) AS count FROM users").get().count;

// if (count === 0) {
//   const insert = db.prepare("INSERT INTO users (name, email) VALUES (?,?)");
//   insert.run("Tom", "tom@gmal.com");
//   insert.run("Tom2", "tom2@gmal.com");
//   insert.run("Tom3", "tom3@gmal.com");
//   console.log('Sample users inserted in db')
// }

export default db;
