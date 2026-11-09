# Card: the ten rules

The ten rules this course reads out of Matt Pocock's public repo, in our own words (not his), with the lessons that
teach each one.

| # | Rule | What it means | Lesson |
|---|---|---|---|
| 1 | Align first, always | Get grilled about the idea before anything is built | 3.1 |
| 2 | One shared language | One glossary of the project's words, for you and the agent | 3.3 |
| 3 | Specs and tickets on GitHub | The plan and its slices live where you and every agent can read them | 5.2 |
| 4 | One change, one worktree, one pull request | Each change works in its own copy of the code and comes back as one pull request | 6.1 |
| 5 | A mechanical gate on `main` | Automatic checks decide what may merge, every time | 6.1 |
| 6 | Test first, at agreed seams | Tests written to fail first, at the boundaries agreed in the spec | 6.4 |
| 7 | Evidence over trust | A pull request proves it works: tests that failed then passed, screenshots | 6.3 |
| 8 | Give the model eyes | A browser and the logs, so the agent sees what it built | 6.5 |
| 9 | Humans keep the one-way doors | A change you can't simply undo (a database change) is a human's call | 6.3, 11.2 |
| 10 | Climb from steered to unattended | Hand over more only as the checks earn it | Modules 8 to 11 |

## The three review layers

1. **Automated checks:** types, lint, tests, on every change, in minutes.
2. **Automated review:** a fresh model reads the change against the spec and the coding standards.
3. **Your review:** test the behavior, read the evidence and the summary, make the door call.

You don't read every line. You read what proves it works.

## The four failure modes (from the skills README, MIT License)

| What goes wrong | The fix | Modules |
|---|---|---|
| It built the wrong thing (misalignment) | Get grilled first | 3 |
| Too many words (no shared language) | One shared glossary | 3 and 4 |
| The code doesn't work (no feedback) | Feedback loops: types, a browser, tests first | 5 to 7 |
| A ball of mud (the mess grows faster) | Design every day | 10 |

When not to use all of this: throwaway code (a prototype, a one-off tool) can be vibe coded. Lesson 7.4 shows the small-change path.

Credits: the failure modes summarize the README of [mattpocock/skills](https://github.com/mattpocock/skills) (MIT
License, Copyright (c) 2026 Matt Pocock). This course is independent: unofficial, not affiliated with or endorsed by him.
