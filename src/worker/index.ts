import { Hono } from "hono";
import type { Env } from "../worker-configuration";

const app = new Hono<{ Bindings: Env }>();

// Paint-specific knowledge base for AI assistant
const PAINT_KNOWLEDGE = {
  services: {
    interior: "Interior painting services include walls, ceilings, trim, and detailed finish work using premium paints with proper preparation.",
    exterior: "Exterior painting protects and beautifies your home with weather-resistant paints, including pressure washing, scraping, priming, and multi-coat application.",
    cabinet: "Cabinet painting transforms kitchens and bathrooms with factory-smooth finishes using specialized techniques and high-durability paints.",
    commercial: "Commercial painting services for businesses with minimal disruption, high-quality results, and professional-grade materials."
  },
  coverage: "We serve Baldwin County and Mobile County, AL including Fairhope, Daphne, Spanish Fort, Loxley, Bay Minette, Mobile, Theodore, Saraland, and Stockton. We do not serve Gulf Shores or Orange Beach except for large commercial projects.",
  pricing: "We offer free estimates within 24-48 hours. Pricing depends on project size, surface preparation needed, paint quality, and timeline. Contact us for accurate quotes.",
  timeline: "Most residential projects take 2-5 days depending on size and weather. Commercial projects are scheduled to minimize business disruption.",
  preparation: "Proper preparation is key to lasting results. We include cleaning, scraping, sanding, priming, and caulking as needed for each project.",
  warranty: "We stand behind our work with quality guarantees and use only premium paints with manufacturer warranties.",
  contact: "Call (251) 525-4405 or email alexdimmler@dependablepainting.work for immediate assistance. Free estimates available."
};

