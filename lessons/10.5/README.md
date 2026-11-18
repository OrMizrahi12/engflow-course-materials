# Student kit: Lesson 10.5, /improve-codebase-architecture

An architecture review of a codebase none of us wrote. In a fresh Claude Code session inside our standalone copy of Spliit,
one command with one sentence and no direction: the git history picks where to look, an Explore sub-agent walks those files,
and an HTML report opens in the browser with seven ideas for where the code could be deeper, each with a before and an after
and a strength badge. I check its hot spots with my own git command, we read the report in the words of the `codebase-design`
skill (module, interface, depth, seam, adapter, leverage, locality), then I pick the top candidate and answer two grilling
rounds until only the interface is left open. No code changes: `git status` is clean at the end.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `improve-codebase-architecture.md` | the card: what goes in and out, the two filters, the report, when to run it and when not, one candidate per session |
| `codebase-design.md` | the card for the vocabulary the report uses: the words, the deletion test, one adapter vs two, the interface as the test surface |
| `spliit/hotspots.sh` | my own check of the hot spots: the commit count and the 18-month count, with the output on camera |
| `spliit/architecture-review-20261117-035238.html` | the report as the session wrote it (open it in a browser; Tailwind and Mermaid load from their CDNs) |
| `spliit/turn1-reply.md` | the session's reply in the terminal after the report: the hot spots, the seven candidates in short, the question |
| `spliit/grilling-rounds.md` | my pick, round 1 (Q1 to Q7), my answer, round 2 (Q8 to Q13), my answer, as printed |
| `spliit/summary.md` | the summary it wrote at the end: what is decided and what is still open |

The report is our analysis of Spliit's code (MIT License). Your own run will differ: other wording, maybe other candidates,
other numbers if you run it on a later day. What should match is the shape: hot spots from the history, the skill's words on
every card, a strength badge each, and a stop with one question.

## Before you start

- Your standalone copy of Spliit from lessons 10.1 to 10.4 (a private repository of your own, **not a fork**), or any project
  of your own with a real git history. On camera: `main` at the commit lesson 10.4 left (`59c41d7`), working tree clean.
- A paid Claude plan and Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.326,
  Opus 5.5), in auto mode. In default mode you approve each command as it comes; every command in this lesson only reads.
- `git` and a browser. The report opens itself with your system's default opener (`xdg-open` on Linux, `open` on macOS).

Free: Spliit, `git`, the skills, the CDNs the report loads. Not free: the Claude plan. This lesson is four turns in one
session; the first one runs a sub-agent and took 3 minutes 41 seconds on camera, and the session ended near 89k tokens of
context. That fits in one session, but the first turn is a noticeable share of an allowance.

## Windows (WSL), macOS, Linux

