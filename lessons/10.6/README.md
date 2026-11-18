# Student kit: Lesson 10.6, Design it twice

The interface that lesson 10.5 left open, designed four times at once. In the same Claude Code session inside our standalone
copy of Spliit, one short answer starts four sub-agents in the background, each designing the expense form model's interface
under a different constraint. Claude compares the four on depth, locality and seam placement and recommends a hybrid. I pick it
with my reason, ask whether any rejected design deserves a decision record (none passes the three tests), and have the decision
filed as an issue with the chosen interface, the rejected designs and why, and the tests. I read the filed issue in my own shell.
No code changes: `git status` is clean at the end.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `design-it-twice.md` | the card: when to design twice, the four constraints, how to compare, how to pick, where the reasons go |
| `spliit/designs/a-minimal.md` | design A as its sub-agent returned it: three entry points |
| `spliit/designs/b-flexible.md` | design B: a rules table per split mode |
| `spliit/designs/c-common-caller.md` | design C: a factory bound once, the whole form values in |
| `spliit/designs/d-units-in-types.md` | design D: branded unit types |
| `spliit/comparison-and-recommendation.md` | Claude's reply once all four were back: the four in short, the comparison, the hybrid, the quirks to pin |
| `spliit/adr-three-tests.md` | the answer to my ADR question: each rejected design against the three tests |
| `spliit/issue-18-spec.md` | the body of issue #18 as filed: the spec an agent or a person can build from |
| `spliit/issues-filed.md` | the three issues (#18 to #20) and Claude's reply after filing them |

The designs are our analysis of Spliit's code (MIT License) at commit `59c41d7`. Your run will differ: other designs, other
names, maybe three agents instead of four. What should match is the shape: designs made in parallel under constraints that
really differ, a comparison in the same words for all of them, one pick with a reason, and the reasons written down where the
next person will look.

## Before you start

- The session from lesson 10.5 (`spliit-architecture`), stopped where its summary ended: questions 1 to 12 decided, the interface
  and the tracking still open. On camera it is tab 6, Opus 5.5, its context 88.8k tokens (9 %).
- Your standalone copy of Spliit (a private repository of your own, **not a fork**), `main` at `59c41d7`, working tree clean,
  with GitHub issues on and `gh` signed in. On camera the last issue before this lesson was #17.
- Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.326), in auto mode. In default mode
  you approve the reads and the three `gh issue create` commands one by one.

Free: Spliit, `git`, `gh`, the skills. Not free: the Claude plan. This lesson is three turns. The first runs four sub-agents
side by side ("Baked for 3m 42s" on camera; the sub-agents wrote about 97k tokens between them) and takes the session's context
from 88.8k to 127.6k tokens; it ends near 147k. That fits, but four parallel designs are a noticeable share of an allowance.

## Windows (WSL), macOS, Linux

Nothing differs: everything runs in the terminal. On Windows run Claude Code, `git` and `gh` inside WSL (Ubuntu), in the folder
where your copy of Spliit lives. `less` is there on all three; on macOS and Linux it is preinstalled.

## The steps, as on camera (Ubuntu)

**1. Back to the session.** Tab 6, at the bottom of lesson 10.5's last reply: "Still open: 1. The interface itself", and the
offer: three or four sub-agents, each designing the interface from a deliberately different angle. "Should I start that?" The
dim text in the prompt box is only a suggestion.

**2. Start them.** Type:

```
Yes, start them.
```

It reads the skill's design-it-twice page (`DESIGN-IT-TWICE.md` of `codebase-design`, already loaded in lesson 10.5), sets out
in one line what every design must keep (the decisions from questions 1 to 12), and launches four background sub-agents, all at
once, each with one constraint:

| # | Constraint | Where it comes from |
|---|---|---|
| 1 | **Minimal**: as few entry points as possible | the skill |
| 2 | **Flexible**: built for change, such as a new split mode | the skill |
| 3 | **Most common caller**: easiest for the code that calls it most | the skill |
| 4 | **Units in the types**: the type says whether an amount is in cents or in whole units | Claude's own choice |

The skill's fourth slot is ports and adapters, for a dependency that crosses a seam (a database, a network call). This model
runs entirely in-process, so Claude swapped in a constraint that bites here: the amount units this code mixes up. While they run,
the session is free; each report arrives in its own short turn. The agents finished after 1 min 29 s (flexible), 1 min 42 s
(common caller), 2 min 12 s (minimal) and 2 min 12 s (units). The whole turn: "Baked for 3m 42s".

