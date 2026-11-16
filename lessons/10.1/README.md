# Student kit: Lesson 10.1, Day one in Spliit

Module 10 leaves Potluck for a while and works on code nobody on our side wrote: Spliit, a real open-source app for
splitting expenses (MIT, by Sebastien Castiel and contributors). This lesson is day one with it. We make a private copy that
cannot reach the original: a plain clone, pinned to one commit, with its `origin` removed, pushed into a new private
repository of our own. Their automation came along with the code, so we switch off the three workflows that are theirs and
keep CI. Then we run it the way its README says, against our own Postgres: install (which builds the database), all 498
tests, the dev server, one group and one expense in the browser. Last, Claude Code comes in: the one-time setup for the
engineering skills, and `/grill-with-docs` pulls a glossary and four decision records out of the code, each record naming
where its reason came from. We compare its words with Potluck's, and commit the docs to our copy.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `comparison.md` | the comparison of Spliit's glossary with Potluck's, as Claude showed it, in our words |
| `day-one-in-a-codebase.md` | the card: someone else's code, day one, from the copy to the glossary; it's working if |
| `spliit/CLAUDE.md` | the agent-skills block the setup wrote (issue tracker, triage labels, domain docs) |
| `spliit/docs/agents/issue-tracker.md`, `spliit/docs/agents/triage-labels.md`, `spliit/docs/agents/domain.md` | the three config files the setup wrote |
| `spliit/GLOSSARY.md` | the glossary `/grill-with-docs` wrote over two rounds of questions |
| `spliit/docs/adr/0001-no-accounts-link-is-access.md` ... `0004-scheduled-group-deletion.md` | the four decision records, each with the source of its reason |
| `spliit/LICENSE` | Spliit's MIT license, which covers its code and comes with every copy |

The files under `spliit/` are exactly what the docs commit (`4e4d83b`, "Add domain glossary, ADRs and agent-skill config")
held on camera. The issue-tracker file names the account the copy was made under; yours will name your own.

## Before you start

- A paid Claude plan and Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.325),
  in auto mode. In default mode you approve each command as it comes.
