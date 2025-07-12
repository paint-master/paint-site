import { Hono } from "hono";
import type { Env } from "../worker-configuration";
import { Resend } from "resend";

const app = new Hono<{ Bindings: Env }>();

// API health check
app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// Handle estimate form submission
app.post("/api/estimate", async (c) => {
  const { name, email, phone, service, message, token } = await c.req.json();

  if (!token) {
    return c.json({ error: "Missing reCAPTCHA token" }, 400);
  }

  const resend = new Resend(c.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "Dependable Painting <no-reply@dependablepainting.work>",
      to: ["alexdimmler@dependablepainting.work"],
      subject: `New Estimate Request from ${name || "unknown"}`,
      html: `
        <h2>New Estimate Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    return c.json({ message: "Estimate request submitted successfully" });
  } catch (error) {
    console.error("Email send failed:", error);
    return c.json({ error: "Failed to send email" }, 500);
  }
});

// Fallback to static asset handling
app.all("*", async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
