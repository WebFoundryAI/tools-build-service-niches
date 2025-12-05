# Blocked Drains Lead Generation Template

A professional, single-brand, local lead-generation website template built for the **Blocked Drains** niche in the UK. This is a resellable, fully-featured template designed for maximum SEO performance and easy customisation.

## Overview

This template is **not multi-tenant**. It is designed for a single brand deployment, making it perfect for:

- Drainage companies wanting a professional online presence
- Marketing agencies reselling to trade clients
- Entrepreneurs starting drainage service businesses

### Technology Stack

- **React** with React Router for SPA navigation
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Lovable Cloud (Supabase)** for backend services
- **Flexible AI content system** supporting multiple providers

---

## Features

### 🎯 Core Features

- **AI-generated, cached content** - Unique content for every service and location page
- **Multi-location system** - Support for multiple service areas with individual pages
- **Service-in-location pages** - Core SEO pages (e.g., "Blocked Drains in Swindon")
- **Static Google-style maps** - Location maps with coverage areas
- **Lead capture forms** - Integrated with Lovable Cloud database
- **Blog system** - Dynamic blog with AI post generation
- **Full JSON-LD schema** - Structured data for rich search results
- **Automatic sitemap** - XML sitemap generation
- **SEO metadata utilities** - Title and description helpers

### 🛠️ Admin Features

- **Content regeneration panel** - Manage AI-generated content cache
- **Blog post generator** - AI-assisted blog creation
- **Lead management** - View submitted leads in the database

---

## How to Rebrand the Site

All branding is centralised in configuration files. To rebrand for a new client:

### 1. Edit `/src/config/brand.ts`

```typescript
export const BRAND: BrandConfig = {
  brandName: "Your Drain Company",
  domain: "yourdraincompany.co.uk",
  primaryLocation: "Manchester",
  serviceAreaLabel: "Manchester and surrounding areas",
  phone: "0161 000 0000",
  email: "info@yourdraincompany.co.uk",
  addressLine1: "123 High Street",
  addressLine2: "Manchester",
  postcode: "M1 1AA",
  companyNumber: "12345678",
  primaryColour: "#005BBB",
  secondaryColour: "#FFD500",
  accentColour: "#111827",
  logoUrl: "/logo.png", // Optional
};
```

### 2. Edit `/src/config/locations.ts`

Update the primary location and surrounding areas:

```typescript
export const PRIMARY_LOCATION: LocationConfig = {
  slug: "manchester",
  name: "Manchester",
  countyOrRegion: "Greater Manchester",
  latitude: 53.4808,
  longitude: -2.2426,
};

export const LOCATIONS: LocationConfig[] = [
  PRIMARY_LOCATION,
  { slug: "salford", name: "Salford", ... },
  { slug: "stockport", name: "Stockport", ... },
  // Add more areas
];
```

### 3. Edit `/src/config/services.ts`

Customise the services offered:

```typescript
export const SERVICES: ServiceConfig[] = [
  {
    slug: "blocked-drains",
    name: "Blocked Drains",
    shortLabel: "Blocked drains cleared fast",
    description: "Professional drain unblocking...",
    icon: "🚿",
  },
  // Add or modify services
];
```

### 4. Edit `/src/config/maps.ts`

Configure map settings:

```typescript
export const MAP_CONFIG: MapConfig = {
  provider: "google-static", // or "placeholder"
  apiKeyEnvVar: "GOOGLE_STATIC_MAPS_API_KEY",
  defaultZoom: 11,
  width: 800,
  height: 450,
};
```

---

## Selecting AI Provider

The template supports multiple AI providers. Only **one provider** is active at a time.

### Edit `/src/config/aiProvider.ts`

```typescript
export const AI_PROVIDER: AIProvider = "lovable"; // Default
```

### Supported Providers

