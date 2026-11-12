# Student kit: Lesson 4.2, /handoff and a logic prototype

The planning session has a question only running code can answer: does Potluck's money model hold up when you push on
it? This lesson moves that question to a fresh session in its own folder with `/handoff`, reads the handoff file before
passing it on, and asks the fresh session for a logic prototype with `/prototype`: one HTML file you drive with buttons.
Driving it shows two bugs in the idea (greedy matching suggests four settlements where three would do, and editing an
expense can move the odd cent onto someone who wasn't touched). A second handoff brings the answer back, the planning
session records seven decisions for the spec, and the prototype is kept as evidence on its own branch, `prototype/balances`,
while `main` stays unchanged.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `potluck-at-lesson-4.2.md` | what the Potluck repository holds at the tag `lesson-4.2`, and how to open the prototype |
| `potluck/prototype/potluck-balances.PROTOTYPE.html` | the prototype as built in the lesson (1,148 lines; open it in any browser) |
| `example-handoff.md` | the first handoff document, as written in the lesson (planning session → fresh session) |
| `example-findings-handoff.md` | the second handoff document, as written in the lesson (fresh session → planning session) |
| `handoff.md` | the card for `/handoff` |
| `prototype.md` | the card for `/prototype` |

The cards are also in `cards/` in the course materials. Both example handoffs lived in the temp folder, which the system
cleans up; these are copies.

## Before you start

- The `planning` session from lessons 3.1 to 4.1, still open in `~/potluck`. If you closed it,
  `cd ~/potluck && claude --resume` and pick `planning`.
- The `mattpocock-skills` plugin from lesson 2.4 (version 1.3.1 on camera). `/skills` lists
  `mattpocock-skills:handoff` and `mattpocock-skills:prototype`.
- A second terminal in `~/potluck` (the lesson terminal) and a browser.
- On camera Claude Code ran in auto mode. In default mode you approve each command and each file the new session writes.

## The steps, as on camera (Ubuntu)

**1. Hand off the work.** In the planning session type `/handoff` and a space, then paste one sentence about what the next
session is for (full text in `prompts.md`). Its last line matters most: "That folder won't load your memory notes, so
write down every rule the model needs." Claude Code keeps its memory notes per project folder, and the rules decided since
lesson 3.1 lived only in the notes of `~/potluck`. Claude checked the temp folder and that `~/potluck-prototype` didn't
exist yet, then wrote `/tmp/potluck-prototype-handoff.md` (105 lines) in 55 seconds. Its reply: how to start the new
session, "my memory notes don't carry over to that folder, so every rule the model needs is written out", the glossary,
research and ADRs referenced by path, no personal details, and two gaps it found while writing (the glossary entry that
promised "the smallest set" of settlements, and settling with yourself, never decided).

**2. Read it before you hand it over.** In the lesson terminal: `ls /tmp/*.md` (just the handoff), `wc -l` (105 lines),
`grep -n '^#\|^\*\*'` for its structure (the task, read first, the rules: money, members, expenses, shares, balances,
settlements, suggested settlements; the known tension; other places the idea may break; out of scope; suggested skills;
git), `head -3` (the new session "won't load the previous session's memory notes"), lines 42 to 50 (the odd-cent rule,
written out in full) and lines 97 to 101 (suggested skills: prototype, grilling, domain-modeling). Nothing in it was a
guess to correct, so it went over as it was.

**3. Read the skill.** Paste the `cat` of the installed `handoff/SKILL.md` (path in `prompts.md`). Description: "Compact
the current conversation into a handoff document for another agent to pick up." `disable-model-invocation: true`: it runs
only when you type it. The body: save to the OS temporary directory, not the workspace; include a "suggested skills"
section; don't duplicate specs, plans, ADRs, issues or commits, reference them by path; redact secrets and personal data;
an argument says what the next session is for.

**4. A fresh session in its own folder.** In the lesson terminal press Ctrl+Shift+N for a new window, then type
`mkdir ~/potluck-prototype && cd ~/potluck-prototype`, `ls -a` (empty), `claude -n prototype`. The new folder asks for
trust ("Yes, I trust this folder"). The header shows `~/potluck-prototype` and the status line starts at 0 tokens; the
planning window is still open at 129.2k.

**5. Ask for a logic prototype.** In the new session type `/prototype` and a space, then paste the request with the path
from step 1. The build ran for 9 minutes 11 seconds (the video shows it as a labelled time-lapse): it read the handoff,
the skill's `LOGIC.md`, the glossary and the research file, wrote the money rules first as a separate logic module and
checked them in Node, built the page, then drove every scenario itself in headless Chrome. The reply: one file,
`potluck-balances.PROTOTYPE.html`, free play, 13 scenario tabs, an Experiments tab, export and import, a "What changed"
box, and eight findings. The session found the two bugs while testing its own page; driving it in step 7 confirms them by
hand.

**6. Read the prototype skill.** Paste the `cat` of the installed `prototype/SKILL.md`: "throwaway code that answers a
question"; the logic branch builds one HTML file with free-play buttons and tabbed walkthroughs that a non-developer can
drive; rule 5, surface the state after every action; rule 6, capture it when done: fold the decision into the real code,
commit the prototype to a throwaway branch out of main.

**7. Drive it.** In the browser, paste the file's address (Ctrl+L in the tab you have open). The page reloads fresh
(nothing is saved). Tab **Greedy isn't fewest**: press steps 1 to 3 (Ben pays $40.00 for Dee's concert ticket, Ana $20.00
for Cai's taxi, Eli $30.00 for Cai's groceries). Suggested settlements: Cai → Ben $40.00, Dee → Eli $30.00, Cai → Ana
$10.00, Dee → Ana $10.00, and "Greedy suggests 4, but 3 would do." Tab **Editing moves the cent**: step 1, a $10.00 pizza
among Ana, Ben and Cai; step 2 swaps Ben for Dee. Shares before: Ana $3.33, Ben $3.34, Cai $3.33; after: Ana $3.33,
Cai $3.34, Dee $3.33. The extra cent moved onto Cai, who wasn't touched.

