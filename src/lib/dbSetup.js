import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import { courses } from "@/data/courses";
import { users } from "@/data/users";
import { shuffledMessages as messages } from "@/data/messages";

// Define database path
const dbPath = path.join(process.cwd(), "src/data/app.db");

// Initialize the database
const db = new Database(dbPath);

const loadSQL = (relativePath) =>
  fs.readFileSync(path.join(process.cwd(), "src/data/db", relativePath), "utf8");

// -------------------------------------------------------------
// ⚙️ Load and execute schema files
// -------------------------------------------------------------
const dropTablesSQL = loadSQL("schema/dropTables.sql");
const createTablesSQL = loadSQL("schema/createTables.sql");

// db.exec(dropTablesSQL);
db.exec(createTablesSQL);

// -------------------------------------------------------------
// 🌱 Seed demo users (with hashed passwords)
// -------------------------------------------------------------
const userCount = db.prepare("SELECT COUNT(*) AS count FROM users").get().count;
if (userCount === 0) {
  const insertUserSQL = loadSQL("seed/insertUsers.sql");
  const insertUser = db.prepare(insertUserSQL);

  // Loop through each user object in the 'users' array
  for (const u of users) {
    // Hash the user's password using bcrypt with a salt round of 10
    const hashed = bcrypt.hashSync(u.password, 10);
    // Insert the user data into the database
    insertUser.run(u.name, u.email, hashed, u.email_verified, u.token, u.is_admin);
  }

  console.log("✅ Sample users inserted with email verification and admin role");
}

// -------------------------------------------------------------
// 🌱 Seed demo courses
// -------------------------------------------------------------
const courseCount = db.prepare("SELECT COUNT(*) AS count FROM courses").get().count;
if (courseCount === 0) {
  const insertCourseSQL = loadSQL("seed/insertCourses.sql");
  const insertCourse = db.prepare(insertCourseSQL);

  const insertMany = db.transaction((courses) => {
    for (const c of courses) {
      insertCourse.run(
        c.title,
        c.subTitle,
        c.description,
        c.course_slug,
        c.original_price,
        c.courseRating,
        c.numberOfStudents,
        c.duration,
        c.language,
        c.big_image,
        c.is_paid,
        c.isBestseller,
        c.thingsToLearn,
        c.courseCurriculum
      );
    }
  });

  insertMany(courses);

  console.log("✅ Sample courses inserted successfully");
}

// -------------------------------------------------------------
// 💬 Seed demo messages
// -------------------------------------------------------------
const messageCount = db.prepare("SELECT COUNT(*) AS count FROM messages").get().count;
if (messageCount === 0) {
  const insertMessageSQL = loadSQL("seed/insertMessages.sql");
  const insertMessage = db.prepare(insertMessageSQL);

  const insertManyMessages = db.transaction((messages) => {
    for (const m of messages) {
      insertMessage.run(m.user_id, m.course_id, m.text);
    }
  });

  insertManyMessages(messages);
  console.log(`✅ Inserted ${messages.length} sample messages successfully`);
}

export default db;