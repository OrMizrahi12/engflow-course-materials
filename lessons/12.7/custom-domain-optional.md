# Optional step: attaching a custom domain on Vercel Hobby

Potluck launches on Vercel's free `*.vercel.app` address so you can complete the entire course at zero hosting cost. If you already own a domain (or buy one from a registrar), Vercel Hobby supports up to **50 custom domains per project** with automatic Let's Encrypt HTTPS certificates.

> **Plan reminder:** Adding a custom domain does not change Vercel Hobby's license terms. Hobby remains for **personal, non-commercial use only** (ADR 0001). A commercial or paid product requires Vercel Pro.

## 1. Add the domain in Vercel

1. Open your Vercel project → **Settings → Domains**.
2. Enter your domain (e.g. `potluck.example.com` for a subdomain, or `example.com` for an apex domain) and click **Add**.
3. Copy the exact DNS record Vercel displays:
   - **Subdomain** (recommended, e.g. `potluck.example.com`): a `CNAME` record pointing to the Vercel target shown in the dashboard (commonly `cname.vercel-dns.com.` or a project-specific target).
   - **Apex domain** (e.g. `example.com`): an `A` record pointing to the IP address Vercel specifies (commonly `76.76.21.21` or the current IP shown in Settings → Domains).

## 2. Create the DNS record at your registrar

1. Log in to your DNS provider (Cloudflare, Namecheap, Route 53, Porkbun, etc.).
2. Add the `CNAME` or `A` record exactly as shown in Vercel. If using Cloudflare, set Proxy status to **DNS only** while Vercel verifies and issues the TLS certificate.
3. Wait for DNS propagation (usually 1–10 minutes) until Vercel shows **Valid Configuration** and HTTPS is active.

## 3. Update your app references & checks

1. Verify HTTPS and your endpoints:
   ```bash
   curl -sI https://potluck.example.com/ | head -n 10
   curl -s https://potluck.example.com/api/health; echo
   curl -s -o /dev/null -w 'HTTP %{http_code}\n' https://potluck.example.com/api/live
   ```
2. Update the production URL in:
   - `README.md` (`## Live` section)
   - `.github/workflows/health.yml` (hourly health-check URL)
   - Sentry Uptime monitor (`Potluck liveness` target URL)
   - `scripts/smoke-production.mjs` (if a canonical host is configured)
3. Open a small PR for the repo changes, confirm CI and `Smoke test: success` pass, and merge cleanly.

## Official reference (checked November 20, 2026)

- Adding and configuring a custom domain on Vercel: https://vercel.com/docs/domains/working-with-domains/add-a-domain
- Vercel Hobby plan limits: https://vercel.com/docs/plans/hobby
