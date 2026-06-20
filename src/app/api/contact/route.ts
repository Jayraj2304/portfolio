import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Simple server-side validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_RECIPIENT_EMAIL || "jayrajpatel.ce@gmail.com";
    const sender = process.env.CONTACT_SENDER_EMAIL || "website@jayrajpatel.site";

    if (!apiKey) {
      console.error("Server Configuration Error: RESEND_API_KEY is not set.");
      return NextResponse.json(
        { error: "Server email configuration is missing." },
        { status: 500 }
      );
    }

    // Forward request to Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: `Jayraj Portfolio <${sender}>`,
        to: recipient,
        reply_to: email,
        subject: `New Portfolio Message from ${name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #1a233a; font-size: 20px; font-weight: 700; margin-bottom: 24px; border-bottom: 1px solid #eaeaea; padding-bottom: 12px;">New Contact Form Submission</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #4a5568; width: 100px;">Name:</td>
                <td style="padding: 6px 0; color: #1a202c;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #4a5568;">Email:</td>
                <td style="padding: 6px 0; color: #1a202c;"><a href="mailto:${email}" style="color: #3182ce; text-decoration: none;">${email}</a></td>
              </tr>
            </table>

            <div style="font-weight: 600; color: #4a5568; margin-bottom: 8px;">Message:</div>
            <div style="padding: 16px; background-color: #f7fafc; border-left: 4px solid #1a233a; border-radius: 6px; color: #2d3748; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${message}</div>
            
            <hr style="margin-top: 32px; border: 0; border-top: 1px solid #eaeaea;" />
            <p style="font-size: 11px; color: #a0aec0; text-align: center; margin-top: 16px;">This email was sent from the contact form at <a href="https://jayrajpatel.site" style="color: #a0aec0; text-decoration: underline;">jayrajpatel.site</a>.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Resend API returned an error:", errorData);
      return NextResponse.json(
        { error: errorData.message || "Failed to send email through Resend." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Contact API Server Error:", error);
    return NextResponse.json(
      { error: error.message || "An internal server error occurred." },
      { status: 500 }
    );
  }
}
