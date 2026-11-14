# Card: give Claude eyes

## What Claude can see by itself, and what it can't

| | By itself | How to give it |
|---|---|---|
| The code and the tests | yes: it reads them and runs them | nothing to do |
| What the dev server prints | no: it goes to your terminal | have `npm run dev` also write everything to a log file in the repository (git-ignored), and add one line to `CLAUDE.md` saying where it is |
| The page in a browser | no: `curl` fetches text, nothing draws it | Playwright with its headless Chromium: a browser test of the user's path, screenshots Claude reads back |

## What goes in, what comes out

| In | Out |
|---|---|
| A behavior that already works (the service tests pass) | A browser test of the user's path, at desktop and phone width |
| A running app (your dev server, in your terminal) | Screenshots of each step a reviewer would want to see |
| A log file it can read | What the server said while the test ran |
| A browser it can drive (`@playwright/test`, `npx playwright install chromium`) | Findings the page couldn't show (on camera: links with tokens written to the log in full) |

## How to ask

1. **Logs first.** Run the dev server in your own terminal, where you watch it. Ask for a wrapper that copies every line it
   prints to `.data/logs/dev-latest.log`: colours in your terminal, plain text in the file, a fresh file each run.
2. **Then the browser.** Name Playwright and headless, so Claude doesn't reach for anything else. Point it at your running
   server, ask for the user's path (not a list of components) at desktop and phone width, a screenshot of each step, and
   that it looks at them itself.
3. **Make it fail once.** A test that passes on its first run proves less than one that went red and green. Ask Claude to
   break the expectation on purpose (on camera: the members in reverse order), see the red, restore it, see the green.
4. **Read the log after the run.** Note where the log ends before the test, then read only what the test added.
5. **Evidence in the pull request.** Commit the screenshots a reviewer needs on the same branch and show them in Evidence,
   with image links pinned to that commit.

## When to use it, when to skip it

- **Use it** for any change a user can see: a page, a form, the layout at phone width.
- **Skip it** for pure logic with no page; the pull request says "No UI change".
- **Wait** until the behavior works: a browser is a slow way to find logic bugs.
- **It never replaces your own look** at the preview (`review-the-preview.md`).

## It's working if

- The log file fills while your server runs, and `git status` doesn't list it.
- The browser test passes headless at desktop and phone width, and you saw it fail once on purpose.
- Claude names something from its own screenshots (on camera: a long link cut off in its field; a Share button that
  headless Chromium never shows), and something from the log.
- The pull request's Evidence shows the screenshots.

The idea of giving the agent the dev server's output in a log file and a browser of its own follows how Matt Pocock's
public repositories work, described in our own words; the `implement` and `pr` skills are from
[mattpocock/skills](https://github.com/mattpocock/skills) (MIT License). Unofficial, not affiliated with or endorsed by Matt
Pocock. First used in lesson 6.5.
