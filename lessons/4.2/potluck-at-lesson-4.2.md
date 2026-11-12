# Potluck at lesson 4.2

The Potluck repository is public: <https://github.com/OrMizrahi12/potluck>. The tag `lesson-4.2` marks the prototype as it
was kept at the end of this lesson: commit `5fd59d5` on the branch `prototype/balances`. `main` did not change in this
lesson: it is still at `b7e1c03`, the tag `lesson-4.1`.

## What it holds

| Commit | Branch | Message | What it adds |
|---|---|---|---|
| `9eea3cd` | main | Add README | `README.md`: the name and one sentence (lesson 3.2) |
| `12deed8` | main | Configure agent skills: GitHub issues, triage labels, domain docs | `CLAUDE.md` and three files in `docs/agents/` (lesson 3.2) |
| `3b3ad78` | main | Add glossary, stack ADRs and MIT license | `GLOSSARY.md`, `LICENSE`, three ADRs in `docs/adr/` (lesson 3.3) |
| `183fe54` | main | Cut glossary to definitions only; add inactive member and settled up | `GLOSSARY.md` rewritten (lesson 3.4) |
| `b7e1c03` | main | Add odd-cent rounding research; ignore the first-group questionnaire | `docs/research/odd-cent-rounding.md` and `.gitignore` (lesson 4.1) |
| `5fd59d5` | prototype/balances | Add throwaway logic prototype of balances and settlements | `prototype/potluck-balances.PROTOTYPE.html` (this lesson) |

Every commit carries the trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`: Claude Code adds it to every
commit it makes.

- **`prototype/potluck-balances.PROTOTYPE.html`** (a copy is in `potluck/prototype/`): one self-contained HTML file, no
  build step, no server, nothing saved. The money rules sit in one block, `<script id="potluck-logic">`, with no page code
  in it, so they can be lifted into the real code later. The page has free play, 13 scenario tabs, an Experiments tab,
  export and import of a case as JSON, and a "What changed" box.
- **The branch is never merged.** It keeps the prototype as evidence of what was checked. `main` holds only decisions.
- `GLOSSARY.md`, `docs/adr/`, `docs/research/`, `.gitignore`, `LICENSE`, `CLAUDE.md`, `docs/agents/`: unchanged.
- Issues, pull requests, Actions: none yet. No app code yet.

## The decisions from this lesson

They are not in the repository: the planning session noted them for the spec in module 5.

1. Suggested settlements use greedy matching (ties broken by member creation order) and are described as "a small set",
   never "the smallest". No exact-minimum method.
2. Editing an expense may move the odd cent onto a participant the edit didn't touch. Every participant's share is shown;
   no extra explanation.
3. An expense is refused when its amount, in minor units, is smaller than its number of participants.
4. A member can't record a settlement to themselves.
5. A group's currency can change only while it has no expenses and no settlements.
6. Settlements are capped at 5,000 per group, separately from expenses.
7. A member's name can't match another member's in the same group, ignoring case and surrounding spaces.

## Open the prototype

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-4.2
```

Then open `prototype/potluck-balances.PROTOTYPE.html` in a browser (double-click it, or paste its `file://` path into the
address bar). `git checkout main` takes you back to the repository without the prototype.

Clone it; don't fork it. To build your own along the course, keep working in your own repository and make your own
prototype branch there.
