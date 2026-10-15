import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

// Import your SQLite database connection.
// Change this path to match your project's actual db setup file.
import db from "@/lib/dbSetup";

// Central configuration for NextAuth.
export const authOptions = {
  // Configure the authentication methods supported by the app.
  providers: [
    CredentialsProvider({
      name: "Credentials",

      // Define the fields expected from the login form.
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      // Verify the submitted credentials against the database.
      async authorize(credentials) {
        // Make sure the user provided both email and password.
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find the user by email using a parameterised SQL query.
        const user = db
          .prepare("SELECT * FROM users WHERE email = ?")
          .get(credentials.email);

        // Reject the login if the user does not exist or the
        // submitted password does not match the stored hash.
        if (
          !user ||
          !(await bcrypt.compare(credentials.password, user.password))
        ) {
          return null;
        }

        // Return only the information needed for authentication.
        // Do not return the password or other sensitive fields.
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  // Store session information in an encrypted JWT cookie.
  session: {
    strategy: "jwt",
  },

  // Custom authentication page.
  pages: {
    signIn: "/login",
  },

  callbacks: {
    // Add database-specific information to the JWT.
    async jwt({ token, user }) {
      // Add database information when the user first signs in.
      if (user?.email) {
        const dbUser = db
          .prepare("SELECT id, is_admin FROM users WHERE email = ?")
          .get(user.email);

        if (dbUser) {
          token.id = String(dbUser.id);
          token.isAdmin = dbUser.is_admin;
        } else {
          token.isAdmin = 0;
        }
      } else if (token.email) {
        // Refresh the admin status during subsequent JWT callbacks.
        const dbUser = db
          .prepare("SELECT is_admin FROM users WHERE email = ?")
          .get(token.email);

        if (dbUser) {
          token.isAdmin = dbUser.is_admin;
        }
      }

      // Return the updated token.
      return token;
    },

    // Make selected token data available to the client session.

    async session({ session, token }) {
      // Expose the database user ID to the application.
      if (session.user && token.id) {
        session.user.id = token.id;
      }

      return session;
    },

    // Redirect users to the chat page after authentication.
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/chat`;
    },
  },

  // Use the secret generated for your application.
  secret: process.env.AUTH_SECRET,
};

// Initialize NextAuth with the configuration above.
const handler = NextAuth(authOptions);

// Support both GET and POST requests in the App Router.
export { handler as GET, handler as POST };