**3. Four designs and a recommendation** (`spliit/comparison-and-recommendation.md`). Before reading the verdict, guess: will
the winner be the one with the fewest functions? Then:

- **A, Minimal**: three entry points, open, derive and close. Open and close are strong; the middle one is "weaker than it
  looks": it takes a union of seven change types, so the width moved into the union.
- **B, Flexible**: a rules table per split mode, the deepest idea of the four. "Exporting the table is the mistake."
- **C, Most common caller**: the easiest to call, but whole values in hide what each function reads, and its per-participant
  preview goes against question 9.
- **D, Units in the types**: branded values, and the one idea that names the `?amount=` URL ambiguity exactly. Costly for a
  strict refactor.

The comparison on **depth**, **locality** and **seam placement**, then a **hybrid**: open and close from A, one named function
per reaction (from B and C), one render view, B's table kept inside as an internal seam, D's idea applied only at the URL prefill.
About seven functions, absorbing roughly 600 lines. All four designs also found the same three quirks, to pin with tests and
not fix. So no: the winner is not the smallest design, it is a mix.

**4. Pick one, keep the reasons.** Paste:

```
The hybrid. It keeps the guards in the component and the preview whole, as we decided. Before we go on: does any rejected design pass the three ADR tests?
```

"Churned for 17s" on camera (`spliit/adr-three-tests.md`). It loads the `domain-modeling` skill and checks each rejected design
against the three tests for a decision record: hard to reverse, surprising without context, a real trade-off. "None of them
pass": every one fails "hard to reverse". D comes closest, but its reason is temporary (lesson 10.5's candidate 2 removes it), so
an ADR would mislead the next review. No ADR, nothing for the glossary. Then it asks question 13 again: tracking.

**5. File it.** Type:

```
Yes. File all three issues. No branch or PR today.
```

"Brewed for 1m 30s" on camera (`spliit/issues-filed.md`). It writes the three bodies to files in its scratch folder and creates
the issues in our own copy:

- **#18** the spec (`ready-for-agent`): questions 1 to 12, the chosen interface, the rejected designs and why ("reconsider after
  the schema split" for the branded types), the tests to write first, three behaviours to pin, and when it is done
  (`spliit/issue-18-spec.md`);
- **#19** the schema split (`bug`, `needs-triage`), marked as blocked by #18;
- **#20** a gap it found on the way (`bug`, `needs-triage`): reading, updating and deleting an expense ignore which group it
  belongs to. Rated low severity, because expense IDs can't be guessed.

No ADR, no glossary change, no branch, no pull request. Nothing is filed in Spliit's own repository.

**6. My own check.** In a plain shell tab in the Spliit folder:

```bash
gh issue list --limit 4
gh issue view 18 --json body --jq .body | less
git status
```

The list shows #20, #19 and #18 above #17 from an earlier lesson. In `less`, type `/Interface shape`, `/Rejected and not`,
`/Pin these` and `/Done when`, each followed by Enter, to jump through the spec; `q` quits. `git status`: "nothing to commit,
working tree clean". The decision lives in the issue, not in the code.

## Side effects

- Three new issues in your own repository (#18 to #20 on camera), with the labels `ready-for-agent`, `bug` and `needs-triage`.
  If a label doesn't exist in your repository yet, `gh issue create` stops and says so: create it or let the session drop it.
- One "blocked by" link between #19 and #18.
- Three issue-body files in the session's scratch folder, outside the repository.
- No code, glossary or decision-record changes, no branch, no commit.

## Pause and try

Pick one module in your own project whose interface you're about to design or change. Ask for three or four designs in
parallel, each under a different constraint, and before you read the recommendation, guess which design will win. Pick one
yourself, with a reason in one sentence. Then check each rejected design against the three tests: hard to reverse, surprising
without context, a real trade-off. You're done when your pick and its reasons are written down in an issue or a note, and an ADR
exists only if a rejected design passed all three.

---
Spliit is open source under the MIT License, by Sebastien Castiel and contributors; the designs and the issue text in this kit are
our analysis of its code. The `codebase-design` and `domain-modeling` skills are from
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License, described here in our own words.
"Design it twice" is John Ousterhout's idea, from *A Philosophy of Software Design*, named as the skill names it. This course is
independent: unofficial, and not affiliated with or endorsed by Matt Pocock or by Spliit's authors.
