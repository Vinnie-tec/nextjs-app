// src/data/messages.js

export const messages = [
  // User 1 - Course 1 (7)
  { user_id: 1, course_id: 1, text: "This React course really helped me understand hooks better." },
  { user_id: 1, course_id: 1, text: "Loved the way context API was explained!" },
  { user_id: 1, course_id: 1, text: "Finally learned how to optimize performance in React 19." },
  { user_id: 1, course_id: 1, text: "JSX concepts were super clear after this." },
  { user_id: 1, course_id: 1, text: "I wish there were more examples on state management." },
  { user_id: 1, course_id: 1, text: "Animations with React were fun to implement." },
  { user_id: 1, course_id: 1, text: "Hands-on projects made learning React much easier." },

  // User 2 - Course 1 (2)
  { user_id: 2, course_id: 1, text: "React 19 is so powerful! Loved the project section." },
  { user_id: 2, course_id: 1, text: "The instructor explained hooks in a simple way." },

  // User 3 - Course 1 (5)
  { user_id: 3, course_id: 1, text: "Started this course last week — amazing content!" },
  { user_id: 3, course_id: 1, text: "The UI examples are really practical." },
  { user_id: 3, course_id: 1, text: "Great for intermediate developers too." },
  { user_id: 3, course_id: 1, text: "I learned so much about component reusability." },
  { user_id: 3, course_id: 1, text: "Would recommend this course to all React devs." },

  // User 1 - Course 2 (3)
  { user_id: 1, course_id: 2, text: "This JavaScript course improved my coding habits." },
  { user_id: 1, course_id: 2, text: "Finally mastered async/await thanks to this." },
  { user_id: 1, course_id: 2, text: "Clear explanation of closures and prototypes." },

  // User 2 - Course 2 (5)
  { user_id: 2, course_id: 2, text: "JavaScript is way easier now, thanks!" },
  { user_id: 2, course_id: 2, text: "Loved the DOM manipulation examples." },
  { user_id: 2, course_id: 2, text: "So much better than other online JS tutorials." },
  { user_id: 2, course_id: 2, text: "Would love a bonus section on ES2023 features." },
  { user_id: 2, course_id: 2, text: "This course helped me land my first dev job!" },

  // User 3 - Course 2 (3)
  { user_id: 3, course_id: 2, text: "Loved the practical examples in the JS section." },
  { user_id: 3, course_id: 2, text: "Async functions finally make sense to me." },
  { user_id: 3, course_id: 2, text: "The quizzes are a great way to test knowledge." },

  // User 1 - Course 3 (5)
  { user_id: 1, course_id: 3, text: "Building REST APIs with Node.js was so fun." },
  { user_id: 1, course_id: 3, text: "This course helped me understand Express middleware." },
  { user_id: 1, course_id: 3, text: "Authentication setup was easy to follow." },
  { user_id: 1, course_id: 3, text: "Really enjoyed connecting Node with MongoDB." },
  { user_id: 1, course_id: 3, text: "Would love to see a chapter on WebSockets next." },

  // User 2 - Course 3 (5)
  { user_id: 2, course_id: 3, text: "Node.js backend tutorials were top-notch!" },
  { user_id: 2, course_id: 3, text: "JWT authentication was explained clearly." },
  { user_id: 2, course_id: 3, text: "I deployed my first API thanks to this course." },
  { user_id: 2, course_id: 3, text: "Clear instructions, great pacing." },
  { user_id: 2, course_id: 3, text: "I finally understand middleware chaining." },

  // User 3 - Course 3 (5)
  { user_id: 3, course_id: 3, text: "This Node course is a game-changer." },
  { user_id: 3, course_id: 3, text: "Really liked how async operations were explained." },
  { user_id: 3, course_id: 3, text: "Perfect mix of theory and practice." },
  { user_id: 3, course_id: 3, text: "MongoDB integration was smooth and easy." },
  { user_id: 3, course_id: 3, text: "I learned to deploy apps for the first time!" },
];

// Randomize order so it’s not grouped by user/course
export const shuffledMessages = messages
  .map((msg) => ({ ...msg, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ sort, ...msg }) => msg);
