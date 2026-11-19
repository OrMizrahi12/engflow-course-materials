# Issue #69: Release only after smoke tests pass (re-scope comment)

**Read against Vercel's docs (2026-11-19), and what changes.**

What the docs say:
- [Deployment Checks](https://vercel.com/docs/deployment-checks) never name a plan. The [changelog](https://vercel.com/changelog/block-vercel-deployment-promotions-with-github-actions) says only "available for all projects connected to GitHub repositories".
- The checks hold a deployment "before assigning it to your custom production domains". Potluck has no custom domain, only its `*.vercel.app` production address, and the docs don't say whether that address is held too.
- They require auto-assignment of production domains to be on.
- A smoke test on the deploy's own generated URL meets Standard Protection, which puts that URL behind Vercel sign-in. Reaching it needs the "Protection Bypass for Automation" secret ([included on Hobby](https://vercel.com/docs/deployment-protection/usage-and-pricing)).
- Force Promote bypasses the checks.

**Decision: no bypass secret for now, so no deployment check yet.** Instead:
- After each production deploy succeeds (Vercel's `repository_dispatch`, [`vercel.deployment.success`](https://vercel.com/docs/git/vercel-for-github#repository-dispatch-events), with `environment` = production), a workflow waits until the public production address reports that commit in `/api/health`.
- It then runs the read-only smoke there: the home page renders, `/api/health` reaches the database with the schema current, and a made-up `/g/<token>` shows "No group at this link".
- It reports a status on the commit.
- The demo-group check waits for launch day.
- Switching on repository dispatch is the operator's step.

What this gives up: the smoke runs on what's already released, so a failure no longer holds the production address. It reports, and a person rolls back (`vercel rollback`).

Needs: `/api/health` must report the commit it was built from. #65 doesn't list that yet.

Proposed acceptance criteria, replacing the current ones:
- [ ] A production deploy's commit gets a smoke status once the production address reports that commit. If the address never reports it within a set time, the status fails and says so.
- [ ] A smoke failure on a released commit shows as a failed status on that commit.
- [ ] No Vercel token and no bypass secret.
- [ ] The demo-group check is added on launch day (#71).
