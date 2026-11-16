# Lesson 7.3: every line, in order

Everything typed or pasted in the lesson, in the order it happened, with what came back. The first terminal holds Claude Code
(the lesson 7.2 session at the start, then the author session); the second terminal is ours, for checks from outside the
session; a third tab, opened later, holds the fresh test session.

## 1. What every session reads (second terminal)

```bash
clear
git show origin/main:CLAUDE.md
git show origin/main:CLAUDE.md | wc -l
git ls-tree --name-only origin/main .claude/
```

The 19-line `CLAUDE.md`: `## Agent skills`, then Issue tracker, Triage labels (with all five labels), Domain docs, Landing a
change, and one long "Dev server logs" line. Then `19`, then `.claude/settings.json`.

## 2. Close the old session, start a fresh one (first terminal)

The lesson 7.2 session: both pull requests merged and deployed, 179.3k tokens, the footer offering "new task? /clear".

```text
/exit
```

```bash
clear
cd ~/potluck
claude -w verify-skill
```

The header: Claude Code v2.1.325, Opus 5.5, `~/potluck/.claude/worktrees/verify-skill`. Then `/verify` typed and not sent:
the row reads "Try your change and report if it works" (Claude Code's own). Deleted with Backspace.

## 3. /writing-for-agents and P1 (first terminal)

Type `/writing-for-agents`; the menu row: "Writing documents for agents. Use when creating or editing skills, or modifying
AGENTS.md or CLAUDE.md." A space, then paste `prompts/p1-verify-skill.txt`:

```text
Write Potluck's own verify skill in .claude/skills/verify/: how an agent checks a change in the running app and leaves evidence a reviewer can see. Build on what the repo already has: the Playwright setup, the dev server log, and the evidence screenshots #16 committed. Whether the agent can reach it on its own is your call; tell me why. Leave CLAUDE.md for later: I'll test the skill in a fresh session myself. Commit on this branch, don't push.
```

3 minutes 18 seconds. It read the plugin's notes on writing skills, the Playwright config, the create-group test, the dev
script and pull request #16; found no `.data/logs` and nothing on port 3000 in the main checkout; was refused one command
(the session belongs to its worktree); concluded the main checkout is out of date and that #16's agent ran its own server;
installed packages, ran the migrations, started its own server on port 3100, ran both browser tests (passed), stopped the
server, wrote the skill and committed it through the pre-commit hook: `3776bfa`. The report: seven steps, two lessons from
running the flow, and "The agent can reach it on its own (model-invoked)" with three reasons. Context: 77.0k.

## 4. The skill from outside (second terminal)

```bash
cd .claude/worktrees/verify-skill/
git log --oneline -2
cd .claude/skills/verify/
head -4 SKILL.md
grep -n -E '^## |^Done when' SKILL.md
cd -
```

`3776bfa (HEAD -> worktree-verify-skill) Add a verify skill: check a change in the running app, commit evidence` on top of
`ae08090 (tag: lesson-7.2, origin/main, origin/HEAD)`. The frontmatter: `name: verify` and the description. The seven
headings with their done-when lines; steps 5 and 6 have none.

## 5. /writing-for-agents and P2 (first terminal)

`/writing-for-agents`, a space, then paste `prompts/p2-done-whens-and-claude-md.txt`:

```text
Two things. Steps 5 and 6 of the skill end without a done-when: give each one. Then CLAUDE.md. It loads into every session, so every line has to earn that: a context pointer with its leading word up front, nothing the environment or the verify skill already says, and anything only some sessions need behind a pointer. Keep every file it points at reachable. Commit, don't push.
```

2 minutes 56 seconds. Two commits: `7f6326d Give the verify skill's evidence and PR steps a done-when` and `ed24dab Make
CLAUDE.md one context pointer per line`. The report lists the two done-whens, the five pointers, "Leading words", what was
removed, why the verify skill gets no line, the new dev-log wording, and "Decision for you": a sixth line for Next's
`AGENTS.md`. We held it back. Context: 99.6k.

## 6. The new CLAUDE.md from outside (second terminal)

```bash
git log --oneline -3
git diff --stat HEAD~1
cat CLAUDE.md
wc -l CLAUDE.md
```

`CLAUDE.md | 22 +++++-----------------`, `1 file changed, 5 insertions(+), 17 deletions(-)`, the five pointers, `7 CLAUDE.md`.

## 7. Test 1 in a fresh session (third tab)

A new tab in the same worktree, then:

```bash
claude
```

`/verify` typed and not sent: the row now reads "Check a change in the running Potluck app and commit screenshots a reviewer
can see. Use when a change alters what a page shows or does, …". Deleted. Then paste `prompts/tp1-plain-check.txt`:

```text
Check that creating a group and opening its link still works in the running app. Don't commit anything.
```

2 minutes 55 seconds. `Skill(verify)` "Successfully loaded skill" first, unnamed. Its own server on 3100, the existing test,
both runs failed: "The page keeps reloading itself ("24 × navigated to /")", a recompile between page loads in the log, a
plain `curl` triggers none, and with `next dev` run directly the test went green on both with zero recompiles. The report:
it still works on desktop and phone, but the first run through `npm run dev` failed, probably because of the logging wrapper
(a feedback loop it says it hasn't confirmed); nothing committed; its server stopped; it offers to fix the loop in its own
worktree.

## 8. Test 2, same session (third tab)

Paste `prompts/tp2-ticket-route.txt`:

```text
Next I'll hand you #4. Without writing any code, tell me how you'd take it from ticket to merged here, and where the rules for each step live.
```

20 seconds. It read the docs in `docs/agents`, listed the skills and the ADRs, pulled ticket #4, and gave nine steps, each
naming its file: read the ticket (issue tracker doc) and the glossary and ADRs (domain doc); a worktree of its own
(`landing.md`); fix the reload loop first, as its own change; build it test-first; check it in the running app (the verify
skill); open the PR; merge it, by hand, because #4 adds a migration (`landing.md`); confirm the deploy. No Next.js docs.

## 9. File the loop (third tab)

Paste `prompts/p3a-file-the-loop.txt`:

```text
File the reload loop as its own issue, the way docs/agents/issue-tracker.md says, labelled needs-triage. Put in what you saw and the fixes you'd weigh. Keep machine paths and group links out of it.
```

28 seconds. It checked that the label exists, wrote the body, and filed issue #19 ("Dev server reloads the page in a loop
when run through npm run dev", `needs-triage`).

## 10. Add the pointer (first terminal, the author session)

Paste `prompts/p3b-add-the-pointer.txt`:

```text
I tested the new CLAUDE.md in a fresh session: it took #4 from ticket to merge and never reached the Next.js docs, because Claude Code doesn't load AGENTS.md. Add that pointer, leading word first, and commit.
```

32 seconds. A new first line, `**Next.js**: this version breaks from your training. Read AGENTS.md before writing code that
touches Next.`, committed as `960f575 Point CLAUDE.md at AGENTS.md for the Next.js docs`, not pushed.

## 11. Land it (first terminal)

Type `prompts/p4-land.txt`:

```text
Push it and land it the way docs/agents/landing.md says.
```

2 minutes 48 seconds. Up to date with `main`, 2 files, no migration; pushed; body written with the plugin's `pr` skill; pull
request #20 opened; no file under `drizzle/`, so auto-merge queued; a background wait for the required check; merged as
`7c3f5d2`; Vercel's status on the merge commit: pending, then success. Context: 109.0k.

## 12. Main (second terminal)

```bash
git fetch -q
git log --oneline -3 origin/main
git show origin/main:CLAUDE.md | wc -l
git ls-tree --name-only origin/main .claude/skills/
```

```text
7c3f5d2 (origin/main, origin/HEAD) Merge pull request #20 from OrMizrahi12/worktree-verify-skill
960f575 (HEAD -> worktree-verify-skill, origin/worktree-verify-skill) Point CLAUDE.md at AGENTS.md for the Next.js docs
ed24dab Make CLAUDE.md one context pointer per line
8
.claude/skills/verify
```