| Provider   | API Key Required         | Notes                          |
|------------|--------------------------|--------------------------------|
| `lovable`  | No (built-in)            | Default, recommended           |
| `openai`   | `OPENAI_API_KEY`         | GPT models                     |
| `gemini`   | `GEMINI_API_KEY`         | Google Gemini                  |
| `claude`   | `CLAUDE_API_KEY`         | Anthropic Claude               |
| `mistral`  | `MISTRAL_API_KEY`        | Mistral AI                     |
| `groq`     | `GROQ_API_KEY`           | Groq LLMs                      |

### Setting API Keys

If using a provider other than Lovable:

1. Add the API key to your Lovable Cloud secrets
2. The edge function will automatically use it

---

## Generating Content

### How It Works

1. Pages auto-generate unique content on first visit
2. Content is cached in the `ai_content` table
3. Subsequent visits load from cache (fast)
4. Cache can be cleared to regenerate content

### Content Templates

Templates are defined in `/src/config/aiPrompts.ts`:

- `homeIntro` - Homepage introduction
- `servicesOverview` - Services page intro
- `genericService` - Individual service pages
- `locationPage` - Location-specific pages
- `serviceInLocation` - Service + location combo pages
- `aboutPage` - About page content
- `faqPage` - FAQ content
- `blogPost` - Blog article generation

---

## Admin Panel

### Accessing the Admin Panel

Navigate to:

```
/admin/content?token=drain-admin-2024
```

### Changing the Admin Token

Edit the `ADMIN_TOKEN` constant in `/src/pages/AdminContent.tsx`:

```typescript
const ADMIN_TOKEN = "your-secure-token";
```

For production, consider using an environment variable.

### Admin Features

1. **View AI Content Cache** - See all cached content entries
2. **Delete Cache Entries** - Force regeneration on next visit
3. **Generate Blog Posts** - AI-assisted blog creation
4. **Manage Blog Posts** - View and delete blog posts

---

## Database Tables

The template uses three main tables:

### `leads`

Stores form submissions:

- `name`, `phone`, `email`, `postcode`
- `service`, `location`, `message`
- `source_page`, `created_at`

### `ai_content`

Caches AI-generated content:

- `key` - Unique identifier (e.g., `location:swindon`)
- `content` - Generated text
- `created_at`, `updated_at`

### `blog_posts`

Stores blog articles:

- `slug`, `title`, `excerpt`, `content`
- `created_at`, `updated_at`

---

## Deployment

### Using Lovable

1. Click **Publish** in the Lovable editor
2. Choose your deployment options
3. Point your domain to the Lovable deployment

### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed

No additional hosting required - Lovable handles everything.

---

## Project Structure

```
src/
├── components/
│   ├── ai/              # AI content components
│   ├── forms/           # Lead capture forms
│   ├── hero/            # Hero sections
│   ├── layout/          # Header, Footer, Layout
│   ├── nav/             # Navigation components
│   ├── sections/        # Page sections
│   ├── seo/             # Schema and SEO components
│   └── ui/              # UI primitives (shadcn)
├── config/
│   ├── aiPrompts.ts     # AI content templates
│   ├── aiProvider.ts    # AI provider configuration
│   ├── brand.ts         # Brand configuration
│   ├── locations.ts     # Service areas
│   ├── maps.ts          # Map settings
│   ├── seo.ts           # SEO metadata helpers
│   └── services.ts      # Services offered
├── hooks/               # React hooks
├── lib/                 # Utility functions
├── pages/               # Page components
└── integrations/        # Supabase client
```

---

## SEO Features

- **Dynamic meta titles and descriptions** per page
- **JSON-LD schema** for LocalBusiness, Service, Place, FAQ, BlogPosting
- **Breadcrumb schema** for navigation
- **XML sitemap** at `/sitemap.xml`
- **Robots.txt** allowing all crawlers
- **Internal linking** throughout all pages
- **Semantic HTML** structure

---

## Support

For support with this template:

- Review the code comments
- Check the Lovable documentation
- Customise the configuration files as needed

---

## License

This template is designed for resale. Each deployment should be treated as a separate instance for a single brand/client.

---

Built with ❤️ using [Lovable](https://lovable.dev)
