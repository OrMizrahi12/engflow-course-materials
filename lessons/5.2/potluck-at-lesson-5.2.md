# Potluck at lesson 5.2

Repository: `https://github.com/OrMizrahi12/potluck` (public; clone it, don't fork it).

| What | Where | What it is |
|---|---|---|
| tag `lesson-5.2` | commit `b7e1c03` | `main`, unchanged since lesson 4.1: this lesson commits no code |
| issue #1 | `https://github.com/OrMizrahi12/potluck/issues/1` | "Spec: Potluck v1", published in this lesson with the label `ready-for-agent` |
| tag `lesson-4.2` | commit `5fd59d5` | the branch `prototype/balances`, with the prototype the spec quotes two snippets from |

The spec lives in the issue, not in a file. The draft `spec-draft.md` was written in the repository folder, never
committed, and deleted after publishing, so `git status` stayed clean. The issue's body as published is in this kit as
`spec-issue-1.md`.

Later lessons add to the issue: lesson 5.3 cuts it into tickets, and its labels change from there on. What you see on
GitHub today includes that later work; the body is the one published here.

What the spec drew on, all from earlier lessons:

- the planning session's conversation (lessons 3.1 to 4.2) and Claude's notes for the project;
- the repository: ADRs 0001 to 0003 in `docs/adr/` (lesson 3.3) and `GLOSSARY.md` (lesson 3.4);
- the research on the odd cent and decimals, `docs/research/odd-cent-rounding.md` (lesson 4.1);
- the prototype on the branch `prototype/balances` (lesson 4.2).

To read the spec as published from a clone:

```bash
gh issue view 1 -R OrMizrahi12/potluck
```