- `git`, the GitHub CLI `gh` signed in to your account, Node 24 or newer, and a local PostgreSQL server (we set ours up in
  lesson 6.1; Spliit's README also offers `./scripts/start-local-db.sh` if you have none).
- Chrome or any browser.
- Your Potluck repository from earlier modules, for the comparison at the end (`~/potluck/GLOSSARY.md`).

Free: Spliit, git, `gh`, Node, PostgreSQL, a private GitHub repository and GitHub Actions minutes within your account's free
allowance. Not free: the Claude plan.

## The steps, as on camera (Ubuntu)

**1. What it says about itself.** In a shell:

```bash
clear
gh repo view spliit-app/spliit --json description,stargazerCount,licenseInfo,issues | jq
```

"Free and Open Source Alternative to Splitwise", 183 open issues, the MIT License, 3,065 stars (on the day we recorded).

**2. A copy of the code, pinned.** A plain clone, never a fork: a fork on GitHub stays linked to its parent.

```bash
git clone https://github.com/spliit-app/spliit.git
cd spliit
git log --oneline -1
git reset --hard 73478ed
```

The clone took about six seconds. The newest commit was `f293974` "Feat: add yearly expense (#680)"; theirs keeps moving,
so we pin: `HEAD is now at 73478ed Support more currencies via the Frankfurter v2 API (#449) (#679)`. Every lesson in this
module works on that commit.

**3. Cut the line back.**

```bash
git remote -v
git remote remove origin
git remote -v
```

The first list shows `origin` pointing at spliit-app/spliit for fetch and push. After the removal, nothing: tools that read
the remote (`gh`, Claude Code) can no longer pick their repository by accident.

**4. A home of our own.** Check the line before you press Enter; it runs once.

```bash
gh repo create spliit --private --source . --push
gh repo view --json nameWithOwner,visibility,isFork
```

Created repository, Added remote (the new `origin` is yours), Pushed commits. Then `"visibility": "PRIVATE"` and
`"isFork": false`: a standalone copy with no parent to send a pull request to.

**5. Their automation.**

```bash
ls .github/workflows
gh run list --limit 5
gh workflow list
for w in cd e2e perf; do gh workflow disable $w.yml; done
gh workflow list --all
gh pr list
```

Four workflow files: `cd.yml`, `ci.yml`, `e2e.yml`, `perf.yml`. They started on your push: CI on two pull requests and three
Dependabot runs. `cd` publishes a release image on every tag (into your account's package registry), `e2e` runs their
browser tests and `perf` is a benchmark that also runs on a weekly schedule. Those three are theirs, so they're disabled (a
repository setting: the code doesn't change). The list then says `disabled_manually` three times, and CI stays `active`:
it runs their types, lint and tests on everything you push. Dependabot had already opened two pull requests on the copy;
they can only land there, so we left them alone.

**6. The README's steps.**

```bash
clear
grep -A6 "## Run locally" README.md
node -v
pg_lsclusters
```

Five steps: clone (done), start a PostgreSQL server, copy `.env.example` to `.env`, `npm install` (which also applies the
database migrations), `npm run dev`. Node printed `v24.22.2`; `pg_lsclusters` showed `18 main 5432 online`.

**7. A database and a `.env`.**

```bash
createdb spliit
cp .env.example .env
head -2 .env
sed -i "s#postgres:1234@localhost#$USER@localhost/spliit?host=/var/run/postgresql#" .env
head -2 .env
```

Their example points at a user `postgres` with the password `1234`. Our Postgres trusts the local user through its
socket, so the `sed` swaps in our user, the `spliit` database and the socket folder. On camera the user name was typed
out; `$USER` does the same for you. If your Postgres uses a password instead, keep their form and put in your own user,
password and database: `postgresql://USER:PASSWORD@localhost/spliit`.

**8. Install, which builds the database.**

```bash
npm install
psql spliit -c '\dt'
```

About half a minute: 749 packages in 22 seconds, and npm reported 31 vulnerabilities (1 critical) in their dependency tree
at that commit; a job for later. The `postinstall` script runs `prisma migrate deploy` (27 migrations, from
`20231205211834_create_models` on) and `prisma generate`. Nine tables, among them Participant, ExpensePaidFor and
RecurringExpenseLink.

**9. Their tests.** Before you press Enter: how many do you expect to pass?

```bash
npm test
```

Every test file runs twice, in Pacific/Auckland and America/Los_Angeles. Test Suites: 42 passed, 42 total. Tests: 498
passed, 498 total. A clean starting line: a test that fails later failed because of us.

**10. Run it.**

```bash
npm run dev
```

Ready in 188 ms, on `http://localhost:3000`. In the browser: "Go to groups", then create a group "Ski weekend" in US dollars
with the three participants the form offers (John, Jane, Jack). Add an expense: "Lift passes", 90, paid by John, paid for
everyone (30 each). Note the "This is a reimbursement" checkbox under the amount. Balances: John +60, Jane -30, Jack -30, and
the suggested reimbursements: Jane owes John 30, Jack owes John 30. Back in the shell, Ctrl+C stops the server.

**11. Claude Code comes in.**

```bash
clear
claude -n spliit-docs
```

The folder is new to Claude Code, so it asks whether you trust it; the safe answer sits on top. We moved down to "Yes, I
trust this folder": it's a well-known open-source project and we had just run its tests. Then pick
`/setup-matt-pocock-skills` from the menu (`/mattpocock-skills:setup-matt-pocock-skills`) and press Enter. It looks at the
remote, the docs and its templates, then asks in a form with three tabs: Tracker (GitHub), Labels (keep the five default
triage labels; `wontfix` already exists) and Agent file (`CLAUDE.md`). Submit, then "Write it" when it asks before touching
anything. It wrote `CLAUDE.md` and three files under `docs/agents/`, created `needs-triage`, `needs-info`,
`ready-for-agent` and `ready-for-human` on GitHub, checked them with `gh label list`, and committed nothing.

**12. The interview.** Pick `/grill-with-docs` from the menu, a space, and:

```text
help me document this repo
```

It loaded the grilling and domain-modeling skills, read their formats and then the code (balances, shares, group deletion,
recurrence in `src/lib`, and the app's English text). Round one, after 36 seconds: six questions, each with a recommended
answer (scope; the two meanings of "reimbursement"; participant and active user; share and split value; the sign of a
balance; scheduled deletion). Our answer, typed:

```text
Yes to all six. Document what's here, rename nothing.
```

It wrote `GLOSSARY.md` right away (59 lines) and asked round two: recurring expense and frame, income, the currency words,
the groups kept only in this browser, category, activity and document, and four decisions worth a record. Our answer,
pasted (it's in `prompts.md`): yes to seven to eleven, write all four records, and in each one say where the reason comes
from, or say that none was found. The turn took 1 min 8 s: it updated the glossary, read the commits and the original
project's pull request #263 and issues #76, #257, #478 and #614 (reading only, nothing posted), wrote the four records, and
corrected one of them. ADR-0001 (no accounts) has no recorded reason; 0002 cites PR #263, 0003 PR #562 and the comments in
`shares.ts`, 0004 PR #420 (and says nothing records why the grace period is 30 days).

**13. Two glossaries.** Paste the comparison prompt from `prompts.md`. Twelve seconds later, a table: five of Spliit's ideas
have different words in Potluck, and one word, Participant, means different things in the two (see `comparison.md`).
It changed nothing, because we said rename nothing.

**14. Commit and look.**

```text
Good. Commit everything on main and push it to our copy.
```

Eight seconds: one commit on `main`, pushed, holding `CLAUDE.md`, the glossary, the four records and the three config files.
On GitHub the glossary renders, and ADR-0001 says "Source of the reason: none recorded". The commit names two authors: you
and Claude, which Claude Code adds as a co-author on the commits it makes. Last, in a new terminal tab:

```bash
clear
git log --oneline -2
gh label list
gh run list --limit 3
```

The docs commit on top of `73478ed`, both on `origin` (yours). Sixteen labels, the four new ones among them. CI ran on the
docs commit and passed.

## Pause and try

On your own copy: clone Spliit, reset to `73478ed`, remove `origin`, `gh repo create` a private repository, disable the three
workflows that aren't yours, run it against your own Postgres and check all 498 tests pass. Then `/setup-matt-pocock-skills`
and `/grill-with-docs`. You're done when `gh repo view` says `"isFork": false`, your `GLOSSARY.md` grows as you answer, and
every decision record names its source, or says none was found.

## Windows, macOS, Linux

- **Windows:** use WSL 2 with Ubuntu and run every command inside it, including Claude Code. Install PostgreSQL inside WSL
  (`sudo apt install postgresql`); the socket form of the `sed` in step 7 works there as on camera. Open
  `http://localhost:3000` in your Windows browser.
- **macOS:** Homebrew's PostgreSQL (`brew install postgresql@18`, then `brew services start postgresql@18`) trusts your user
  locally, so the same `sed` works if you change the host to its socket folder (`/tmp`), or use
  `postgresql://$USER@localhost/spliit`. `pg_lsclusters` is Debian-only; `brew services list` shows the server instead.
- **Linux:** as on camera. On Debian and Ubuntu, create a database role for your user once if you have none
  (`sudo -u postgres createuser --createdb $USER`).

## Credits

Spliit is open source under the MIT License, by Sebastien Castiel and contributors (github.com/spliit-app/spliit); the copy
in this lesson is our own, pinned at `73478ed`, and nothing in it was sent to their repository. The `setup-matt-pocock-skills`,
`grill-with-docs`, `grilling` and `domain-modeling` skills are from mattpocock/skills by Matt Pocock (MIT License), described
here in our own words. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock or by
Spliit's authors.
