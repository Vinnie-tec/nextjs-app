INSERT OR IGNORE INTO courses (
  title,
  subTitle,
  description,
  course_slug,
  original_price,
  courseRating,
  numberOfStudents,
  duration,
  language,
  big_image,
  is_paid,
  isBestseller,
  thingsToLearn,
  courseCurriculum
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)