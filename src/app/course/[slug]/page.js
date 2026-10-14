import db from "@/lib/dbSetup";
import { notFound } from "next/navigation";
import CourseCard from "@/components/CourseCard";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const course = db
    .prepare("SELECT * FROM courses WHERE course_slug = ?")
    .get(slug);

  if (!course) return {};

  return {
    title: `${course.title} | Course Details`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [course.big_image],
    },
  };
}

export default async function CourseDetails({ params }) {
  const { slug } = await params;

  // ✅ Fetch course by slug
  const course = db
    .prepare("SELECT * FROM courses WHERE course_slug = ?")
    .get(slug);
  
  if (!course) return notFound();

  const thingsToLearn = course.thingsToLearn
    ? course.thingsToLearn.split(",").map((item) => item.trim())
    : [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
      {/* Left side - CourseCard component */}
      <aside className="md:sticky md:top-6 self-start">
        <CourseCard
          course={course}
          showDescription={false}
          showViewDetailsButton={false}
        />
      </aside>

      {/* Right side - Course content */}
      <section className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">{course.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{course.description}</p>
        </div>

        {thingsToLearn.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-3">What you’ll learn</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              {thingsToLearn.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {course.courseCurriculum && (
          <div>
            <h2 className="text-2xl font-semibold mb-3">Course Curriculum</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {course.courseCurriculum}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}