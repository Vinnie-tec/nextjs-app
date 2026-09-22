import CourseList from "./CourseList";

export const metadata = {
  title: "Vinnie Courses",
  description: "Explore Our Course",
};

async function getCourses() {
  const response = await fetch("https://codepion.com/api/courses", {
    // cache: 'force-cache', //SSG (STATIC SITE GENERATION)
    next: { revalidate: 60 }, // Regenerates every 60seconds => ISR(Incremental Site Regeneration)
    // cache: 'no-store', //Server render on every request... SSR (SERVER-SIDE RENDERING)- default in nextjs 16
  });

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  return response.json();
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <section className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Available Courses</h1>

      {/* passing data to a client component */}
      <CourseList courses={courses} />
    </section>
  );
}
