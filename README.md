# Tommy Coconut Vacation Homes

Luxury vacation rental website for Tommy Coconut properties in Curaçao.

## Features

- Interactive villa showcase
- Personal curation experience (treasure-map.html)
- Form submissions via Zapier/Airtable integration
- Responsive design optimized for all devices
- Hero video backgrounds
- Interactive carousels

## Tech Stack

- HTML5/CSS3/JavaScript (Vanilla)
- Netlify for hosting and serverless functions
- Airtable for lead management
- Zapier for workflow automation

## Setup

### Environment Variables

For Netlify Functions to work with Airtable, set these environment variables in Netlify:

```
AIRTABLE_PAT=your_personal_access_token
AIRTABLE_BASE_ID=your_base_id
```

### Zapier Integration

The treasure-map.html form is configured to send data to a Zapier webhook. Update the webhook URL in the file:

1. Search for `YOUR_ZAPIER_WEBHOOK_URL_HERE` in treasure-map.html
2. Replace with your actual Zapier webhook URL

## Deployment

This site is configured for automatic deployment on Netlify:

1. Push changes to GitHub
2. Netlify automatically builds and deploys

## Project Structure

```
/
├── index.html              # Homepage
├── about.html              # About page
├── rentals.html            # Villa listings
├── treasure-map.html       # Personal curation experience
├── blog.html               # Blog/content
├── contact.html            # Contact form
├── faq.html                # FAQ page
├── netlify/
│   └── functions/          # Serverless functions
│       └── submit-to-airtable.js
├── images/                 # Image assets
├── videos/                 # Video assets
└── assets/                 # Additional assets
```

## Forms & Lead Capture

Forms can submit data through two methods:

1. **Netlify Functions** - Server-side submission to Airtable
2. **Zapier Webhooks** - Direct webhook submission for automation

## Local Development

1. Clone the repository
2. Open index.html in a browser
3. For testing Netlify Functions locally, use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify dev
   ```

## Contact

For questions about this project, please contact the Tommy Coconut team.