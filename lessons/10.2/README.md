# Student kit: Lesson 10.2, Triage real issues

Spliit's own tracker has 183 open issues, and 179 of them have no label: nobody has decided yet what they are. That decision
is triage, and this lesson does it on real reports. We never post to someone else's project, so a small script copies twelve
real Spliit issues into the tracker of our standalone copy from lesson 10.1, each with a link back and nothing sent upstream.
Then `/triage` takes over in one Claude Code session: it lists what needs attention, takes one bug all the way (it checks the
reporter's claim with a throwaway test, recommends, waits for our decision, then labels the issue and posts an agent brief),
and does the other eleven in one pass that reads every comment and applies nothing until we decide. Three reasons to close an
issue come up (already built, a duplicate, a rejected request), and only the rejection writes a file:
`.out-of-scope/accounts.md`. Last, a new request for the same thing arrives, and a fresh conversation finds that file by
itself.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `triage-real-issues.md` | the card: the two labels, the states, the steps for one issue, the three ways to close, it's working if |
| `spliit/copy-issues.sh` | the script that copies real Spliit issues into your own copy's tracker (reads upstream with GET only) |
| `spliit/.out-of-scope/accounts.md` | the out-of-scope file as committed on camera (`c76d93a`), with #5 and #15 under Prior requests |
| `spliit/issue-14-agent-brief.md` | the agent brief Claude posted on #14, word for word |
| `spliit/issue-15-comment.md` | the comment that closed #15, the request that matched the file |

`.out-of-scope/` starts with a dot, so `ls` hides it: use `ls -a`. The comments and the file name the account the copy was
made under; yours will name your own.

## Before you start

- Your standalone copy of Spliit from lesson 10.1: a private repository of your own that is **not a fork** (`gh repo view
  --json isFork` says `false`), with the skills setup done (`docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`)
  and the decision records in `docs/adr/`. Its tracker should have no issues of its own yet.
- A paid Claude plan and Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.325, Opus
  5.5), in auto mode. In default mode you approve each command as it comes.
- `bash`, `jq` and the GitHub CLI `gh`, signed in to your own account.
- The labels the setup expects in your copy: `bug`, `enhancement`, `duplicate`, `wontfix`, `needs-triage`, `needs-info`,
  `ready-for-agent`, `ready-for-human` (create any that are missing with `gh label create <name>`).

Free: Spliit, `gh`, `jq`, issues and labels in your own private repository. Not free: the Claude plan. The triage turns are
long reads (eleven issues with their comments, the code, the decision records), so expect them to use a real share of a
session's allowance.

## Install the script (Windows WSL, macOS, Linux)

- **Linux and Windows (WSL, Ubuntu):** `sudo apt install jq` and the GitHub CLI from cli.github.com; then `gh auth login`.
- **macOS:** `brew install jq gh`; then `gh auth login`.

Then, on any of them:

```bash
cp spliit/copy-issues.sh ~/copy-issues.sh
chmod +x ~/copy-issues.sh
```

The script refuses to run in a fork or in `spliit-app/spliit` itself. `DRY=1 ~/copy-issues.sh 692` prints the body it would
create without creating anything.

## The steps, as on camera (Ubuntu)

**1. How busy their tracker is.** In a shell, inside your copy:

```bash
clear
gh issue list -R spliit-app/spliit --state open --limit 300 --json labels --jq 'length, (map(select(.labels == [])) | length)'
```

`183` and `179` on the day we recorded: 183 open, 179 with no label. Your numbers will differ.

**2. What the script does.**

```bash
head -5 ~/copy-issues.sh
```

It copies real Spliit issues into your own copy's tracker with a link to each original; upstream is only read (GET
requests) and nothing is ever posted there.

**3. Copy twelve real issues.**

```bash
clear
~/copy-issues.sh 9 183 257 286 309 374 489 527 670 678 691 692
```

