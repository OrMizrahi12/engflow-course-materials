# Release v0.1.0 (on `1f60b51`)

## What you'll notice

Nothing changes for people using Potluck. Groups, links, expenses and settlements work as before. Everything in this release makes changes to Potluck safer to ship.

## What only we notice

**Migrations can't be silently skipped** (#76, #73). Drizzle skips a migration older than the newest one already applied and still reports success. Every build now checks that each migration in the journal was applied, and fails naming any that wasn't. A test catches an out-of-order journal at PR time. Before a production build migrates, it prints the restore point (LSN and time) and the Neon step to restore to it. Restoring stays a person's call.

**`app_info` is gone** (#77, #78; #74, #75). It was the walking skeleton's leftover table. #77 stopped using it, and #78 dropped it once production served #77. This is Potluck's first expand–contract: the first migration that removes rather than adds.

**Production deploys only from `main`** (#80, #79). A production build must have been triggered by GitHub from this repo's `main`, and the checkout's `HEAD` must match the commit Vercel reports. Otherwise it stops before it touches the database. A CLI upload from a laptop is refused, and so is another branch or a promoted preview. This stops mistakes, not a deliberately faked build.

**Every release is smoke-tested** (#81, #82; #69). After a production deploy, a workflow waits until https://potluck-zeta.vercel.app reports that commit in `/api/health`. It then checks that the home page renders and that a made-up group link shows "No group at this link", and reports a "Smoke test" status on the commit. A failure doesn't hold the release back; a person runs `vercel rollback`. `/api/health` now also reports the commit it was built from. #82 fixed the status step, which had died on a quote in its message. The database and schema checks come with #65, and the demo-group check comes at launch (#71).

**Merged since `lesson-12.1`:** #76, #77, #78, #80, #81, #82.
