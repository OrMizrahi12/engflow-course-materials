# What v0 is missing, and where the course adds it

v0 runs on one laptop. "Lives in production" means other people can rely on it. This is the gap, item by item, with the
lessons that close it.

| v0 on my laptop | In production (what the course builds) | Lessons |
|---|---|---|
| Decisions about money nobody made: who pays the odd cent, what leaving means, how amounts are typed | Decisions made out loud before any code, written down in a shared language | 3.1 `/grill-me`, 3.3 `/grill-with-docs`, 3.4, 4.1 `/research` |
| One folder, not a git repository: no history, no way back | A GitHub repository: every change recorded, every version recoverable | 3.2 |
| Checks Claude ran once, in its scratch folder, then threw away | Tests in the repository that run on every change | 5.1, 6.4 `/tdd`, 6.5 |
| Nothing stops a broken change | A mechanical gate: a change merges only when the checks pass | 6.3 |
| Nobody reviews the code | Three kinds of review: automated checks, an automated review, a human review | 7.1 |
| Data in one browser on one device: friends can't see it | A real database, shared by everyone in the group | 6.2, 12.2 |
| A `file://` address only this laptop can open | A public address anyone in the group can open | 6.2, 12.3 |
| No one knows when it breaks | Errors and uptime watched in production | 12.4, 12.6 |

## Keep v0 as it is

v0 is throwaway code, and that's what vibe coding is good for: a prototype that answers "what could this look like?"
in minutes. Don't fix it, and don't turn it into a git repository. The real Potluck starts again from an empty
repository in lesson 3.2, after the questions above have answers. v0 stays in its own folder as the picture of before.