**8. Send the answer back.** In the prototype session: `/handoff`, a space, and the pasted argument "Back to the planning
session in ~/potluck: what the prototype showed." It wrote `/tmp/potluck-prototype-findings-handoff.md` (55 lines) in 28
seconds: the eight findings with the decision each raises, what's still open (nothing committed), suggested skills.
Then `/exit`: the session ends ("Resume this session with: claude --resume …") and the window is back at the shell.

**9. Bring it home.** In the planning session, paste "Read /tmp/potluck-prototype-findings-handoff.md: it's the prototype
session's answer." A dialog appeared: "Allow this read outside the working directories?" The file is in the temp folder,
outside the session's folder, so it asks. On camera the choice was **4. Yes, but ask again next time**: a yes for this
one read, no setting changed. The reply: the rotation is fair, the caps are fine, then eight questions with a
recommendation each (P1 to P8).

**10. Decide.** Typed: `Yes to all seven. Note them for the spec, not the repo.` Claude appended P1 to P7 to its memory
notes for `~/potluck` (nothing in the repo changed) and checked that "seven" meant P1 to P7, so the prototype stayed
uncommitted. The seven rules are listed in `potluck-at-lesson-4.2.md`.

**11. Keep it as evidence.** Typed: `Commit the prototype on its own branch, not main.` Claude scanned the file for email
addresses, URLs and secrets (none), created `prototype/balances` with one commit, `5fd59d5` "Add throwaway logic prototype
of balances and settlements" (one file, `prototype/potluck-balances.PROTOTYPE.html`), switched back to `main`, and did
not push. Then `Push it.`: on camera this went against Claude's advice to keep the branch local, so that you can open the
prototype at its tag. GitHub suggested a pull request; Claude didn't open one, because a prototype branch is never merged.

**12. Where we are.** In the lesson terminal: `cd ~/potluck`, `git branch -a` (main, prototype/balances, and both on
origin), `git log --oneline -2 prototype/balances` (`5fd59d5` on top of `b7e1c03`), `git status -sb` (`## main...origin/main`,
clean). The planning session stays open, at 14% of its context; the prototype session is closed.

The video trims the waits; the narration says how long each one took.

## Pause and try

In your own copy of Potluck, or any project, run `/handoff` with one sentence about what the next session is for, and
read the file before you hand it over. Make a new folder, start `claude` there, point it at the file, and ask `/prototype`
about one rule you're unsure of. Drive every walkthrough, write down the first "wait, that shouldn't be possible", and hand
the answer back with `/handoff`.

**Checkpoint (it's working if):** the fresh session started without you explaining again, your planning session was
unchanged when you came back, and `main` holds none of the prototype.

## If something goes differently

- **The handoff is missing a rule.** Tell the planning session which one and ask it to add it, before the new session
  starts. Rules that live only in memory notes or in your head are the ones that get lost.
- **You can't find the file.** Ask Claude for the full path. On macOS `$TMPDIR` is a long per-user folder; on Windows (WSL)
  it is the Linux `/tmp` inside WSL. The temp folder gets cleaned up: if the next session won't start soon, copy the file
  somewhere you keep.
- **A dialog asks to read outside the working directories.** That is the session asking before it reads a file outside its
  own folder. Choose the one-time yes, or keep handoff files inside the project if you see it often.
- **The prototype session builds for a long time.** Nine minutes on camera. Let it finish; it tests its own page before it
  replies.
- **The prototype reports the bugs before you drive it.** That happened on camera too. Drive it anyway: the walkthrough is
  your own check of its claims.
- **Your page looks different.** Every run builds its own page. Look for the same kinds of tabs: a guided walkthrough for
  each case in the handoff, free play, and a panel that shows the state after every action.

## Windows (WSL), macOS and Linux

The commands are the same in every terminal. On Windows run everything inside the Ubuntu (WSL) terminal from lesson 2.1,
in your Linux home folder (`~`); open a second terminal tab or window for the fresh session. To open the prototype from
WSL, run `explorer.exe .` in its folder and double-click the file, or paste its `file://` path into your browser. On macOS
use a second Terminal window (Cmd+N) and `open potluck-balances.PROTOTYPE.html`.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-4.2` points at
`5fd59d5` on the branch `prototype/balances`; `main` is still at `b7e1c03` (tag `lesson-4.1`). Clone it to look or to start
from here; don't fork it. `potluck-at-lesson-4.2.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera the planning
  session made 15 requests to Opus 5.5 (its context went from 123.9k to 138.7k tokens, 14% of the window), and the fresh
  prototype session made 15 more of its own (it ended at 125.9k), most of them during the nine-minute build.
- The prototype is one HTML file: nothing to install, no account, no server. A GitHub account, `gh` and git are free. The
  skills are free and open source (MIT License).

## Credits

The `handoff` and `prototype` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock,
under the MIT License. They are described here in our own words, with short quotes of the installed 1.3.1 files. The two
handoff documents and the prototype were written in the lesson. The odd-cent rule the prototype follows comes from
[Spliit](https://github.com/spliit-app/spliit) (MIT), as researched in lesson 4.1. This course is independent: unofficial,
and not affiliated with or endorsed by Matt Pocock.

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
