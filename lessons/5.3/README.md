# Student kit: Lesson 5.3, /to-tickets

The spec from lesson 5.2 (issue #1) is cut into tickets. In the same window that wrote the spec, `/to-tickets` proposes 11
tickets, each with what blocks it and a label with a reason. At its quiz we ask one question of every ticket, "what can I
demo when this is done?", and answer: split the first ticket, merge hosting into the walking skeleton (done only when its
page answers at the production URL), fold two settings tickets into one. The draft has 10 tickets. We find six acceptance
criteria that could never fail and one invented detail, have them fixed, check again, and publish the tickets as issues #2
to #11, sub-issues of #1 with native blocking links. Then we take `ready-for-agent` off the spec and close the planning
session. No code changes in this lesson.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `tickets.md` | the ten tickets as published (number, title, label and why, blocked by), the graph, how 11 became 10, the six rewritten criteria |
| `criteria-check.md` | the test for criteria that can fail, in plain words, with the filmed example |
| `potluck-at-lesson-5.3.md` | what the Potluck repository holds at the tag `lesson-5.3`, and issues #1 to #11 |
| `to-tickets.md` | the card: in and out, tracer bullets, the walking skeleton, the quiz, criteria, labels, the frontier, the spec's label |

The card is also in `cards/` in the course materials.

## Before you start

- The planning session from lessons 3.1 to 5.2, still open, with your spec in it (on camera: Opus 5.5, 161.9k tokens at the
  start). If yours is gone, run `/to-tickets #<your spec's issue number>` in a fresh session in `~/potluck`: it fetches the
  issue first.
- Your spec published as an issue in your copy of Potluck (lesson 5.2), signed in to GitHub with `gh` (lesson 3.2). Native
  sub-issues and blocking links need `gh` 2.94 or later (`gh --version`).
- The `mattpocock-skills` plugin from lesson 2.4 (version 1.3.1 on camera), and the `ready-for-agent` and
  `ready-for-human` labels in your repository (lesson 3.2).
- On camera Claude Code ran in auto mode. In default mode you approve each command, and `gh issue create` asks first.

## The steps, as on camera (Ubuntu)

**1. What to-tickets does.** In the lesson terminal, go to the plugin's skills folder and run the `grep` of
`to-tickets/SKILL.md` (in `prompts.md`). Vertical slices through every layer, each demoable on its own and sized for one
fresh window; a quiz before anything is published; sub-issues with native blocking links; never touch the parent issue.

**2. Run it on the spec.** In the planning session: `/to-tickets`, a space, and the two instructions (work from the spec in
this conversation; tag each ticket `ready-for-agent` or `ready-for-human` and say why). After 39 seconds: 11 tickets and
three questions.

**3. Answer the quiz.** Ask of every ticket: what can I demo when this is done? Paste the answer from `prompts.md`: split
ticket 1, merge hosting into the skeleton, fold 8 into 7, write `tickets-draft.md` and don't publish yet. It took 1 minute
13 seconds: 387 lines, 10 tickets.

**4. Read the draft.** In the lesson terminal: `cd ~/potluck`, `git status -s` (untracked), `wc -l`, the ticket headings,
the labels (`ready-for-human` on the skeleton and on backups), and the skeleton's "Done when" line.

**5. Test the criteria.** Search for criteria that promise something never happens, and ask of each: is it already true
today? Six were. Read the seed list too: one seed group was invented. `criteria-check.md` has the test.

**6. One correction, one decision.** Paste the correction (six line numbers and the seed group). It rewrote all six and
flagged two small app behaviours its rewrites would add; type `Keep both checks in CI and add no app behaviour.`

**7. Check again.** `grep -n -E "fails (if|unless)"` shows all six as checks; `grep -c "four-member"` shows `0`.

**8. Publish.** Type: `Publish them, then delete the draft.` It took 1 minute 38 seconds: issues #2 to #11, sub-issues of
#1, native blocking links, bodies checked, the draft deleted, the tree clean. Only #2 can start now.

**9. On GitHub.** Reload the spec: "0/10" and the sub-issues. Open #2 (its parent, its label and reason, "Done when", "Is
blocking" #11 and #3), then #3 ("Blocked by" #2). `ready-for-agent` is still on the spec.

**10. Take the label off the spec.** `gh issue edit 1 --remove-label ready-for-agent`, then `gh issue list --label
ready-for-agent`: only #3 to #10.

**11. Close the planning session.** `/exit`. From module 6, every ticket starts in a fresh session.

The video trims the waits; the narration says how long each one took.

## Pause and try

In the window where you wrote your own spec, run `/to-tickets` with the same two instructions. At the quiz, ask the demo
question of every ticket, merge what fails it, and make the walking skeleton the first ticket. Ask for a draft, test its
criteria with `criteria-check.md`, then publish to your own repository and take `ready-for-agent` off your spec.

**Checkpoint (it's working if):** the top ticket has no blockers, and every ticket has an answer to "what can I demo when
this is done?"

## If something goes differently

- **A different number of tickets, or different ones.** Every session slices its own spec. Ask the demo question of each;
  merge what has no answer; ask for the walking skeleton first.
- **It publishes without waiting for the quiz.** Read the issues on GitHub anyway, edit or close what is wrong, and next
  time put "don't publish yet" in the same line as `/to-tickets`.
- **"Blocked by" ends up as text in the issue body instead of a real link.** Check `gh --version` (2.94 or later) and ask
  it to use `gh issue create --blocked-by`.
- **The tickets are not sub-issues of the spec.** Ask it to use `gh issue create --parent <spec number>`.
- **Your criteria check finds different lines, or none.** Read every criterion with the two questions anyway; a search only
  finds the usual shapes.
- **The status line is far past 150k.** Expected at the end of a long planning session: read the output more carefully,
  and close the session once the tickets are published.

## Windows (WSL), macOS and Linux

The commands are the same in every terminal. On Windows run everything inside the Ubuntu (WSL) terminal from lesson 2.1,
in your Linux home folder (`~`). On macOS use a second Terminal window (Cmd+N) for the lesson terminal. The plugin path is
the same on all three: `~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/<version>/skills/engineering`.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-5.3` points at
`b7e1c03`, the same commit as `lesson-4.1`: this lesson commits no code. The spec is issue #1 and the tickets are issues #2
to #11. Clone the repository to look or to start from here; don't fork it. `potluck-at-lesson-5.3.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera the planning
  session answered five requests on Opus 5.5 in this lesson and ended at 187.4k tokens of context.
- GitHub issues, sub-issues, labels, git, `gh` and the skills are free (the skills are open source, MIT License).
- The walking skeleton (from module 6) runs on Vercel's Hobby plan, which is for non-commercial use, and Neon's Free plan.
  A business would pay for Vercel Pro.

## Credits

The `to-tickets` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT
License. It is described here in our own words, with short quotes of the installed 1.3.1 files and its documentation. The
tickets' sections follow the skill's issue template. This course is independent: unofficial, and not affiliated with or
endorsed by Matt Pocock.

```text
MIT License

Copyright (c) 2026 Matt Pocock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
