import { sendEmail } from "@/lib/sendEmail";

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing fields" }),
        { status: 400 },
      );
    }

    const html = `
    <h2>New Contact Message</h2>
    <p><strong>Name</strong>${name}</p>
    <p><strong>Email</strong>${email}</p>
    <p><strong>Message</strong>${message}</p>
    `;

    const success = await sendEmail({
      to: "olamivin65@gmail.com",
      subject: "Contact Form Message from ${name}",
      html,
    });

    if (success) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to send message" }),
        {
          status: 500,
        },
      );
    }
  } catch (error) {
    console.error("Error saving message", error);

    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      {
        status: 500,
      },
    );
  }
}
