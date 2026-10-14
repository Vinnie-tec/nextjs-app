import { Resend } from "resend";

// Initialize the Resend client with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email using Resend
 * @param {string} to - recipient email
 * @param {string} subject - subject line
 * @param {string} html - HTML content
 */
export async function sendEmail({ to, subject, html }) {
  try {
    // Attempt to send the email via Resend
    const { data, error } = await resend.emails.send({
      from: "Agora <onboarding@resend.dev>", // Replace with your verified sender domain
      to,                                       // Recipient address
      subject,                                  // Email subject line
      html,                                     // Email body (HTML)
    });

    // If the Resend API returned an error, log and return false
    if (error) {
      console.error("Resend error:", error);
      return false;
    }

    // Email sent successfully
    return true;

  } catch (err) {
    // Catch and log any unexpected runtime errors (e.g., network issues)
    console.error("Email send failed:", err);
    return false;
  }
}