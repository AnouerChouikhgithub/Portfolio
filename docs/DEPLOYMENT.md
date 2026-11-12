# Deployment Guide

The portfolio is hosted on **Netlify** with a serverless function for the contact form.

## Site configuration

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Functions directory | `netlify/functions` |
| Node version | 18+ (set via Netlify UI → Environment → `NODE_VERSION` if needed) |

`netlify.toml` already contains this configuration, plus dev-server settings for `netlify dev`.

## First-time deploy (Git-based, recommended)

1. Push the repository to GitHub (`AnouerChouikhgithub/Portfolio`).
2. In Netlify: **Add new site → Import an existing project → GitHub** and pick the repo.
3. Netlify reads `netlify.toml` — confirm build command `npm run build` and publish dir `dist`.
4. Deploy. Every push to `main` now triggers an automatic build & deploy; pull requests get deploy previews.

## Environment variables

Set these in **Site configuration → Environment variables** (all four are required by the contact function):

```
EMAILJS_SERVICE_ID
EMAILJS_TEMPLATE_ID
EMAILJS_PUBLIC_KEY
EMAILJS_PRIVATE_KEY
```

After adding or changing them, trigger **Deploys → Trigger deploy → Clear cache and deploy site** so the function picks them up.

> `EMAILJS_PRIVATE_KEY` is the EmailJS *access token*. It lives only in the serverless function — never prefix it with `VITE_` and never import it in client code.

## Deploying with the CLI (alternative)

```bash
npm install          # once
npx netlify deploy --build --prod          # production
npx netlify deploy --build                 # draft / preview URL
```

## Local function testing

```bash
npx netlify dev      # serves the site + functions at http://localhost:8888
```

`npm run dev` alone (plain Vite) has **no function runtime** — `/api/contact` will return 500.

## Custom domain

1. **Domain management → Add a domain** → follow the DNS instructions (Netlify DNS or external provider with a CNAME).
2. Enable **HTTPS → Verify DNS → Provision certificate** (Let's Encrypt, automatic renewal).
3. Update the canonical + hreflang URLs in `index.html` if the domain differs from `chouikh-anouer.netlify.app`.

## Function logs

**Functions → contact → Function log** (or `npx netlify functions:log`) shows validation failures and EmailJS errors. The client never receives stack traces — only generic error messages.
