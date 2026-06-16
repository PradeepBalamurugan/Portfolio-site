import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

// Strict input validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name is too short").max(100, "Name is too long").trim(),
  email: z.string().email("Invalid email address").max(150, "Email is too long").trim().toLowerCase(),
  message: z.string().min(10, "Message is too short").max(2000, "Message is too long").trim(),
});

export async function POST(req: Request) {
  try {
    // Initialize Resend inside the handler so it only runs at request time,
    // not during `next build` when environment variables may be unavailable.
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set in the environment.");
      return NextResponse.json(
        { success: false, message: "Email service is not configured." },
        { status: 500 }
      );
    }
    const resend = new Resend(apiKey);

    const rawBody = await req.json();

    // 1. Validate and sanitize input
    const validatedData = contactSchema.parse(rawBody);

    // 2. Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // Replace with your verified domain if available
      to: ["pradeepbalamurugan22@gmail.com"],
      subject: "New Contact Form Submission",
      text: `You have received a new message from your portfolio contact form.\n\nName: ${validatedData.name}\nEmail: ${validatedData.email}\n\nMessage:\n${validatedData.message}`,
      replyTo: validatedData.email,
    });

    // 3. Handle Resend API failures
    if (error) {
      console.error("Resend API Error:", error);
      // Return a generic error to avoid leaking email infrastructure details
      return NextResponse.json(
        { success: false, message: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    // 4. Return successful, safe response without reflecting user data
    return NextResponse.json(
      { success: true, message: "Your message has been sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors securely (no stack trace)
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Generic error (prevents leaking internal details in production)
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
