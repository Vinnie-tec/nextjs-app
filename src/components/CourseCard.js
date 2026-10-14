'use client';

import { Star, Clock } from "lucide-react";
import Link from "next/link";

export default function CourseCard({
  course,
  showDescription = true,
  showViewDetailsButton = true,
}) {
  return (
    <div
      className={
        "border " +
        "rounded-xl " +
        "overflow-hidden " +
        "bg-white dark:bg-gray-900 " +
        "shadow-sm hover:shadow-md " +
        "transition"
      }
    >
      <div className="relative">
        <img
          src={course.big_image}
          alt={course.title}
          className="w-full rounded-lg"
          loading="lazy"
        />

        {/* Duration Badge */}
        {course.duration && (
          <div
            className={
              "absolute bottom-3 right-3 " +
              "flex items-center gap-1 " +
              "bg-black/70 text-white " +
              "text-xs px-2 py-1 " +
              "rounded-md"
            }
          >
            <Clock size={14} /> {course.duration}
          </div>
        )}

        {/* Bestseller Badge */}
        {course.isBestseller === 1 && (
          <div
            className={
              "absolute top-3 left-3 " +
              "bg-yellow-400 text-black " +
              "text-xs font-semibold " +
              "px-2 py-1 " +
              "rounded-md"
            }
          >
            Bestseller
          </div>
        )}

        {/* Price Badge */}
        <div
          className={
            "absolute bottom-3 left-3 " +
            "bg-purple-600 text-white " +
            "text-xs font-semibold " +
            "px-2 py-1 " +
            "rounded-md"
          }
        >
          {course.original_price}
        </div>
      </div>

      <div className="p-4">
        <h2
          className={
            "text-lg font-bold " +
            "text-gray-900 dark:text-gray-100 " +
            "mb-1"
          }
        >
          {course.title}
        </h2>

        {course.subTitle && (
          <p
            className={
              "text-sm " +
              "text-gray-500 dark:text-gray-400 " +
              "mb-2"
            }
          >
            {course.subTitle}
          </p>
        )}

        {/* Course rating and number of students */}
        <div
          className="flex items-center gap-2 mb-2"
        >
          <Star className="text-yellow-400" size={16} />
          <span
            className={
              "text-sm font-medium " +
              "text-gray-700 dark:text-gray-300"
            }
          >
            {course.courseRating}
          </span>
          <span className="text-xs text-gray-500">
            ({course.numberOfStudents} students)
          </span>
        </div>

        {showDescription && (
          <p
            className={
              "text-sm " +
              "text-gray-600 dark:text-gray-300 " +
              "line-clamp-3 " +
              "mb-3"
            }
          >
            {course.description}
          </p>
        )}

        {showViewDetailsButton && (
          <Link
            href={`/course/${course.course_slug}`}
            className={
              "bg-purple-600 text-white " +
              "px-3 py-1.5 " +
              "rounded-md text-sm " +
              "hover:bg-purple-700 " +
              "transition"
            }
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}
