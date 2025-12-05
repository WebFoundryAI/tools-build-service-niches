# Template Reuse Guide

This document explains how to use this Lovable project as a template for creating multiple independent local lead-generation sites.

---

## Concept

**One Lovable project = One local brand/site**

This template is designed for single-brand deployments. To serve multiple clients or brands:

1. **Duplicate** this Lovable project
2. **Rebrand** using the built-in wizard
3. **Deploy** under the client's domain

This approach:
- ✅ Avoids multi-tenant SEO risks
- ✅ Keeps each site fully isolated
- ✅ Allows complete customisation per client
- ✅ Simplifies ownership transfer

---

## Steps to Spin Up a New Site

### 1. Duplicate the Lovable Project

In Lovable:
- Go to the project settings
- Select "Duplicate" or "Remix"
- Name the new project for your client

### 2. Set Up Secrets

In the new project's Lovable Cloud settings, configure:

| Secret | Required? | Notes |
|--------|-----------|-------|
| `LOVABLE_API_KEY` | Auto-set | Provided automatically |
| `OPENAI_API_KEY` | If using OpenAI | Only if switching from Lovable AI |
| `GEMINI_API_KEY` | If using Gemini | Only if switching from Lovable AI |
| `GOOGLE_STATIC_MAPS_API_KEY` | Optional | For real map images |

### 3. Access the Rebrand Wizard

Navigate to:
```
/admin/rebrand?token=drain-admin-2024
```

⚠️ **Important:** Change the admin token in production by editing the `ADMIN_TOKEN` constant in the admin files.

### 4. Configure the New Brand

Use the wizard to set:

**Step 1 - Brand Basics**
- Company name, domain, phone, email
- Address and postcode
- Brand colours (with colour pickers)

**Step 2 - Primary Location**
- Main town/city
- County/region
- Coordinates (get from Google Maps)

**Step 3 - Surrounding Locations**
- Add all service areas
- Each gets its own location pages

**Step 4 - Services**
- Configure services offered
- Add sub-services if needed

**Step 5 - AI Provider**
- Review current provider
- Default is Lovable AI (no key needed)

**Step 6 - Review & Apply**
- Check the "Ready to Sell" checklist
- Export or apply the rebrand

### 5. Apply Rebrand

Two options:

#### Option A: Apply to This Project
- Click "Apply Rebrand to This Project"
- This updates the config files directly
- Clear AI content to regenerate for new brand

#### Option B: Export Only
- Download the JSON plan
- Manually update config files
- Useful for developer handover

### 6. Generate Content

After rebranding:
1. Visit key pages to trigger AI content generation
2. Use `/admin/content` to monitor content cache
3. Use `/admin/blog-scheduler` to create blog posts

### 7. Submit to Search Engines

1. Access `/sitemap.xml` and `/robots.txt`
2. Submit sitemap to Google Search Console
3. Set up Google Business Profile with matching NAP

### 8. Deploy

1. Click "Publish" in Lovable
2. Connect the client's custom domain
3. Verify SSL and DNS

---

## Exporting a Rebrand Plan Without Applying

If you want to prepare a configuration for a buyer without modifying the current project:

1. Go to `/admin/rebrand?token=drain-admin-2024`
2. Complete all wizard steps
3. On Step 6, click **"Download JSON"** or **"Copy to Clipboard"**
4. This exports the complete configuration
5. The buyer can paste/import into their own project

The export includes:
- Complete brand configuration
- All locations with coordinates
- All services and sub-services
- No sensitive data (API keys)

---

## Selling the Site

### Pre-Sale Checklist

Use `/admin/rebrand` → Step 6 to verify:

- [ ] Brand is configured (not default "Example Drain Heroes")
- [ ] Locations are defined
- [ ] Services are defined
- [ ] AI content is generated (5+ pages)
- [ ] Blog posts exist (3+)
- [ ] Sitemap is accessible

### Handover Process

1. **Transfer Domain**
   - Update DNS to point to Lovable deployment
   - Or transfer domain ownership to buyer

2. **Transfer Lovable Project**
   - Option A: Transfer project ownership in Lovable
   - Option B: Help buyer clone and rebrand

3. **Provide Documentation**
   - Include this `REUSE.md` file
   - Include the main `README.md`
   - Provide the exported configuration snapshot

4. **Clear Previous Data (Optional)**
   - Use `/admin/rebrand` → Data Reset
   - Clear leads if they shouldn't transfer
   - Clear blog posts if starting fresh

5. **Update Admin Token**
   - Change `ADMIN_TOKEN` to a new value
   - Provide new token to buyer

### What the Buyer Receives

- Complete, working drainage lead-gen website
- AI-powered content generation
- Multi-location SEO structure
- Blog system
- Lead capture forms
- Admin tools for content management
- Full documentation

---

## Configuration Files Reference

| File | Purpose |
|------|---------|
| `/src/config/brand.ts` | Company name, contact, colours |
| `/src/config/locations.ts` | Service areas with coordinates |
| `/src/config/services.ts` | Services and sub-services |
| `/src/config/maps.ts` | Map provider settings |
| `/src/config/aiProvider.ts` | AI provider selection |
| `/src/config/trust.ts` | Trust badges and guarantees |
| `/src/config/aiPrompts.ts` | AI content templates |

---

## Troubleshooting

### AI Content Not Generating
1. Check AI provider is set correctly
2. Verify API key if not using Lovable AI
3. Check edge function logs in Lovable Cloud

### Maps Not Showing
1. Add `GOOGLE_STATIC_MAPS_API_KEY` to secrets
2. Or use placeholder maps (default)

### SEO Issues
1. Verify sitemap at `/sitemap.xml`
2. Check robots.txt at `/robots.txt`
3. Review schema using Google's Rich Results Test

### Admin Access Issues
1. Ensure token is correct in URL
2. Check `ADMIN_TOKEN` constant matches
3. Clear browser cache if issues persist

---

## Support

For template support:
- Review the main `README.md`
- Check Lovable documentation
- Use the admin tools for diagnostics

---

*This template is designed for resale. Each deployment should be treated as a separate instance for a single brand/client.*
