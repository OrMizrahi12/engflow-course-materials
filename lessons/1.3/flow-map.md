# Card: the course map

The whole flow of this course on one line. It comes back at the start of every module with "you are here".

```
idea → grilling → spec → tickets → worktree → pull request → checks → merge → production
```

What goes in: an idea. What comes out: a change running in production, with a history of why it was made.

| Module | Where it sits on the map |
|---|---|
| 1 How a professional works | the whole map (you are here in lesson 1.3) |
| 2 The workbench | under all of it: the tools every step uses |
| 3 Align first · 4 When the answer isn't in your head | idea → grilling (and the shared language) |
| 5 Plan on GitHub | spec → tickets |
| 6 Land a change like a pro | worktree → pull request → checks → merge → production |
| 7 Review and improve the environment | pull request → checks |
| 8 Parallel sessions · 9 Big, foggy work | tickets → worktree, many at once |
| 10 Someone else's codebase | comes in at the tickets (triage, bugs) |
| 11 Climb to unattended work | tickets → pull request without you at the keyboard |
| 12 Ship to production | merge → production, for real people |

## An engineer's day

| Time | What happens | Modules |
|---|---|---|
| Morning | Check production and the errors, triage what came in | 12, 10 |
| Late morning | Align the next change | 3 to 5 |
| Afternoon | Land it and review it | 6 to 8, 11 |
| End of day | The merges ship; look back at what went well | 7, 12 |

One flow, every day.

When not to use the whole map: a small, clear change can take the short path (lesson 7.4), and throwaway code needs
none of it.
