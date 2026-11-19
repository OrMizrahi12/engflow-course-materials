# GLOSSARY.md: the Running Potluck section

The section the grilling wrote in `GLOSSARY.md` of the Potluck repository, as merged by PR #72 (commit `e873988`, tag
`lesson-12.1`). Nine words, each with the words to avoid for it. The rest of the glossary is unchanged from lesson 11.2.

## Running Potluck

**Independent**:
Potluck runs, deploys, restores, rolls back and reports its own breakage without the operator's own machine, from its own database and secrets.
_Avoid_: Self-hosted, autonomous, unattended

**Deploy**:
A build of `main` running on production's database, reachable at its own address but not yet at the production address.
_Avoid_: Ship, push, publish

**Smoke test**:
A check run against a deploy, without writing to production data, that must pass before it's released.
_Avoid_: Sanity check, health check (for this step)

**Release**:
The production address moving to a deploy.
_Avoid_: Deploy (for this step), go live, promote

**Rollback**:
A person moving the production address back to the previous release; the database schema stays as it is.
_Avoid_: Revert, undo, restore

**Backup**:
An encrypted copy of production data, kept outside the database so the data can be restored if the database is lost.
_Avoid_: Snapshot, dump, history

**Restore**:
Overwriting production data with an earlier state, whether from the database's own history or from a backup.
_Avoid_: Rollback, recover, undo

**Launch**:
The first time the production address reaches anyone outside the repo.
_Avoid_: Go-live, release, soft launch

**Incident**:
Production failing its users, from the alert until the fix is released and a short note about it is written.
_Avoid_: Outage, downtime, bug