One line per copy, about half a minute in all, for example `upstream #9  ->  https://github.com/<you>/spliit/issues/3`
down to `upstream #692  ->  .../issues/14`. Our numbers started at 3 because Dependabot's two pull requests took 1 and 2;
yours may start at 1. Each copy has a header with the link back, the reporter's text, the upstream comments with the
authors' names left out, and a footer with the original's state, labels and any pull requests that reference it. Mentions
and `#` references are kept as code, so nothing links back and nobody is notified.

The twelve were picked to cover what triage has to handle: a precise bug (#692 here, our #14), a vague one, two pairs of
duplicates, requests that already exist, a bug that is already fixed, and one request that would change what the app is.

**4. Your tracker on GitHub.** Open `https://github.com/<you>/spliit/issues`: 12 open, none with a label. Open the copy of
#692 ("A group name of only spaces passes validation …"): the header, the reporter's steps, Expected and Actual, a likely
cause, and the footer.

**5. Start a session and ask what needs attention.**

```bash
claude -n spliit-triage
```

Then type `/tri`, pick `triage` from the menu, and send:

```
/mattpocock-skills:triage show me anything that needs my attention
```

19 seconds on camera. It read the tracker settings the setup wrote in lesson 10.1 (pull requests are not part of triage there), listed every open issue with labels, dates,
comments and the start of each body, and answered: 12 need attention, all 12 unlabeled, oldest first by when the original
was opened, each with a kind and one line; two likely pairs of duplicates (#4 and #9, #6 and #10); highest stakes #11 (data
loss) and #8 (money). It suggested starting with #11 and labeled nothing.

The dim text that appears in Claude Code's prompt box is only its guess at your next message. Type your own.

**6. One issue, all the way.**

```
Let's look at #14
```

35 seconds. It read the issue, looked for `.out-of-scope/` (none yet), listed the decision records, read the schema, then
wrote a throwaway Jest test that called the group form schema directly, ran it, deleted it and read where the schema is
used. Its answer: recommendation `bug` + `ready-for-agent`; the claim confirmed (an empty name fails, five spaces pass; a
participant of only spaces passes too, and `"Al"` and `"Al "` are both accepted); the checks before deciding (not already
fixed, not rejected before, no conflict with a decision record, upstream pull request #704 as a reference); the fix (trim
before the length check); and two decisions it would rather write into the brief than leave to the agent: existing blank
names stay as they are with no migration, and inner spaces are not collapsed. Then it stopped and asked.

```
Yes, label it and post the brief with both decisions.
```

29 seconds. It read the skill's guide to agent briefs, wrote the brief to a file, posted it as a comment on #14 (starting
with the skill's disclaimer line) and added `bug` and `ready-for-agent`. The brief is `spliit/issue-14-agent-brief.md`:
current behavior, desired behavior, key interfaces by type, seven acceptance criteria, out of scope, and a note on the side
effect of the first decision.

**7. The other eleven, in one pass.** Paste:

```
Now the other eleven, one at a time. Read every comment on each issue, not just the body, and check the code and the other issues before you decide. Then give me one table: issue, category, state and why. Apply nothing yet.
```

1 min 57 s on its clock. It noticed our copies have no comments of their own (the upstream comments are in each body), read
the four decision records and the glossary, ran the reporter's numbers for the rounding bug in a throwaway test, downloaded
the GIF that is the whole of #12's report and read its frames. Too wide for the terminal, the table came as one block per
issue, after a promise that nothing had been changed:

| Issue | Verdict on camera |
|---|---|
| #3 group deletion | wontfix, already implemented (the reporter's second idea, deleting inactive groups, is still open: decision 2) |
| #4 math in the amount field | wontfix, duplicate of #9 |
| #5 optional authentication | wontfix, rejected, your call: it would reverse ADR-0001 (decision 1) |
| #6 duplicate an expense | needs-triage, with #10 folded in |
| #7 custom AI endpoint | wontfix, already implemented (`OPENAI_BASE_URL`) |
| #8 rounding drops a cent | wontfix, already implemented: $1 split three ways gives 33, 34 and 33 cents |
| #9 basic math in "Amount" | needs-triage, questions only you can answer |
| #10 copy an expense | wontfix, duplicate of #6 |
| #11 removing a person deletes their expenses | ready-for-agent (the server has no check: decision 3) |
| #12 editing one uneven split value | needs-triage (read from the GIF) |
| #13 re-ticking a participant | ready-for-agent |

None went to `needs-info`: that state waits on the reporter, and the people who wrote these can't see your copy.

**8. Decide, then apply.** Paste:

```
1. Yes: we keep Spliit account-free, as ADR-0001 says. Write the out-of-scope file and close #5. 2. Close #3 as already implemented, no new issue: nobody here has asked for auto-deletion. 3. Agreed, the server refuses. Leave #6, #9 and #12 in needs-triage with your design questions as a comment on each. Apply it all now.
```

2 min 26 s. It read the skill's guide to the out-of-scope folder, wrote `.out-of-scope/accounts.md` (28 lines), wrote every
comment as a file (each starting with the disclaimer), applied labels, comments and closes with one script, then checked the
final state of every issue on GitHub. #3, #7 and #8 closed as completed; #4 and #10 closed as duplicates with GitHub's
duplicate link; #5 closed as not planned; #6, #9 and #12 open with design questions; #11 and #13 with briefs. The file was
written but not committed, and it asked: main or a branch?

```
Commit it straight to main and push.
```

7 seconds: one file in commit `49db10d` "Record accounts/authentication as out of scope", pushed.

**9. The board.** On GitHub: 6 open (3 `ready-for-agent` with `bug`, 3 `needs-triage`), 6 closed (each `wontfix` and its
category, the two duplicates marked), and the file at `.out-of-scope/accounts.md`.

**10. A new request arrives.** Open a new terminal tab in your copy and copy one more real issue:

```bash
~/copy-issues.sh 478
```

About 6 seconds: `upstream #478  ->  .../issues/15`.

**11. A fresh conversation remembers the no.** Back in the triage session, type `/clear`, then `/tri`, pick `triage` and send:

```
/mattpocock-skills:triage let's look at #15
```

20 seconds. With no memory of the last hour, it found "Prior rejection: this is already on record" in
`.out-of-scope/accounts.md`, ADR-0001 and #5; checked what's already built (recent, starred and archived groups, per device);
recommended `enhancement` + `wontfix`, adding #15 to Prior requests, a comment with the workarounds, and a close; and asked
first about an optional follow-up issue nobody had requested. Paste:

```
Go ahead with the wontfix, no follow-up. Commit and push the file.
```

23 seconds: #15 listed under Prior requests, commit `c76d93a` "Record #15 as a prior accounts request" pushed, the issue
closed with both labels, no follow-up opened.

**12. Audit.** In the shell tab:

```bash
gh issue list --state all --limit 50 --json number,state,labels --jq 'sort_by(.number)[] | "#\(.number) \(.state) \([.labels[].name] | join(", "))"'
git log --oneline -3
```

13 rows, one per copy, each with exactly one category and one state (plus `duplicate` on #4 and #10), and three commits:
`c76d93a`, `49db10d`, and the docs commit from lesson 10.1 (`4e4d83b`, tag `lesson-10.1`). Our copy is tagged `lesson-10.2`
at `c76d93a`.

## Pause and try

Copy the same twelve issues with the script, then run `/triage show me anything that needs my attention`. Take one bug all
the way to a brief, and do the rest in one pass that reads every comment and applies nothing until you've decided.
You're done when every issue has one category and one state, every comment starts with the disclaimer, your out-of-scope
file is committed, and a new request for the same idea gets matched to it. Claude's verdicts can differ from ours from run
to run; your decisions are the part that matters.

---
Spliit is open source under the MIT License, by Sebastien Castiel and contributors; the issues copied in this lesson were
written by its users, and the copies link to each original. The `triage` skill is from
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License, described here in our own
words. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock or by Spliit's authors.
