# Environment Configuration Guide

This guide explains how to configure the environment variables needed for the paint site's enhanced functionality.

## Required Environment Variables

### Email Configuration
These variables are needed for sending notification emails and auto-responses:

```bash
# Email API Configuration (choose one email service)
EMAIL_API_URL=https://api.emailservice.com/send  # Your email service API endpoint
EMAIL_API_KEY=your_email_api_key_here            # Your email service API key

# Email Addresses
OWNER_EMAIL=alexdimmler@dependablepainting.work  # Where notifications are sent
FROM_EMAIL=noreply@dependablepainting.work       # From address for auto-responses
```

### reCAPTCHA Configuration
```bash
# Get this from Google reCAPTCHA Admin Console
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

### Webhook Configuration (Optional)
```bash
# If you want to forward leads to a Google Apps Script or other webhook
LEAD_WEBHOOK_URL=https://script.google.com/macros/s/your_script_id/exec
```

## Setting Up Environment Variables in Cloudflare Workers

### Method 1: Using Cloudflare Dashboard
1. Go to Workers & Pages in your Cloudflare dashboard
2. Select your paint-site worker
3. Go to Settings > Environment Variables
4. Add each variable name and value

### Method 2: Using Wrangler CLI
```bash
# Set production environment variables
wrangler secret put OWNER_EMAIL
wrangler secret put EMAIL_API_KEY
wrangler secret put RECAPTCHA_SECRET_KEY
wrangler secret put LEAD_WEBHOOK_URL

# Or use environment-specific variables
wrangler secret put EMAIL_API_URL --env production
```

### Method 3: Using wrangler.toml (for non-sensitive variables)
```toml
[env.production.vars]
OWNER_EMAIL = "alexdimmler@dependablepainting.work"
FROM_EMAIL = "noreply@dependablepainting.work"
```

## Email Service Options

### Option 1: Mailgun
```bash
EMAIL_API_URL=https://api.mailgun.net/v3/your-domain/messages
EMAIL_API_KEY=your_mailgun_api_key
```

### Option 2: SendGrid
```bash
EMAIL_API_URL=https://api.sendgrid.com/v3/mail/send
EMAIL_API_KEY=your_sendgrid_api_key
```

### Option 3: Cloudflare Email Workers (when available)
```bash
# Use Cloudflare's native email sending capability
EMAIL_API_URL=https://api.cloudflare.com/client/v4/accounts/your-account-id/email/send
EMAIL_API_KEY=your_cloudflare_api_token
```

## Testing Your Configuration

1. Deploy your worker with the environment variables set
2. Submit a test form at `/contact-form.html`
3. Check your email for both:
   - Notification email to OWNER_EMAIL
   - Auto-response email to the submitted email address
4. Test the AI assistant at the bottom of the homepage

## Security Notes

- Never commit API keys or secrets to your repository
- Use Cloudflare's secret management for sensitive variables
- Regularly rotate your API keys
- Monitor your email service usage and costs

## Troubleshooting

- Check Cloudflare Workers logs for any error messages
- Verify all environment variables are set correctly
- Test email service API credentials independently
- Ensure reCAPTCHA keys match your domain

## Support

For additional help with configuration, contact the development team or refer to:
- Cloudflare Workers documentation
- Your email service provider's API documentation
- Google reCAPTCHA documentation