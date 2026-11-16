# Lesson 10.1: every line typed or pasted, in order

Shell lines are in `bash` blocks; lines sent to Claude Code are in `text` blocks. "Pasted" means the line was pasted whole.

## In the shell

```bash
clear
gh repo view spliit-app/spliit --json description,stargazerCount,licenseInfo,issues | jq   # pasted
clear
git clone https://github.com/spliit-app/spliit.git                                       # pasted; about 6 s
cd spliit                                                                                # typed "cd spl", then Tab
git log --oneline -1                     # f293974 Feat: add yearly expense (#680)
git reset --hard 73478ed                 # HEAD is now at 73478ed Support more currencies ... (#679)
git remote -v                            # origin = spliit-app/spliit, fetch and push
git remote remove origin
git remote -v                            # nothing
clear
gh repo create spliit --private --source . --push
gh repo view --json nameWithOwner,visibility,isFork                                      # pasted; PRIVATE, isFork false
clear
ls .github/workflows                     # cd.yml ci.yml e2e.yml perf.yml
gh run list --limit 5                    # CI on 2 pull requests, 3 Dependabot runs
gh workflow list
for w in cd e2e perf; do gh workflow disable $w.yml; done                                # pasted
gh workflow list --all                   # three disabled_manually, CI active
gh pr list                               # two Dependabot pull requests on the copy
clear
grep -A6 "## Run locally" README.md
node -v                                  # v24.22.2
pg_lsclusters                            # 18 main 5432 online
createdb spliit
cp .env.example .env
head -2 .env                             # postgres:1234@localhost
sed -i "s#postgres:1234@localhost#$USER@localhost/spliit?host=/var/run/postgresql#" .env  # pasted (on camera the user name was written out)
head -2 .env                             # our user, the spliit database, the socket folder
clear
npm install                              # 749 packages in 22 s; 27 migrations applied
clear
psql spliit -c '\dt'                     # 9 rows
clear
npm test                                 # 42 suites, 498 tests passed
clear
npm run dev                              # Ready in 188ms, http://localhost:3000
```

In the browser: `localhost:3000`, Go to groups, Create: "Ski weekend", US dollar, John / Jane / Jack, Create. Add an
expense: "Lift passes", 90, paid by John, paid for all three, Create. Then the Balances tab.

```bash
# Ctrl+C stops the dev server
clear
claude -n spliit-docs                    # trust question: Down to "Yes, I trust this folder", Enter
```

## In Claude Code

```text
/setup-matt-pocock-skills
```

Picked from the menu (`/mattpocock-skills:setup-matt-pocock-skills`), then answered in its form: Tracker: GitHub
(Recommended). Labels: Yes (Recommended). Agent file: CLAUDE.md. Submit. Then "Write it (Recommended)".

```text
/grill-with-docs help me document this repo
```

Picked from the menu (`/mattpocock-skills:grill-with-docs`), a space, then the request. Round one came back with six
questions. Typed:

```text
Yes to all six. Document what's here, rename nothing.
```

Round two came back with questions seven to twelve. Pasted:

```text
Yes to Q7 to Q11. Write all four ADRs, and in each one say where the reason comes from (a commit, a PR or a code comment), because we didn't make these decisions. If you can't find a recorded reason, say so.
```

Pasted:

```text
That's everything. Before we commit: compare this glossary with Potluck's, in ~/potluck/GLOSSARY.md. Which ideas are the same under a different word, and which word means something different in each? One short table.
```

Typed:

```text
Good. Commit everything on main and push it to our copy.
```

## In a new terminal tab

```bash
clear
git log --oneline -2                     # 4e4d83b (our docs commit) on 73478ed
gh label list                            # 16 labels, needs-triage and ready-for-agent among them
gh run list --limit 3                    # CI on the docs commit: passed
```
