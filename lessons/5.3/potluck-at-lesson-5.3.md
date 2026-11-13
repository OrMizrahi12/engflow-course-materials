# Potluck at lesson 5.3

Repository: `https://github.com/OrMizrahi12/potluck` (public; clone it, don't fork it).

| What | Where | What it is |
|---|---|---|
| tag `lesson-5.3` | commit `b7e1c03` | `main`, unchanged since lesson 4.1: this lesson commits no code |
| issue #1 | `https://github.com/OrMizrahi12/potluck/issues/1` | "Spec: Potluck v1", the parent of the ten tickets; its `ready-for-agent` label was removed at the end of the lesson |
| issues #2 to #11 | `https://github.com/OrMizrahi12/potluck/issues` | the ten tickets, sub-issues of #1 with native blocking links (`tickets.md` in this kit) |

The tickets live in the issues, not in files. The draft `tickets-draft.md` was written in the repository folder, never
committed, and deleted after publishing, so `git status` stayed clean.

Later lessons work through the tickets, starting with #2 in module 6, and close them one by one. What you see on GitHub
today includes that later work; this kit describes the tickets as they were published here.

To look from a clone:

```bash
gh issue list -R OrMizrahi12/potluck --state all
gh issue list -R OrMizrahi12/potluck --label ready-for-agent
gh issue view 2 -R OrMizrahi12/potluck
```
