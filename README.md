# Dependable Painting Website

A modern, fast, and SEO-optimized website for Dependable Painting LLC, built with Cloudflare Workers and enhanced with AI-powered customer assistance.

## 🌟 Features

### Frontend
- **Responsive Design**: Mobile-first design optimized for all devices
- **Fast Loading**: Optimized images, preconnect hints, and lazy loading
- **SEO Optimized**: Structured data, meta tags, sitemap, and robots.txt
- **Interactive Gallery**: Touch-friendly image carousel with navigation
- **Contact Form**: reCAPTCHA protected with real-time validation
- **AI Assistant**: Interactive paint expert chatbot for instant help

### Backend (Cloudflare Workers)
- **AI Paint Guru**: Comprehensive knowledge base for paint-related questions
- **Email Notifications**: Instant owner notifications for new estimates
- **Auto-Response System**: Professional customer confirmation emails
- **Form Processing**: Secure form handling with validation and spam protection
- **API Integration**: Ready for multiple email service providers

### SEO & Performance
- **Structured Data**: Rich snippets for local business information
- **Core Web Vitals**: Optimized for Google's performance metrics
- **Local SEO**: Targeted for Baldwin and Mobile County, Alabama
- **Social Media**: Open Graph tags for social sharing
- **Search Console Ready**: Sitemap and robots.txt included

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Cloudflare account
- Wrangler CLI (for deployment)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd paint-site

# Install dependencies
npm install

# Deploy to Cloudflare Workers
wrangler deploy
```

### Environment Setup
See `ENVIRONMENT_SETUP.md` for detailed configuration instructions.

Required environment variables:
- `OWNER_EMAIL`: Where notifications are sent
- `EMAIL_API_KEY`: Your email service API key
- `EMAIL_API_URL`: Your email service endpoint
- `RECAPTCHA_SECRET_KEY`: Google reCAPTCHA secret

## 📁 Project Structure

```
paint-site/
├── public/                 # Static website files
│   ├── index.html         # Homepage with AI assistant
│   ├── contact-form.html  # Contact/estimate form
│   ├── about.html         # About page
│   ├── services.html      # Services overview
│   ├── interior-painting.html
│   ├── exterior-painting.html
│   ├── cabinet-painting.html
│   ├── commercial-painting.html
│   ├── privacy.html       # Privacy policy
│   ├── thank-you.html     # Form submission success
│   ├── 404.html          # Error page
│   ├── sitemap.xml       # Search engine sitemap
│   └── robots.txt        # Search engine directives
├── src/worker/            # Cloudflare Worker backend
│   ├── index.ts          # Main worker logic
│   └── worker-configuration.d.ts # TypeScript definitions
├── wrangler.json         # Cloudflare Workers configuration
├── package.json          # Dependencies
└── ENVIRONMENT_SETUP.md  # Configuration guide
```

## 🎨 AI Paint Assistant

The AI assistant provides expert answers on:
- **Services**: Interior, exterior, cabinet, and commercial painting
- **Coverage Areas**: Baldwin and Mobile County service areas
- **Pricing**: Estimate information and factors affecting cost
- **Timelines**: Project duration and scheduling
- **Preparation**: Surface prep and customer preparation
- **Quality**: Warranties and satisfaction guarantees
- **Contact**: Phone, email, and business hours

### Usage
Customers can ask questions like:
- "How much does interior painting cost?"
- "What areas do you serve?"
- "How long does cabinet painting take?"
- "Do you offer warranties?"

## 📧 Email System

### Owner Notifications
- Instant email alerts for new estimate requests
- Includes customer details and project information
- Formatted for easy reading and quick response

### Customer Auto-Response
- Professional confirmation emails
- Sets expectations for response timeline
- Includes contact information and next steps
- Reinforces company credibility and professionalism

## 🔧 Configuration

### Email Service Setup
The system supports multiple email providers:
- **Mailgun**: Reliable transactional email
- **SendGrid**: Scalable email delivery
- **Cloudflare Email Workers**: Native Cloudflare integration

### reCAPTCHA Setup
1. Get keys from Google reCAPTCHA Admin Console
2. Configure for your domain
3. Set the secret key in environment variables

### Analytics
- Google Analytics 4 integrated
- Google Tag Manager configured
- Conversion tracking for form submissions
- Phone call tracking with events

## 🎯 SEO Features

### Local Business Schema
- Complete local business structured data
- Service listings with descriptions
- Area served information
- Contact details and hours
- Aggregate rating display

### Content Optimization
- Location-targeted keywords
- Service-specific landing pages
- FAQ section with common questions
- Customer testimonials and reviews

### Technical SEO
- Clean URL structure
- Mobile-friendly design
- Fast loading times
- Proper heading hierarchy
- Alt text for all images

## 📱 Mobile Optimization

- Touch-friendly navigation
- Optimized form inputs
- Swipeable image gallery
- Responsive breakpoints
- Fast mobile loading

## 🔒 Security

- reCAPTCHA spam protection
- Input validation and sanitization
- Secure environment variable handling
- HTTPS-only configuration
- Content Security Policy headers

## 📊 Performance

### Core Web Vitals
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

### Optimizations
- Image optimization and lazy loading
- DNS prefetch for external resources
- Minified CSS and JavaScript
- Efficient font loading
- Optimized third-party scripts

## 🚀 Deployment

### Production Deployment
```bash
# Deploy to production
wrangler deploy --env production

# Set production environment variables
wrangler secret put OWNER_EMAIL --env production
wrangler secret put EMAIL_API_KEY --env production
```

### Environment Management
- Development: Local testing environment
- Staging: Pre-production testing
- Production: Live customer-facing site

## 📈 Analytics & Monitoring

### Google Analytics Events
- Form submissions
- Phone calls from website
- AI assistant interactions
- Page views and engagement

### Cloudflare Analytics
- Worker execution metrics
- Error rates and performance
- Geographic traffic distribution
- Security threat monitoring

## 🤝 Support

For technical support or feature requests:
- Review the `ENVIRONMENT_SETUP.md` guide
- Check Cloudflare Workers documentation
- Contact the development team

## 📄 License

This project is proprietary software for Dependable Painting LLC.

---

**Dependable Painting LLC**  
Professional Painting Services  
Baldwin & Mobile County, Alabama  
(251) 525-4405