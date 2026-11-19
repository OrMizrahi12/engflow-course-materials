# Lesson 12.1: What "in production" really means

The lesson's files, as typed and published on camera (Potluck commit `e873988`, tag `lesson-12.1`).

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `prompts/brief.txt` | the brief pasted after `/grill-with-docs` |
| `prompts/answers-round-1.txt` | my answers to round one, Q1 to Q8, as pasted |
| `prompts/answers-round-2.txt` | my answers to round two, Q9 to Q15, and "add incident", as pasted |
| `prompts/dont-skip-the-hook.txt` | my answer when the hook blocked the glossary commit |
| `spec-63.md` | spec #63, production readiness, as published (body) |
| `tickets-64-71.md` | the eight tickets with their labels and "blocked by" links, and what changed on #11, #12, #34, #37 |
| `glossary-running-potluck.md` | the Running Potluck section of `GLOSSARY.md`, as merged |
| `free-plan-limits.md` | what Vercel Hobby, Neon Free, GitHub Actions and Sentry's free plan allow, what happens at each limit, with sources and dates |
| `in-production.md` | the card: six checks, the words, what users must never lose, the free plans' rules, the one-way doors |
| `potluck-at-lesson-12.1.md` | what the tag `lesson-12.1` holds, and how to check it out |

Run it from your `potluck` project (at the tag lesson-11.2, deployed to your own Vercel Hobby project with its Neon database, gh signed in):

```bash
git log --oneline -1                                                              # the last commit and its tag
curl -s https://<your-production-address>/api/health; echo                        # the health route
gh issue list --label ready-for-human                                             # the tickets that wait for a person
claude -w production-readiness                                                    # a fresh session in its own worktree, then /grill-with-docs and the brief
sed -n 1,3p docs/adr/0001-host-on-vercel-hobby.md                                 # the Hobby rule
gh issue view 63 --json body --jq .body | sed -n '/## Plan limits/,/^Nothing/p'   # the limits table
git pull                                                                          # after the PR merged
gh pr list --state merged --limit 1                                               # the merged PR
gh issue list --label ready-for-agent                                             # what an agent can pick up
less -p 'Running Potluck' GLOSSARY.md                                             # the new words
```

Free: Potluck, gh, Vercel Hobby (personal and non-commercial use only), Neon Free, GitHub Actions on a public repository, Sentry free plan and the skills. Not free: a paid Claude plan. The student kit has the steps for Windows (WSL), macOS and Linux, and what the lesson printed.
