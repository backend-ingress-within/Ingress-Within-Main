# Ingress Within — Search Console & Search Engine Verification Setup Guide

This guide details the step-by-step procedure for verifying ownership, submitting sitemaps, and requesting URL indexing for **Ingress Within** (`https://ingresswithin.com`) across Google Search Console and Bing Webmaster Tools.

---

## 1. Google Search Console (GSC) Setup

### Step 1: Access Google Search Console
1. Navigate to [Google Search Console](https://search.google.com/search-console).
2. Sign in with the primary team Google/organization account.

### Step 2: Add Property
1. Click **Add Property** in the property selector.
2. Choose one of two property types:
   - **Domain Property** (Recommended if you control DNS): Enter `ingresswithin.com`. (Covers all subdomains and http/https protocols).
   - **URL Prefix Property**: Enter `https://ingresswithin.com`.

---

### Step 3: Ownership Verification Methods

#### Option A: DNS Verification (Recommended)
1. In GSC, select **Domain** verification.
2. Copy the `TXT` record provided by Google (e.g., `google-site-verification=XXXXXXXXXXXXXXXXXXXXX`).
3. Add the TXT record to your DNS provider (e.g., Cloudflare, Route 53, Vercel Domains, Namecheap).
4. Wait 1–5 minutes for DNS propagation, then click **Verify** in GSC.

#### Option B: HTML Meta Tag Verification (Supported via Environment Variable)
The repository is pre-configured to automatically inject the verification tag into the HTML `<head>` when the environment variable is present:
1. In GSC, select **HTML tag** verification and copy the token value from `content="..."`.
2. Add the environment variable in your production hosting platform (e.g. Vercel Project Settings > Environment Variables):
   - **Key**: `GOOGLE_SITE_VERIFICATION`
   - **Value**: `your_gsc_verification_token`
3. Trigger a production redeploy.
4. Return to Google Search Console and click **Verify**.

---

### Step 4: Submit the XML Sitemap
1. In the GSC sidebar, navigate to **Indexing > Sitemaps**.
2. Under **Add a new sitemap**, enter:
   ```text
   https://ingresswithin.com/sitemap.xml
   ```
3. Click **Submit**.
4. Confirm status displays **Success** with 15 discovered URLs.

---

### Step 5: URL Inspection & Indexing Requests
Perform individual URL inspections for key landing and pillar pages to trigger initial crawler queueing:

1. In GSC, use the top search bar (**Inspect any URL in "https://ingresswithin.com"**).
2. Inspect the **Homepage**:
   - URL: `https://ingresswithin.com/`
   - Click **Test Live URL**.
   - Click **Request Indexing**.
3. Inspect and request indexing for the **Core Pillar & Supporting Content Pages**:
   - `https://ingresswithin.com/guided-journaling`
   - `https://ingresswithin.com/self-reflection`
   - `https://ingresswithin.com/emotional-patterns`
   - `https://ingresswithin.com/self-awareness`
   - `https://ingresswithin.com/journaling-prompts-for-self-discovery`
   - `https://ingresswithin.com/how-to-start-journaling`
   - `https://ingresswithin.com/how-to-practice-self-reflection`
4. Inspect utility and trust pages:
   - `https://ingresswithin.com/what-it-is`
   - `https://ingresswithin.com/how-it-works`
   - `https://ingresswithin.com/about`
   - `https://ingresswithin.com/pricing`
   - `https://ingresswithin.com/faq`
   - `https://ingresswithin.com/ai-data`
   - `https://ingresswithin.com/contact`

---

## 2. Bing Webmaster Tools Setup

### Step 1: Access Bing Webmaster Tools
1. Navigate to [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Sign in with your Microsoft account or Google account.

### Step 2: Add and Verify Site
- **Option 1 (Instant Import from GSC)**:
  - Select **Import from Google Search Console**.
  - Authorize access to automatically import verified domains and sitemaps.
- **Option 2 (Meta Tag Verification)**:
  - Choose manual URL addition: `https://ingresswithin.com`.
  - Copy the Bing verification token (from `<meta name="msvalidate.01" content="..." />`).
  - Set the environment variable in production hosting:
    - **Key**: `BING_SITE_VERIFICATION`
    - **Value**: `your_bing_token`
  - Redeploy and click **Verify** in Bing Webmaster Tools.

### Step 3: Submit Sitemap to Bing
1. Navigate to **Sitemaps** in the Bing dashboard.
2. Submit:
   ```text
   https://ingresswithin.com/sitemap.xml
   ```
3. Monitor crawl stats and indexation status in the dashboard.

---

## 3. Post-Verification Monitoring & Maintenance

### 1. Index Coverage & Page Indexing Reports
- Check GSC **Pages** report weekly for:
  - Zero unintended `404` errors.
  - Zero Soft 404s.
  - Correct canonical attribution ("Google chose same canonical as user").
  - Clean `noindex` attribution on private paths (`/dashboard`, `/onboarding`, `/write`, `/api`).

### 2. Structured Data / Enhancements Report
- Check GSC **Enhancements** tab to confirm valid detection of:
  - **FAQ** Rich Snippets (8 FAQ schemas across public views).
  - Organization and WebSite markup.

### 3. Core Web Vitals & Page Experience
- Review **Page Experience** and **Core Web Vitals** reports in GSC.
- Verify Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP) remain in the "Good" range.

---

## 4. Important Product Positioning Rules
- **Non-Clinical Guarantee**: Ingress Within is positioned strictly as a self-reflection, guided journaling, self-understanding, and emotional awareness platform.
- **Forbidden Claims**: Never submit schema, titles, or descriptions claiming medical treatment, mental illness therapy, diagnosis, clinical intervention, or "AI therapist" capabilities.