// API health check
app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// AI Paint Assistant endpoint
app.post("/paint-guru", async (c) => {
  try {
    const { question, recaptchaToken } = await c.req.json();

    if (!question || typeof question !== 'string') {
      return c.json({ error: "Question is required" }, 400);
    }

    // Verify reCAPTCHA if token provided
    if (recaptchaToken) {
      const recaptchaSecret = c.env.RECAPTCHA_SECRET_KEY;
      if (recaptchaSecret) {
        const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${recaptchaSecret}&response=${recaptchaToken}`
        });
        
        const recaptchaResult = await recaptchaResponse.json();
        if (!recaptchaResult.success) {
          return c.json({ error: "reCAPTCHA verification failed" }, 400);
        }
      }
    }

    // Simple AI-like response based on keywords
    const answer = generatePaintAnswer(question.toLowerCase());
    
    return c.json({ answer });
  } catch (error) {
    console.error("AI assistant error:", error);
    return c.json({ error: "Unable to process your question right now" }, 500);
  }
});

// Handle estimate form submission with enhanced notifications
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
    // Send notification and auto-response emails
    await Promise.all([
      sendOwnerNotification(c.env, { name, email, phone, service, message }),
      sendCustomerAutoResponse(c.env, { name, email, service })
    ]);

    // Forward data to webhook if configured
    const webhook = c.env.LEAD_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, service, message }),
      }).catch(error => console.error("Webhook error:", error));
    }

    return c.json({ message: "Estimate request submitted successfully" });
  } catch (error) {
    console.error("Submit failed:", error);
    return c.json({ error: "Failed to submit estimate" }, 500);
  }
});

// Fallback to static asset handling
app.all("*", async (c) => {
  const response = await c.env.ASSETS.fetch(c.req.raw);
  
  // Add performance headers for static assets
  if (response.ok) {
    const url = new URL(c.req.url);
    const newResponse = new Response(response.body, response);
    
    // Cache static assets
    if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || 
        url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg') || 
        url.pathname.endsWith('.jpeg') || url.pathname.endsWith('.svg') ||
        url.pathname.endsWith('.ico')) {
      newResponse.headers.set('Cache-Control', 'public, max-age=31536000'); // 1 year
    } else if (url.pathname.endsWith('.html')) {
      newResponse.headers.set('Cache-Control', 'public, max-age=3600'); // 1 hour
    }
    
    // Security headers
    newResponse.headers.set('X-Content-Type-Options', 'nosniff');
    newResponse.headers.set('X-Frame-Options', 'DENY');
    newResponse.headers.set('X-XSS-Protection', '1; mode=block');
    
    return newResponse;
  }
  
  return response;
});

// Helper function to generate paint-related answers
function generatePaintAnswer(question: string): string {
  const q = question.toLowerCase();
  
  // Service-related questions
  if (q.includes('interior') || q.includes('inside') || q.includes('indoor')) {
    return `**Interior Painting Services**\n\n${PAINT_KNOWLEDGE.services.interior}\n\n**What's included:**\n- Wall and ceiling painting\n- Trim and baseboard work\n- Color consultation\n- Furniture protection\n- Thorough cleanup\n\n${PAINT_KNOWLEDGE.contact}`;
  }
  
  if (q.includes('exterior') || q.includes('outside') || q.includes('outdoor')) {
    return `**Exterior Painting Services**\n\n${PAINT_KNOWLEDGE.services.exterior}\n\n**Our process:**\n- Pressure washing\n- Surface preparation\n- Primer application\n- High-quality paint application\n- Weather protection\n\n${PAINT_KNOWLEDGE.contact}`;
  }
  
  if (q.includes('cabinet') || q.includes('kitchen') || q.includes('bathroom')) {
    return `**Cabinet Painting**\n\n${PAINT_KNOWLEDGE.services.cabinet}\n\n**Process highlights:**\n- Professional removal and prep\n- Multiple coats for durability\n- Smooth, factory-like finish\n- Minimal kitchen downtime\n\n${PAINT_KNOWLEDGE.contact}`;
  }
  
  if (q.includes('commercial') || q.includes('business') || q.includes('office')) {
    return `**Commercial Painting**\n\n${PAINT_KNOWLEDGE.services.commercial}\n\n**Why choose us:**\n- Licensed and insured\n- Flexible scheduling\n- Quality materials\n- Professional crew\n\n${PAINT_KNOWLEDGE.contact}`;
  }
  
  // Pricing questions
  if (q.includes('price') || q.includes('cost') || q.includes('estimate') || q.includes('quote')) {
    return `**Pricing & Estimates**\n\n${PAINT_KNOWLEDGE.pricing}\n\n**Factors affecting price:**\n- Project size and complexity\n- Surface preparation needed\n- Paint quality selected\n- Timeline requirements\n\n**Free estimates include:**\n- Detailed scope of work\n- Material specifications\n- Timeline estimate\n- No-obligation pricing\n\n${PAINT_KNOWLEDGE.contact}`;
  }
  
  // Coverage area questions
  if (q.includes('area') || q.includes('location') || q.includes('serve') || q.includes('cover') || 
      q.includes('fairhope') || q.includes('daphne') || q.includes('mobile') || q.includes('baldwin')) {
    return `**Service Areas**\n\n${PAINT_KNOWLEDGE.coverage}\n\n**Primary service areas:**\n- Fairhope, AL\n- Daphne, AL\n- Spanish Fort, AL\n- Mobile, AL\n- Bay Minette, AL\n- Loxley, AL\n- Theodore, AL\n- Saraland, AL\n\n${PAINT_KNOWLEDGE.contact}`;
  }
  
  // Timeline questions
  if (q.includes('time') || q.includes('how long') || q.includes('duration') || q.includes('schedule')) {
    return `**Project Timeline**\n\n${PAINT_KNOWLEDGE.timeline}\n\n**Typical timelines:**\n- Single room: 1-2 days\n- Whole house interior: 3-5 days\n- Exterior painting: 3-7 days\n- Cabinet painting: 3-5 days\n\n**Factors affecting timeline:**\n- Weather conditions\n- Surface preparation needs\n- Project complexity\n- Drying time between coats\n\n${PAINT_KNOWLEDGE.contact}`;
  }
  
  // Preparation questions
  if (q.includes('prep') || q.includes('preparation') || q.includes('ready') || q.includes('before')) {
    return `**Surface Preparation**\n\n${PAINT_KNOWLEDGE.preparation}\n\n**Our preparation includes:**\n- Thorough cleaning\n- Scraping loose paint\n- Sanding rough surfaces\n- Filling holes and cracks\n- Applying primer as needed\n- Protecting furniture and floors\n\n**You don't need to:**\n- Move furniture (we'll handle it)\n- Clean surfaces (we do the prep)\n- Buy materials (included in estimate)\n\n${PAINT_KNOWLEDGE.contact}`;
  }
  
  // Warranty questions
  if (q.includes('warranty') || q.includes('guarantee') || q.includes('quality')) {
    return `**Quality & Warranty**\n\n${PAINT_KNOWLEDGE.warranty}\n\n**Our commitment:**\n- Satisfaction guarantee\n- Premium paint warranties\n- Professional workmanship\n- Licensed and insured\n- 100+ happy customers\n\n**What's covered:**\n- Workmanship issues\n- Paint manufacturer defects\n- Touch-up within warranty period\n\n${PAINT_KNOWLEDGE.contact}`;
  }
  
  // Contact/general questions
  if (q.includes('contact') || q.includes('call') || q.includes('email') || q.includes('phone')) {
    return `**Contact Information**\n\n${PAINT_KNOWLEDGE.contact}\n\n**Best ways to reach us:**\n- **Phone:** (251) 525-4405\n- **Email:** alexdimmler@dependablepainting.work\n- **Online:** Submit our contact form\n- **Hours:** Mon-Fri 8:00am-5:30pm, Sat by appointment\n\n**Response times:**\n- Phone calls: Immediate during business hours\n- Emails: Within 24 hours\n- Estimates: Scheduled within 24-48 hours`;
  }
  
  // Default response for unmatched questions
  return `**Paint Expert Assistance**\n\nI'm here to help with all your painting questions! I can provide information about:\n\n**Our Services:**\n- Interior painting\n- Exterior painting  \n- Cabinet refinishing\n- Commercial painting\n\n**Common Topics:**\n- Pricing and estimates\n- Project timelines\n- Service areas\n- Preparation process\n- Quality guarantees\n\n**Quick Answer:** ${PAINT_KNOWLEDGE.contact}\n\n*Try asking me something specific like "How much does interior painting cost?" or "What areas do you serve?"*`;
}

// Send notification email to business owner
async function sendOwnerNotification(env: any, data: any): Promise<void> {
  if (!env.OWNER_EMAIL || !env.EMAIL_API_KEY) {
    console.warn("Email configuration missing for owner notifications");
    return;
  }

  const emailData = {
    to: env.OWNER_EMAIL,
    subject: `🎨 New Paint Estimate Request - ${data.service}`,
    html: `
      <h2>New Estimate Request</h2>
      <p><strong>Service:</strong> ${data.service}</p>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Message:</strong></p>
      <blockquote>${data.message}</blockquote>
      <hr>
      <p><em>Respond within 24 hours for best customer experience.</em></p>
    `
  };

  await sendEmail(env, emailData);
}

// Send automatic response to customer
async function sendCustomerAutoResponse(env: any, data: any): Promise<void> {
  if (!env.OWNER_EMAIL || !env.EMAIL_API_KEY) {
    console.warn("Email configuration missing for auto-responses");
    return;
  }

  const emailData = {
    to: data.email,
    subject: "Thank you for your paint estimate request - Dependable Painting",
    html: `
      <h2>Thank you, ${data.name}!</h2>
      <p>We've received your request for <strong>${data.service}</strong> and appreciate your interest in Dependable Painting.</p>
      
      <h3>What happens next:</h3>
      <ul>
        <li>✅ Your request has been received</li>
        <li>📞 We'll contact you within 24 hours</li>
        <li>📝 Schedule your free in-person estimate</li>
        <li>🎨 Get your detailed quote and timeline</li>
      </ul>
      
      <h3>Questions in the meantime?</h3>
      <p>Call us directly at <strong>(251) 525-4405</strong> or email alexdimmler@dependablepainting.work</p>
      
      <h3>Why choose Dependable Painting?</h3>
      <ul>
        <li>Licensed & insured in Alabama</li>
        <li>100+ satisfied customers</li>
        <li>Quality materials and workmanship</li>
        <li>Serving Baldwin & Mobile Counties</li>
      </ul>
      
      <p>Thank you for choosing Dependable Painting!</p>
      
      <hr>
      <p><small>Dependable Painting LLC | (251) 525-4405 | Bay Minette, AL</small></p>
    `
  };

  await sendEmail(env, emailData);
}

// Generic email sender (using Cloudflare Email Workers or external service)
async function sendEmail(env: any, emailData: any): Promise<void> {
  try {
    // Example using a generic email API (modify based on your email service)
    if (env.EMAIL_API_URL && env.EMAIL_API_KEY) {
      await fetch(env.EMAIL_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.EMAIL_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: env.FROM_EMAIL || "noreply@dependablepainting.work",
          ...emailData
        })
      });
    }
  } catch (error) {
    console.error("Email send failed:", error);
  }
}

export default app;
