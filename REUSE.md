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

## Responsible AI Content Usage

**IMPORTANT:** This template includes AI content generation capabilities. Please read this section carefully to ensure responsible usage aligned with Google's guidelines.

### Google's Position on AI Content

Google allows AI-generated content **when it is**:
- **High-quality** – useful, accurate, and well-written
- **Original** – not duplicated across many sites
- **People-first** – created to help users, not just to rank in search

Google considers it **spam** when:
- Automation is used to create **many low-value pages** at scale
- Content is generated **without meaningful human review**
- Pages exist primarily to **manipulate search rankings**

This is called **"scaled content abuse"** and can result in manual penalties or algorithmic demotions.

### Built-in Safety Rails

This template includes several features to help you stay aligned with Google's guidance:

#### 1. AI Content Policy Panel
Every admin page displays a reminder about responsible AI content usage, Google's guidelines, and recommended workflows.

#### 2. Who/How/Why Metadata Tracking
All AI-generated content stores:
- `how_created` – Method of creation (AI-assisted)
- `why_created` – Admin's stated purpose for creating the content
- `human_reviewed` – Whether content has been reviewed
- `reviewed_by` / `reviewed_at` – Review audit trail

This aligns with Google's "Who, How, Why" guidance for AI content transparency.

#### 3. Quality Checklist Before Generation
Before generating content, admins must confirm:
- They will review and edit the content
- Each page will include unique local details
- They understand the risks of scaled low-value content

#### 4. Batch Size Limits
- Maximum 10 items per bulk generation
- Warnings when exceeding recommended limits
- Encourages smaller, reviewable batches

#### 5. Indexing Control
- All generated content defaults to **non-indexable**
- Admins must explicitly enable indexing per page
- "Thin content" warnings highlight pages that need improvement
- Pages marked as non-indexable output `<meta name="robots" content="noindex">` tags

#### 6. Quality Scoring System (Green/Amber/Red)

Every AI-generated page receives an at-a-glance quality status:

| Status | Meaning |
|--------|---------|
| 🟢 **Green** | Meets all thresholds, reviewed, ready for indexing |
| 🟡 **Amber** | Needs improvement – missing signals or not yet reviewed |
| 🔴 **Red** | Not ready – thin content, unreviewed, or highly duplicate |

Quality is based on these signals:

1. **Text Depth** – Word count thresholds per page type:
   - Service-in-location: target 700+, warn < 500, critical < 300
   - Location pages: target 500+, warn < 350
   - Service pages: target 600+, warn < 400
   - Sub-service pages: target 400+, warn < 250
   - Blog posts: target 900+, warn < 600, critical < 400

2. **Local Specificity** – For location-bound pages:
   - Mentions primary town/city
   - References nearby areas from config
   - Includes local context (property types, area details)

3. **Internal Linking** – Expected links vary by page type:
   - Service-in-location: links to service, location, and contact
   - Blog posts: links to related services and blog index

4. **Uniqueness** – Detects near-duplicate content:
   - Flags identical introductions/conclusions across pages
   - Warns when pages look like boilerplate with only location swaps

5. **Review Status** – Human review confirmation

#### 7. Quality Dashboard
The admin area displays a summary dashboard showing:
- Green/Amber/Red counts per page type
- Number of pages that are indexable but have quality issues
- Clear warnings about scaled content risks

#### 8. Review Status Indicators
- Visual quality badges in admin lists
- Hover tooltips explain specific issues
- Easy one-click "Mark as Reviewed" actions

### Recommended Workflow

1. **Generate in small batches** (5-10 pages maximum)
2. **Review every page** – edit for accuracy, tone, and local relevance
3. **Add unique local details**:
   - Real photos of your work
   - Case studies from actual jobs
   - Verified customer testimonials
   - Specific local area knowledge
4. **Mark as reviewed** once you're satisfied
5. **Enable indexing** only for pages you're proud of
6. **Monitor performance** and improve underperforming pages

### What NOT To Do

❌ Generate hundreds of pages in one session  
❌ Enable indexing without reviewing content  
❌ Leave generated content unchanged  
❌ Create near-duplicate pages for every possible keyword  
❌ Ignore "thin content" warnings  
❌ Skip the quality checklist  

### Your Responsibility

These safety rails are **guidance tools**, not absolute blocks. Final responsibility for content quality lies with the site operator. If you publish low-quality content at scale, search engines may:
- Demote your pages in rankings
- Apply manual spam actions
- Remove pages from the index entirely

**Treat AI as a starting point, not a finished product.**

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

### 3. Access the Admin Area

Navigate to `/login` and sign in with an admin email address.

Admin emails are configured in `src/config/adminAuth.ts`. Add your email to the `ADMIN_EMAILS` array.

### 4. Configure the New Brand

Use the Rebrand Wizard (`/admin/rebrand`) to set:

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
4. **Review all generated content before enabling indexing**

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

1. Go to `/admin/rebrand`
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
- [ ] **Content has been reviewed and is indexable**

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
   - **Brief buyer on responsible AI content usage**

4. **Clear Previous Data (Optional)**
   - Use `/admin/rebrand` → Data Reset
   - Clear leads if they shouldn't transfer
   - Clear blog posts if starting fresh

5. **Update Admin Access**
   - Add buyer's email to `ADMIN_EMAILS` in `src/config/adminAuth.ts`
   - Remove your email if transferring fully

### What the Buyer Receives

- Complete, working drainage lead-gen website
- AI-powered content generation with safety rails
- Multi-location SEO structure
- Blog system with review workflow
- Lead capture forms
- Admin tools for content management
- Full documentation including responsible usage guidelines

---

## Configuration Files Reference

| File | Purpose |
|------|---------|
| `/src/config/brand.ts` | Company name, contact, colours |
| `/src/config/locations.ts` | Service areas with coordinates |
| `/src/config/services.ts` | Services and sub-services |
| `/src/config/maps.ts` | Map provider settings |
| `/src/config/aiProvider.ts` | AI provider selection |
| `/src/config/adminAuth.ts` | Admin email whitelist |
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
4. **Ensure pages are marked as indexable in admin**

### Admin Access Issues
1. Ensure your email is in `ADMIN_EMAILS` array
2. Sign in at `/login`
3. Clear browser cache if issues persist

### Content Not Indexing
1. Check the indexable toggle in admin
2. Non-indexable pages have `noindex` meta tags
3. Review and improve thin content before enabling

---

## Support

For template support:
- Review the main `README.md`
- Check Lovable documentation
- Use the admin tools for diagnostics

---

*This template is designed for resale. Each deployment should be treated as a separate instance for a single brand/client. Always use AI content responsibly and in accordance with search engine guidelines.*