- **Linux:** nothing extra. The report opens in your default browser.
- **macOS:** nothing extra; the report opens with `open`.
- **Windows (WSL, Ubuntu):** run Claude Code inside WSL. If the report doesn't open by itself, ask the session for the file's
  path, then open it from Windows: `explorer.exe .` in that folder, or paste the path under `\\wsl$\Ubuntu\` into your browser.

## The steps, as on camera (Ubuntu)

**1. A fresh session.** In a new terminal tab inside the Spliit folder:

```bash
claude -n spliit-architecture
```

Fresh, because the skill works on one candidate per session, and an older session is full of other work. The header shows
the model and the folder.

**2. The command.** Type `/improve-codebase-architecture`, take `/mattpocock-skills:improve-codebase-architecture` from the
menu ("Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you
pick."), then one sentence after it:

```
/mattpocock-skills:improve-codebase-architecture We're new here: let the git history pick the hot spots.
```

No module and no pain point on purpose: a named direction is taken as is, and the history step is skipped.

**3. What it does** ("Crunched for 3m 41s" on camera). It loads the `codebase-design` skill first (the words the report must
use), runs one git command that counts the commits (427) and lists the files changed most in the last 18 months (translations,
the lock file and other JSON left out), reads the glossary and the decision records, and sends an **Explore** sub-agent
through those files in the background ("I've sent an exploration agent through the files git history points to ...").
After 1 minute 48 seconds the agent reports back. It checks a few lines in `schemas.ts` and `api.ts` itself, writes the
report as one HTML file in its scratch folder, outside the repository, and opens it.

**4. The report** (`spliit/architecture-review-20261117-035238.html`). I zoomed the page to 175 %. The header: "spliit: where to
deepen", "scope chosen from 18 months of git history", and the hot spots: `expense-form.tsx` 24 commits, `api.ts` 9,
`currency.ts` 8, `group-form.tsx` 7, the CSV export 7, `schemas.ts` 6. The legend: a plain box is a module, a dashed line a
seam, a red line a leak, a dark box a deep module. Then seven candidates:

| # | Candidate | Badge | Its win, in the skill's words |
|---|---|---|---|
| 1 | Pull the expense form model out of the 1,524-line component | Strong, in-process | Locality: one place owns all three encodings; the interface is the test surface (Jest, not Playwright) |
| 2 | Split the expense schema: form input vs. stored expense | Strong, in-process | Fixes the 100× amount-limit mismatch (verified: the form accepts up to 1,000,000,000.00, the server rejects over 10,000,000.00) |
| 3 | Give expense writes one module that owns activity, transaction and group scope | Strong, local-substitutable | Tests hit one interface against a real database |
| 4 | Make the recurring-frame pass explicit, once per request | Worth exploring | Keeps decision record 0002 (create on read) |
| 5 | One ledger expense shape for totals, balances, CSV export and the form | Worth exploring | Leverage: one mapping, four callers |
| 6 | A money module: minor units, conversion and the create-expense URL | Worth exploring | Locality: units decided in one place |
| 7 | Per-device state behind one module | Speculative, ports & adapters | Testable with an in-memory adapter |

Top recommendation: candidate 1, with candidate 2 in the same piece of work.

**5. My own check.** In my own shell tab, the commands in `spliit/hotspots.sh`: 427 commits, and the same top line,
`expense-form.tsx` with 24. Two rows in my list aren't in the report, `README.md` (13) and the deploy workflow (12): both
change often and neither is code. Then `api.ts` with 9, as in the report.

**6. The reply in the terminal** (`spliit/turn1-reply.md`). Page up (Shift+PgUp) to where it starts: the hot spots in one line,
the seven candidates in short, the top recommendation again, and the question the skill always ends on: "Which of these would
you like to explore?" It stops there, with nothing changed.

**7. The pick.** Type:

```
Let's explore 1, the expense form model.
```

"Worked for 32s" on camera. It loads the `grilling` skill, reads the form's logic (lines 1 to 627, the preview at `:1163`, the
inline conversion at `:1264`), finds one more fact (`api.ts` takes the form's values as its input type, so the form's output is
also the server's input), and asks round 1: seven numbered questions, each with its recommended answer (Q1 scope compared with
candidate 2, Q2 the shape of the module, Q3 what goes behind the interface, Q4 per-device defaults, Q5 the two currency
conversions, Q6 a strict refactor, Q7 the glossary).

**8. Round 1.** Type:

```
Yes to all seven.
```

"Sautéed for 22s" on camera. It checks facts first instead of asking: what `shares.ts` already exports, how Jest is set up
(every test runs in two time zones), and that a test file already sits in the form's folder. Then round 2: Q8 auto-balancing on
plain data, Q9 the preview without the fake database row, Q10 today's date and the id generator as arguments, Q11 the
conversion-rate message stays in the component ("That's a hypothetical seam."), Q12 the file next to the form, Q13 tracking (an
issue, a branch, one pull request).

**9. Round 2, and a stop.** Paste:

```
Yes to 8 through 12. On 13: not yet. Before any issue, I want to see a few radically different interfaces for this model and pick one, so leave the interface open for now. Sum up what we've decided and what's still open.
```

"Sautéed for 13s" on camera, no tools: "Questions 1–12 are settled. No issue gets filed until you've chosen an interface." Then
the Decided list and Still open: 1, the interface itself; 2, tracking (`spliit/summary.md`). It offers to send three or four
sub-agents to design the interface from different angles. Lesson 10.6 picks that up in the same session.

**10. What changed.** In my own shell: `git status` says "nothing to commit, working tree clean", and `git log --oneline -1` still
shows the commit from lesson 10.4. The report lives in a temp folder and the decisions live in the session.

## Side effects

- One new Claude Code session (`spliit-architecture`), left open for lesson 10.6.
- One HTML file in the session's scratch folder (the report), outside your repository.
- Nothing else: no code, glossary or decision record changes, no issue, no commit. Nothing is filed in Spliit's own repository.

If your session offers to edit the glossary or write a decision record during the grilling, that is part of the skill: it
happens when a new term is named or you reject a candidate for a lasting reason. Ours named no new term.

## Pause and try

On your own copy or your own project: start a fresh session and run `/improve-codebase-architecture` with no direction. Check
its hot spots against the git log command in `spliit/hotspots.sh`. Check that every card speaks of modules, interfaces, seams,
adapters, leverage and locality (not "component", "service" or "boundary"). Make sure it stops and asks which candidate, and
that `git status` stays clean. Then pick one and answer one round. If the report opens unstyled, its CDN scripts were blocked:
ask for inline styles. You're done when you can name your report's top hot spot from your own count, and your answers to round
1 are in the session.

---
Spliit is open source under the MIT License, by Sebastien Castiel and contributors; the report in this kit is our analysis of
its code. The `improve-codebase-architecture`, `codebase-design` and `grilling` skills are from
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License, described here in our own
words. "Deep module" comes from John Ousterhout's *A Philosophy of Software Design* and "seam" from Michael Feathers' *Working
Effectively with Legacy Code*, named as the skill names them. This course is independent: unofficial, and not affiliated with or
endorsed by Matt Pocock or by Spliit's authors.
