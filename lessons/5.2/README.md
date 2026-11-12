# Student kit: Lesson 5.2, /to-spec

Everything Potluck's planning settled in modules 3 and 4 lives in one conversation and in Claude's notes. This lesson
writes it down as one GitHub issue. In the window where we grilled, `/to-spec` proposes two test seams and waits; we agree.
It writes a 336-line draft with 96 user stories into a file first (the repository is public) and names six gaps it filled
itself. We read the draft against the decisions, catch four defects, have them fixed in one correction, check again, and
publish the spec as issue #1, "Spec: Potluck v1", with the `ready-for-agent` label. No code changes in this lesson.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `spec-issue-1.md` | the body of issue #1 exactly as published |
| `decisions-checklist.md` | the decisions the spec had to carry, group by group, with where each ended up, and the four defects |
| `potluck-at-lesson-5.2.md` | what the Potluck repository holds at the tag `lesson-5.2`, and issue #1 |
| `to-spec.md` | the card: in and out, seams first, draft first on a public repository, the check, the label, when to use it |

The card is also in `cards/` in the course materials.

## Before you start

- The planning session from lessons 3.1 to 4.2, still open (on camera: Opus 5.5, 138.7k tokens at the start). If yours is
  gone, `claude --resume` in `~/potluck` brings it back; a fresh session would not know the decisions.
- Your copy of Potluck in `~/potluck`, signed in to GitHub with `gh` (lesson 3.2).
- The `mattpocock-skills` plugin from lesson 2.4 (version 1.3.1 on camera).
- On camera Claude Code ran in auto mode. In default mode you approve each command, and `gh issue create` asks first.

## The steps, as on camera (Ubuntu)

**1. What to-spec does.** In the lesson terminal, in the plugin's skills folder, run the `grep` of `to-spec/SKILL.md` (in
`prompts.md`). No interview, just synthesis; you type it, Claude never starts it; it explores, proposes seams and checks them
with you, then writes from a fixed template and publishes with the `ready-for-agent` label.

**2. Run it where you grilled.** In the planning session: `/to-spec`, a space, and the instruction to write
`spec-draft.md` first and not publish yet. After 18 seconds: two proposed seams, the group service (tests against a real
Postgres in PGlite) and Playwright on each pull request's preview, and a question.

**3. Answer the seams question.** Type: `Yes, those two. Run that property test through the service.` For each seam, ask:
what does it catch, and what does it miss? The draft took 2 minutes 7 seconds (a time-lapse in the video): 336 lines,
96 user stories, and six filled gaps to check.

**4. Read the draft.** In the lesson terminal: `cd ~/potluck`, `git status -s` (untracked), `wc -l`, the headings, the
count of user stories, and the Out of Scope list.

**5. Check it against the decisions.** The seven rules from the prototype in Claude's notes and a search of the draft for
each: all seven there. The research and pipeline rules: there. `region`: `0` (good, never decided). `typescript`: `0` (a
defect). Backups: parked as a launch blocker. And two lines we never decided: "Recurring expenses" in Out of Scope, and a
questionnaire described as sent.

**6. One correction.** Paste the four fixes (in `prompts.md`). Claude fixes the draft and updates its own notes.

**7. Check the fixes.** One `grep` for all four: TypeScript next to Next.js, members in the version rule, the questionnaire
written but not sent yet, and no recurring line.

**8. Publish.** Type: `Publish it, then delete the draft.` Issue #1 with the label; the published body matches the draft;
the draft is deleted and `git status` is clean.

**9. On GitHub.** Open the issue: the title, the label and its tooltip, the sections, the event that added the label.
Back in the planning session the window stays open for lesson 5.3, which cuts the spec into tickets right there.

The video trims the waits; the narration says how long each one took.

## Pause and try

In the session where you grilled your own copy of Potluck, run `/to-spec` and ask for a draft file first. Check it with
`decisions-checklist.md`: the seams, the Out of Scope list, anything invented, anything left out. Have it fixed, then publish
it to your own repository's issues.

**Checkpoint (it's working if):** you remember making every decision in your spec.

## If something goes differently

- **It publishes without waiting.** Read the issue on GitHub anyway and ask for an edit of the issue (`gh issue edit`);
  next time, put "don't publish yet" in the same line as `/to-spec`.
- **It proposes more than two seams, or different ones.** Ask what each one catches that the others miss. Keep a seam only
  for what no other seam reaches.
- **Your draft has a different length or a different number of user stories.** Every session writes its own spec; the
  check is the same.
- **Your check finds different defects, or none.** Search for each decision's own words before you trust a "none".
- **`gh issue create` fails.** Check `gh auth status` (lesson 3.2) and that the `ready-for-agent` label exists in your
  repository (lesson 3.2 set up the triage labels).
- **The status line passes 150k.** Keep the window for the tickets in lesson 5.3, and read the output more carefully. Don't
  clear or compact between the spec and the tickets.

## Windows (WSL), macOS and Linux

The commands are the same in every terminal. On Windows run everything inside the Ubuntu (WSL) terminal from lesson 2.1,
in your Linux home folder (`~`). On macOS use a second Terminal window (Cmd+N) for the lesson terminal. The plugin path is
the same on all three: `~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/<version>/skills/engineering`.
Claude's notes for the project are in `~/.claude/projects/<your-potluck-project-folder>/memory/`.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-5.2` points at
`b7e1c03`, the same commit as `lesson-4.1`: this lesson commits no code. The spec is issue #1. Clone the repository to look
or to start from here; don't fork it. `potluck-at-lesson-5.2.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera the planning
  session made four requests to Opus 5.5 and ended at 161.9k tokens of context.
- GitHub issues and labels, git, `gh` and the skills are free (the skills are open source, MIT License).

## Credits

The `to-spec` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License.
It is described here in our own words, with short quotes of the installed 1.3.1 files and its documentation. The spec's
section headings follow the skill's template. This course is independent: unofficial, and not affiliated with or endorsed by
Matt Pocock.

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
