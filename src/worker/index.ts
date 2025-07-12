import { Hono } from "hono";
import type { Env } from "../worker-configuration";

const app = new Hono<{ Bindings: Env }>();

// API health check
app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// Handle estimate form submission
app.post("/api/estimate", async (c) => {
  const { name, email, phone, service, message, token } = await c.req.json();

  if (!token) {
    return c.json({ error: "Missing reCAPTCHA token" }, 400);
  }

  // Validate required fields
  const required = { name, email, phone, service };
  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    return c.json({ error: `Missing field(s): ${missing.join(", ")}` }, 400);
  }

  try {
    // Forward data to Google Apps Script webhook
    const webhook = c.env.LEAD_WEBHOOK_URL;
    if (!webhook) {
      return c.json({ error: "Webhook URL not configured" }, 500);
    }

    const forward = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, service, message }),
    });

    if (!forward.ok) {
      throw new Error("Webhook returned error");
    }

    return c.json({ message: "Estimate request submitted successfully" });
  } catch (error) {
    console.error("Submit failed:", error);
    return c.json({ error: "Failed to submit estimate" }, 500);
  }
});

// Fallback to static asset handling
app.all("*", async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
