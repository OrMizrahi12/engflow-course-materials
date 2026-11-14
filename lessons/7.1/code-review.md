# Card: code-review, one review on two axes

## What goes in, what comes out

| In | Out |
|---|---|
| A fixed point: a commit, branch, tag or merge-base (usually `main`) | Two separate reports: **Standards** and **Spec** |
| The commits since then, and the spec they cite (found from the commit messages) | Findings that cite a rule, a spec line or the code |
| The repo's written rules (`CODING_STANDARDS.md` first, if there is one) | A one-line summary: the worst issue on each side, never one blended score |

## How it runs

1. It checks that the fixed point exists and the diff isn't empty, before anything else.
2. It finds the spec: issue numbers in the commit messages first (read through the repo's tracker doc), then a path you give
   it, then a spec file, and if there is none it asks.
3. It collects every file that says how code should be written. It always adds a fixed list of classic code smells; a smell is
   always a judgment call, and a written repo rule wins over it.
4. Two reviewers run side by side, each in a fresh context: **Standards** asks "is it built right?", **Spec** asks "is it the
   right thing?" (missing, extra, wrong). Anything the linter, the formatter or the type checker already enforces is skipped.
5. It reports both, side by side, without merging or reranking them: code can pass one axis and fail the other.

Type `/mattpocock-skills:code-review main`. In Claude Code 2.1.323 the short name `/code-review` is Claude Code's own bug
hunter; the plugin's skill is the second row of the menu.

## Ask for this

- Run it in a **fresh session**, not the one that wrote the code: a model reviewing its own work tends to agree with itself.
- Give it the fixed point. That's all it needs.
- After the report: "Check each finding against what it cites. One line per finding: does it hold up, and what's your
  evidence? Don't edit any files yet."

## Reach for it when

- A branch is done and pushed, before its pull request.
- You want to know both "did we follow our own rules?" and "did we build what the issue asked for?".

## Not for

- Work you haven't committed: it reads commits.
- A verdict. Every finding is a lead; another run finds something new.

## It's working if

- The report has two sections, each with its worst issue, and the findings cite something you can look up.
- You checked what a finding cites before acting on it.
- You acted on the findings with a rule or a real failure behind them, and wrote the judgment calls you agree with into
  `CODING_STANDARDS.md`.
- The next run reads that file, and you stop after acting on what it cites.

From [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License), described in our own words. Unofficial, not
affiliated with or endorsed by Matt Pocock. First used live in lesson 7.1.
