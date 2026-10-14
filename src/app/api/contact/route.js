import { sendEmail } from "@/lib/sendEmail";
//
 // Handle POST requests to send contact form messages via email
 // @param {Request} req - Incoming request object
 // @returns {Response} - JSON response indicating success or failure
//

export async function POST(req) {
  try {
    // Parse the JSON body of the request
    const { name, email, message } = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      // Return 400 Bad Request if any field is missing
      return new Response(
        JSON.stringify({ success: false, message: 'Missing fields' }),
        { status: 400 }
      );
    }

    // Construct the HTML content for the email
    const html = `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `;

    // Attempt to send the email using the sendEmail utility
    const success = await sendEmail({
      to: 'codefastsmart@gmail.com',
      subject: `Contact Form Message from ${name}`,
      html
    });

    // Return success response if email was sent successfully
    if (success) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      // Return 500 Internal Server Error if email sending failed
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to send email' }),
        { status: 500 }
      );
    }

  } catch (err) {
    // Log unexpected errors and return a generic server error response
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, message: 'Server error' }),
      { status: 500 }
    );
  }
}