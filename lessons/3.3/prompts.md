# Prompts (Lesson 3.3)

Every line typed or pasted in the lesson, in order. Use your own words; these are the ones from camera.

## In the lesson terminal (reading the skill)

The terminal was still in the setup skill's folder from lesson 3.2
(`~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/setup-matt-pocock-skills`).

```bash
cd ../grill-with-docs
ls
cat SKILL.md
cd ../domain-modeling
ls
cat SKILL.md
```

`ls` showed `SKILL.md` and an `agents` folder (a small settings file for other agent tools) in `grill-with-docs`, and
`ADR-FORMAT.md`, `GLOSSARY-FORMAT.md`, `SKILL.md` and the same `agents` folder in `domain-modeling`.

## In the planning session (Claude Code, `~/potluck`)

**The command and its opening line** (`/grill-with-docs` typed and picked from the menu; the line after it was written
beforehand and pasted):

```text
/grill-with-docs Two things before the spec: the words and the stack. Pin down the words we use for the money (expense, share, balance, settlement, payment), then decide where Potluck runs and how a change gets to production. My leaning: Next.js on Vercel's free plan, Postgres on Neon's free plan. The odd cent stays parked.
```

Came back: two Skill lines (`grilling`, then `domain-modeling`, each "Successfully loaded skill"), a background agent
("Research Vercel Hobby and Neon free limits"), round one on the words (Q1 Expense to Q6 Suggested settlement, with one
clash: settlement versus payment), then, when the agent reported, the stack questions in the same round (Q7 Hosting to
Q14 the address).

**Answers to round one** (written beforehand, one line by number, pasted):

```text
1 Yes. 2 Yes. 3 Yes. 4 Yes. 5 Yes: settlement is the word, payment is out. 6 Yes. Add group and member now too. 7 Yes. 8 Yes. 9 Yes. 10 Yes. 11 No: each pull request gets its own copy, made from a seeded development branch and deleted after merge. Never production data. I tried that setup on the free plans. 12 Yes, and under a lock, so two builds never migrate at once. 13 Yes for now: real backups come before launch. 14 Yes.
```

Came back: `Write(GLOSSARY.md)` (43 lines), ADRs `0001-host-on-vercel-hobby.md` and `0002-postgres-on-neon-free.md`,
nothing committed, and round two (Q15 to Q21).

**Answers to round two** (written beforehand, pasted; it ends with the wrap-up line from lesson 3.1):

```text
15 Yes, and development becomes the database's default branch, since that is what the integration copies. 16 Yes. 17 Yes. 18 No: Postgres 18 installed on my machine, same seed script. 19 Yes. 20 Yes. 21 Yes to 0003. No to 0004: we can change that rule any day, so it goes in the spec. Tests run on PGlite, Playwright from the first page, npm and Node 24. Now wrap up: ask only what is still open for the first version.
```

Came back: ADR `0003-per-pr-database-copies.md`, a second background agent ("Verify Neon/Vercel/PGlite version facts"),
then round three: Q22 moves production to Neon's root branch (a fact that changed an earlier answer), Q23 to Q25.

**Answer to round three** (typed):

```text
Yes to all four. Update ADR 0003, then sum up.
```

Came back: ADR 0003 rewritten (production on the root branch) and the summary: the words, where Potluck runs (ADRs 0001
to 0003), how a change reaches production (for the spec), other settings, and "Still parked": the odd cent and real
backups.

**The license and the commit** (typed):

```text
Yes. Add an MIT license, then commit it all.
```

Came back: `LICENSE` added, one commit `3b3ad78` "Add glossary, stack ADRs and MIT license", nothing pushed.

**The push** (typed, after looking over the commit):

```text
Push it.
```

Came back: `12deed8..3b3ad78 main -> main`; local `main` matches GitHub.

## In the lesson terminal (the files on disk)

```bash
cd ~/potluck
ls
cat GLOSSARY.md
git status
ls docs/adr
cat docs/adr/0001-host-on-vercel-hobby.md
cat docs/adr/0003-per-pr-database-copies.md
```

## In the browser

- `https://github.com/<your-account>/potluck`: refresh the repository page; three new entries (`docs`, `GLOSSARY.md`,
  `LICENSE`) and an "MIT license" tab next to the README.
- Click `GLOSSARY.md`: GitHub renders it.

The `grill-with-docs`, `grilling` and `domain-modeling` skills are from [mattpocock/skills](https://github.com/mattpocock/skills)
by Matt Pocock (MIT License). This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.
