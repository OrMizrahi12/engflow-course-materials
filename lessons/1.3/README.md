# Student kit: Lesson 1.3, Reverse-engineering a professional

In this lesson we read the public GitHub repo of Matt Pocock's own app, course-video-manager, the way an engineer would,
and turn what it shows into the ideas this course is built on: four failure modes, ten rules, three review layers, and
one map from an idea to production. Nothing is installed and nothing changes in Potluck: this lesson is about reading.

## Files in this kit

| File | What it is |
|---|---|
| `README.md` | the pages we opened, how to read a professional's repo in five clicks, the numbers and how to re-check them |
| `ten-rules.md` | a one-page card: the ten rules, the three review layers and the four failure modes |
| `flow-map.md` | a one-page card: the course map from an idea to production, the modules on it, and the engineer's day |

## The pages we opened (all public, read-only)

| On camera | Link |
|---|---|
| Pull requests merged in October 2026 (Closed 517) | https://github.com/mattpocock/course-video-manager/pulls?q=is%3Apr+is%3Amerged+merged%3A2026-10-01..2026-10-31 |
| The same for September 2026 (Closed 89) | https://github.com/mattpocock/course-video-manager/pulls?q=is%3Apr+is%3Amerged+merged%3A2026-09-01..2026-09-30 |
| Commits on `main` ("mattpocock and claude committed", the 10/10 checks) | https://github.com/mattpocock/course-video-manager/commits/main/ |
| Deployments (Production, 884 deployments) | https://github.com/mattpocock/course-video-manager/deployments |
| The skills README, "Why These Skills Exist" | https://github.com/mattpocock/skills#why-these-skills-exist |
| Spec #2677 | https://github.com/mattpocock/course-video-manager/issues/2677 |
| Ticket #2679 | https://github.com/mattpocock/course-video-manager/issues/2679 |
| Pull request #2693 | https://github.com/mattpocock/course-video-manager/pull/2693 |
| Merged pull requests titled "review fixes" (Closed 10) | https://github.com/mattpocock/course-video-manager/pulls?q=is%3Apr+is%3Amerged+%22review+fixes%22+in%3Atitle |
| The skills' license (MIT) | https://github.com/mattpocock/skills/blob/main/LICENSE |

On camera each page was opened by pasting its address into the browser's address bar, and the headings were found with
the browser's find (Ctrl+F; Cmd+F on macOS): "Way Too Verbose", "Code Doesn't Work", "Ball Of Mud", "User Stories",
"Sub-issues", "Acceptance criteria", "Evidence", "Merge Danger".

His repo is live: the counts at the top of a list move as he merges, and relative dates ("4 days ago") roll forward.
Past months (September, October 2026) stay the same.

## The numbers (as of early November 2026, checked on November 8)

| What | Number |
|---|---|
| Pull requests merged in October 2026 | 517, all by Matt Pocock |
| Pull requests merged in September 2026 | 89 |
| Busiest week (October 8 to 14) | 251 merged |
| Last 30 days (October 9 to November 8) | 476 merged |
| Code commits in October that name Claude as co-author | all 622 (counted in the repo's history) |
| Checks on one of Claude's commits | 10 successful checks |
| Deployments | 884; the last one to Production 46 seconds after its merge |

It comes in bursts: never read it as a steady rate.

### Re-count it yourself (optional)

You need only the GitHub CLI from lesson 2.1, signed in. Both commands only read:

```bash
gh api -X GET search/issues -f q='repo:mattpocock/course-video-manager is:pr merged:2026-10-01..2026-10-31' --jq .total_count
# 517

gh search prs --repo mattpocock/course-video-manager --merged-at 2026-09-01..2026-09-30 --limit 1000 --json number --jq length
# 89
```

Change the dates to count any other month.

## How to read a professional's repo in five clicks

1. **Pull requests, filtered to merged:** how many changes, how often, and how each one is named.
2. **Commits:** who (or what) writes the code, and whether every change passes its checks (the green tick and the count).
3. **Deployments:** where a merged change goes, and how soon.
4. **One spec issue and its sub-issues:** the plan, cut into tickets, each with criteria that can fail.
5. **One pull request:** what it closes, its summary, its evidence, and its door call (can it be undone?).

## Pause and try

Open https://github.com/mattpocock/course-video-manager/pulls. Pick one merged pull request from the last few weeks and
find three things:

1. the issue it closes (the first line, "Closes #NNNN");
2. its evidence (tests that failed first and then passed, or screenshots);
3. its door call (in "Merge Danger": can a revert undo it?).

Then open that issue and find its parent spec. Read only: the only thing to click is links.

Hint: a title that starts with a number names its ticket. If a pull request has no Evidence or Merge Danger section,
pick another: the recent ones have them.

**Checkpoint:** you can write down one pull request number, the issue it closes, one line of its evidence, its door call,
and the number of its parent spec.

## For Windows (WSL), macOS and Linux

This lesson only needs a web browser, the same on every system. The optional re-count needs the GitHub CLI (`gh`) from
lesson 2.1: on Windows run it in the Ubuntu (WSL) terminal, on macOS and Linux in any terminal.

## What is free and what is not

Everything in this lesson is free: reading public GitHub pages needs no account, and the optional `gh` re-count needs a
free GitHub account. (Claude Code itself, used from lesson 1.2 on, needs a paid Claude plan or a Console account.)

## The Potluck repository

Nothing changes in Potluck in this lesson, and there is no Potluck repository yet: it starts from an empty repository in
lesson 3.2. When it exists, learners clone it (never fork it) so their own issues land in their own repository.

## Credits and independence

This course teaches the open-source skills in [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock,
under the MIT License. The course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock. His
app [course-video-manager](https://github.com/mattpocock/course-video-manager) has no license: this kit describes it in
its own words and links to it, and copies nothing from it. The four failure modes are summarized from the skills README
(MIT License, Copyright (c) 2026 Matt Pocock); the ten rules are this course's own wording of what his repo shows.
