# Vercel settings, bypass header, and rollback commands

All commands run from your `potluck` clone. Never print the raw output of `vercel api /v9/projects/<name>`: it contains your
project's Protection Bypass for Automation secret. Always filter reads through `jq` and pass `--silent` on writes.

## 1. Check and enable Vercel repository dispatch

```bash
# Read only gitProviderOptions (never prints secrets)
npx vercel@65.5.0 api /v9/projects/<your-project> 2>/dev/null | jq -c .gitProviderOptions

# Enable repository dispatch silently
echo '{"gitProviderOptions":{"disableRepositoryDispatchEvents":false}}' | \
  npx vercel@65.5.0 api /v9/projects/<your-project> -X PATCH --input - --silent

# Confirm disableRepositoryDispatchEvents is now false
npx vercel@65.5.0 api /v9/projects/<your-project> 2>/dev/null | jq -c .gitProviderOptions
```

## 2. Reach a protected preview deployment with `vercel curl`

```bash
id=dpl_$(gh api repos/{owner}/{repo}/commits/<commit-sha>/status \
  --jq '.statuses[] | select(.context=="Vercel") | .target_url | split("/") | last')

# Raw curl returns 302 (redirect to Vercel sign-in under Standard Protection)
p=https://$(npx vercel@65.5.0 api /v13/deployments/$id 2>/dev/null | jq -r .url)
curl -s -o /dev/null -w "%{http_code}\n" "$p/api/health"

# vercel curl attaches your project's automation bypass automatically
npx vercel@65.5.0 curl /api/health --deployment $id -- -s 2>/dev/null; echo
```

## 3. Optional: hold the production address before release (Deployment Check + bypass secret)

On camera we chose zero new secrets, so the smoke workflow runs against the public production address right after release on
`vercel.deployment.success`. If you want Vercel to **hold** a production deployment before assigning your production address:

1. Copy your project's existing automation bypass into a GitHub Actions secret blindly (never printed):
   ```bash
   npx vercel@65.5.0 api /v9/projects/<your-project> 2>/dev/null | \
     jq -r '.protectionBypass | to_entries[] | select(.value.scope=="automation-bypass") | .key' | \
     gh secret set VERCEL_AUTOMATION_BYPASS_SECRET
   ```
2. Trigger `.github/workflows/smoke.yml` on `vercel.deployment.ready`, pass the `x-vercel-protection-bypass` header from that
   secret against `client_payload.url`, and report status with `vercel/repository-dispatch/actions/status@v1`.
3. Register the Deployment Check once the workflow has run at least once:
   ```bash
   npx vercel@65.5.0 project checks add <your-project> \
     --check-name "Smoke test" \
     --requires deployment-url \
     --blocks deployment-alias \
     --targets production \
     --timeout 900 \
     --source '{"kind":"git-provider","provider":"github","externalCheckName":"Smoke test"}'
   ```

## 4. Laptop CLI-upload drill (deliberate test of the source check)

```bash
d=$(mktemp -d) && git clone -q --depth 1 https://github.com/<you>/potluck "$d"
url=$(cd "$d" && npx vercel@65.5.0 deploy --prod --skip-domain --yes --project <your-project> 2>/dev/null); echo "exit $?"
npx vercel@65.5.0 inspect "$url" --logs 2>&1 | grep -E 'Running "npm|Refusing|Saw environment|exited with'
rm -rf "$d"
```

## 5. Instant rollback and promote (Vercel Hobby limits)

```bash
# Roll back one release (grep keeps team slug out of terminal history)
npx vercel@65.5.0 rollback <previous-dpl-id> --yes 2>&1 | grep -oE "Success! [a-z0-9-]+ was rolled back"

# Verify live health switches to the previous commit (~5–10 s)
curl -s https://<your-production-address>/api/health; echo

# Promote the fixed or latest deployment back to production (restores auto-assignment)
npx vercel@65.5.0 promote <current-dpl-id> --yes 2>&1 | grep -oE "Success! [a-z0-9-]+ was promoted"
```

**Vercel Hobby rollback limits (checked November 2026):**
- **One release back:** Hobby stores one instant-rollback step. Further back requires merging a revert PR (fix forward).
- **Code only:** database schema, data, environment variables, and project settings do **not** roll back.
- **Auto-assignment pauses:** new merges to `main` stay off the live production address until you run `vercel promote`.
