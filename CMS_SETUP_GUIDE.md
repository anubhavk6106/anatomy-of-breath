# 🧠 CMS Setup Guide — Anatomía del Aliento

## Overview

Your website uses **Sanity** as its CMS. Once connected, you (or your client) can:

- ✅ Add and edit **blog posts** (Medicina de la Voz)
- ✅ Add and edit **workshops/events** (Experiences)
- ✅ Update the **Soma featured block**
- ✅ Upload images, write rich text, set dates
- ✅ All changes appear on the website **instantly** (no code needed)

---

## Step 1: Create a Free Sanity Account

1. Go to **https://www.sanity.io**
2. Click **"Start for free"**
3. Sign up with Google or email
4. Create a new project:
   - **Project name**: `Anatomia del Aliento`
   - **Dataset**: `production`
   - **Template**: Blank project

5. Copy your **Project ID** (looks like: `abc12def`)

---

## Step 2: Configure Your Website

Open the `.env` file in your project root and fill in:

```bash
VITE_SANITY_PROJECT_ID=your_project_id_here
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
```

**Example:**
```bash
VITE_SANITY_PROJECT_ID=abc12def
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
```

---

## Step 3: Set Up the Sanity Studio (Admin Panel)

The Studio is your content editing interface. Set it up once:

```bash
# Navigate to the sanity folder
cd sanity

# Install dependencies
npm install

# Update sanity.config.js with your project ID
# Open sanity/sanity.config.js and replace 'your-project-id' with your actual ID
```

Edit `sanity/sanity.config.js`:
```javascript
const projectId = 'your-actual-project-id'  // ← Replace this
const dataset   = 'production'
```

---

## Step 4: Run the Studio Locally

```bash
cd sanity
npm run dev
```

Open **http://localhost:3333** in your browser.

You'll see the admin panel with three sections:
- 📝 **Blog Posts** — Medicina de la Voz
- 🗓 **Events & Workshops** — Experiences
- ✨ **Soma Featured Content**

---

## Step 5: Deploy the Studio (Optional)

To access the admin panel from anywhere (not just your computer):

```bash
cd sanity
npm run deploy
```

This gives you a URL like: `https://anatomia-del-aliento.sanity.studio`

---

## Step 6: Allow Your Website to Read Content

In Sanity dashboard → **API** → **CORS Origins**, add:
- `http://localhost:5173` (for development)
- `https://your-production-domain.com` (for production)

---

## How to Add Content

### Adding a Blog Post

1. Open Sanity Studio
2. Click **"📝 Blog Posts"**
3. Click **"+ New Blog Post"**
4. Fill in:
   - **Title** — The post title
   - **URL Slug** — Click "Generate" (auto-fills from title)
   - **Published Date** — When it was written
   - **Category** — Choose from the list
   - **Cover Image** — Upload a photo
   - **Excerpt** — Short summary (max 200 chars)
   - **Body** — Write the full article
5. Click **"Publish"**

The post appears on your website at:
`/pillars/medicina-de-la-voz/[slug]`

---

### Adding a Workshop/Event

1. Open Sanity Studio
2. Click **"🗓 Events & Workshops"**
3. Click **"+ New Event / Workshop"**
4. Fill in:
   - **Title** — Event name
   - **URL Slug** — Click "Generate"
   - **Date & Time** — When it happens
   - **Online Event?** — Toggle if it's virtual
   - **Location** — City/venue (if in-person)
   - **Cover Image** — Upload a photo
   - **Description** — Full event details
   - **Booking URL** — Link to registration (Eventbrite, Calendly, etc.)
5. Click **"Publish"**

The event appears on your website at:
`/pillars/experiences/[slug]`

**Note:** Past events automatically show a "Past" label with reduced opacity.

---

### Updating the Soma Featured Block

1. Open Sanity Studio
2. Click **"✨ Soma Featured Content"**
3. Click **"+ New Soma Featured Block"** (or edit existing)
4. Fill in:
   - **Title** — Feature headline
   - **Description** — Supporting text
   - **Show on Soma Page?** — Toggle ON to display it
5. Click **"Publish"**

**Important:** Only ONE feature should be active at a time. Turn off the old one before activating a new one.

---

## Content Structure

### Blog Post Fields

| Field | Required | Description |
|-------|----------|-------------|
| Title | ✅ Yes | Post headline |
| Slug | ✅ Yes | URL path (auto-generated) |
| Published Date | No | Sorting date |
| Category | No | Filter tag |
| Cover Image | No | Card + header image |
| Excerpt | No | Short summary (max 200 chars) |
| Body | No | Full rich text content |

### Event Fields

| Field | Required | Description |
|-------|----------|-------------|
| Title | ✅ Yes | Event name |
| Slug | ✅ Yes | URL path (auto-generated) |
| Date & Time | ✅ Yes | When it happens |
| Online Event? | No | Toggle for virtual events |
| Location | No | Physical venue |
| Cover Image | No | Card + header image |
| Description | No | Full event details |
| Booking URL | No | Registration link |

---

## Image Guidelines

| Use | Recommended Size | Format |
|-----|-----------------|--------|
| Blog cover | 1200 × 800px | JPG/WebP |
| Event cover | 1200 × 800px | JPG/WebP |
| Max file size | 5MB | — |

Sanity automatically optimizes and serves images via CDN.

---

## Troubleshooting

### "Content unavailable" on website
- Check that `VITE_SANITY_PROJECT_ID` is set in `.env`
- Verify the content is **Published** (not just saved as draft)
- Check CORS settings in Sanity dashboard

### Studio won't start
```bash
cd sanity
npm install  # Re-install dependencies
npm run dev
```

### Images not loading
- Make sure the image has been uploaded (not just linked)
- Check that the image has an **Alt Text** filled in

### Changes not appearing on website
- Content is cached for 60 seconds — wait a moment and refresh
- Make sure you clicked **"Publish"** (not just "Save")

---

## Architecture

```
Sanity Studio (Admin)          Your Website (Frontend)
─────────────────────          ──────────────────────
Client edits content    →      useSanityQuery() hook
Sanity stores in cloud  →      GROQ queries fetch data
CDN serves images       →      PostCard / EventCard display
                               60s cache for performance
```

### GROQ Queries Used

```javascript
// All blog posts (newest first)
*[_type == "post"] | order(publishedAt desc)

// Single post by URL slug
*[_type == "post" && slug.current == $slug][0]

// All events (upcoming first)
*[_type == "event"] | order(date asc)

// Single event by URL slug
*[_type == "event" && slug.current == $slug][0]

// Active Soma feature
*[_type == "somaFeature" && isActive == true][0]
```

---

## Pricing

Sanity's **free tier** includes:
- ✅ 3 users
- ✅ 10GB bandwidth/month
- ✅ 5GB assets
- ✅ Unlimited documents
- ✅ Hosted Studio

This is more than enough for this website.

Paid plans start at $15/month if you need more users or bandwidth.

---

## Quick Reference

| Task | Where |
|------|-------|
| Add blog post | Studio → 📝 Blog Posts → + New |
| Add event | Studio → 🗓 Events → + New |
| Update Soma block | Studio → ✨ Soma Featured → Edit |
| Deploy Studio | `cd sanity && npm run deploy` |
| View Studio locally | `cd sanity && npm run dev` → localhost:3333 |
| Configure project ID | `.env` → `VITE_SANITY_PROJECT_ID` |

---

## Support

- **Sanity Docs**: https://www.sanity.io/docs
- **GROQ Reference**: https://www.sanity.io/docs/groq
- **Sanity Community**: https://slack.sanity.io
