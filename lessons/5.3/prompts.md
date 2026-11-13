# Lesson 5.3: every line typed or pasted, in order

Two windows: the **planning session** (the Claude Code session from lessons 3.1 to 5.2, still open) and the **lesson
terminal** (a plain shell). Claude Code ran in auto mode with Opus 5.5. What came back is summarized; your session will word
its replies differently.

## 1. What to-tickets does (lesson terminal)

```bash
cd ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering
grep -n -E "^desc|^disab|vertical, NOT|demoable|single fresh|prefactoring should|granularity|genuinely gate|merged or split|^Iterate|native blocking|NOT close" to-tickets/SKILL.md
```

Came back: the description (break a plan, a spec or the current conversation into tracer-bullet tickets, each declaring its
blocking edges, published to the configured tracker); `disable-model-invocation: true` (you type `/to-tickets`); the slicing
rules (lines 31 to 34: a narrow but complete path through every layer, "vertical, NOT a horizontal slice"; demoable or
verifiable on its own; sized for a single fresh context window; prefactoring first); the quiz (lines 52 to 56: granularity,
blocking edges that genuinely gate, merge or split, "Iterate until the user approves the breakdown"); how it publishes on a
real tracker (line 63: one issue per ticket, blockers first, native blocking links, each a sub-issue of the source issue, the
`ready-for-agent` label "unless instructed otherwise"); and line 67, "Do NOT close or modify any parent issue".

## 2. Run it on the spec (planning session)

Type `/to-tickets`, pick it from the menu, type a space, then paste:

```text
The spec we published as #1 is in this conversation, so work from it without fetching it. Tag each ticket ready-for-agent if a fresh session could finish it unattended, or ready-for-human if we need to steer it, and say why.
```

Came back (after 39 seconds): **11 tickets**, each with "Blocked by", what it delivers, and its label with a reason.

1. Walking skeleton: create a group and open it by its link (blocked by none; ready-for-agent)
2. Hosting and the path to production (blocked by 1; ready-for-human: it runs through your Vercel, Neon and GitHub
   settings and secrets, which a session can't sign into)
3. Record an expense and see balances
4. "Who are you?" and my groups on this device
5. Settlements and suggested settlements
6. Edit and delete expenses and settlements safely
7. Managing members
8. Group settings: change the currency and delete the group
9. Privacy and hardening
10. Seed data that covers every edge case
11. Real backups before launch (ready-for-human: the decision isn't made yet, and storage would use your accounts)

Then the quiz: granularity (it would split ticket 1 into the skeleton, then "create group"), the blocking edges worth
checking, and merge or split (8 could fold into 7 as one "group settings" ticket).

## 3. The quiz answer (planning session)

Ask of every ticket: **what can I demo when this is done?** Ticket 2 has no answer on its own. Paste:

```text
Split 1 as you suggest: the walking skeleton, then create group. Merge 2 into the skeleton: hosting alone gives us nothing to demo, and the skeleton is only done when its page answers at the production URL. So it's ready-for-human and every feature waits for it. Fold 8 into 7: the spec puts members, currency and delete on one settings page. Then write all tickets to tickets-draft.md here, and don't publish yet.
```

Came back (after 1 minute 13 seconds): `tickets-draft.md`, 387 lines, untracked, nothing published; **10 tickets**, T1 to
T10, each with acceptance criteria and a label with its reason. T1 now includes all of hosting and is done only when its page
answers at the production URL after a merged pull request that passed all four checks; "create group" moved into T2; the old
ticket 8 folded into T7.

## 4. Read the draft (lesson terminal)

```bash
cd ~/potluck
git status -s
wc -l tickets-draft.md
grep -n "^## T" tickets-draft.md
grep -n -o "ready-for-[a-z]*" tickets-draft.md
grep -n "Done when" tickets-draft.md
```

Came back: `?? tickets-draft.md` (untracked); `387 tickets-draft.md`; ten headings; `ready-for-human` on lines 11 (T1, the
skeleton) and 368 (T10, backups), `ready-for-agent` on the other eight; line 46, the skeleton's "Done when": the home page
answers at the production `*.vercel.app` URL, served from the root branch, after a merged PR whose four checks all passed.

## 5. Criteria that can't fail (lesson terminal)

```bash
grep -n -E "\[ \] .*(never|There.s no|There are no|isn.t used|nowhere)" tickets-draft.md
grep -n -A8 "Seed groups" tickets-draft.md
```

Came back: six criteria already true at the commit the work starts from (a repository with no app in it), so they could
never fail: lines 31 (Neon's HTTP-only driver isn't used), 160 (the claimed member is never sent to the server), 234 (no undo,
no activity log, no soft delete), 320 (no third-party scripts, trackers or analytics cookies), 322 (app logs never contain IP
addresses), 383 (production data goes nowhere except the chosen backup store). Line 167 ("blocked or missing browser storage
never breaks a page") stays: there is no page yet, so its check fails until the ticket builds one. And in T9's seed groups,
line 354: "A four-member flat with a month of mixed expenses plus a trip", which is not in the spec's seed list.

## 6. One correction (planning session)

Paste:

```text
Six criteria are already true today, before any code exists, so they can never fail: lines 31, 160, 234, 320, 322 and 383 of the draft. Rewrite each as a check that fails if it breaks, like a test. And the four-member flat in T9 isn't in the spec's seed list: take it out.
```

Came back (after 36 seconds; one of its own edit scripts failed an assertion and it retried): all six rewritten as checks
that fail, the flat removed. It flagged that two rewrites added small app behaviours the spec never mentioned (a start-up
check in T1, a backup destination allowlist in T10) and offered to keep the checks in CI instead. Type:

```text
Keep both checks in CI and add no app behaviour.
```

Came back (after 19 seconds): both checks moved into CI. It also corrected its own wording: it had written that the Vercel
token would be "read-only" without having confirmed that Vercel offers read-only tokens; the ticket now says "scoped as
narrowly as Vercel allows".

## 7. Check again (lesson terminal)

```bash
grep -n -E "fails (if|unless)" tickets-draft.md
grep -c "four-member" tickets-draft.md
```

Came back: lines 31, 160, 234, 320, 322 and 382 (the backup line moved up one), each now a check that names what would make
it fail; `0`.

## 8. Publish (planning session)

Type:

```text
Publish them, then delete the draft.
```

Came back (after 1 minute 38 seconds): issues #2 to #11, created blockers first, each a sub-issue of #1, with GitHub's native
blocking links (so the "Blocked by" text sections were left out) and every draft "T" number replaced by its real issue
number; each body checked; the sub-issues listed; the draft deleted; the working tree clean; #1 unchanged. "The only ticket
that can start now is #2, and it's yours to drive."

## 9. On GitHub (browser)

Reload issue #1: the counter "0/10", the sub-issues list, #2 (in GitHub's side panel: its parent, its label line, the
`ready-for-human` label, "Done when", and "Is blocking" #11 and #3), #3 ("Blocked by: Walking skeleton, live at the
production URL"), and #1 again with `ready-for-agent` still on it.

## 10. Take the label off the spec (lesson terminal)

```bash
gh issue edit 1 --remove-label ready-for-agent
gh issue list --label ready-for-agent
```

Came back: the issue's URL, then "Showing 8 of 8 issues": #3 to #10. The spec is no longer on the list, and neither are the
two tickets you steer (#2, #11).

## 11. Close the planning session (planning session)

```text
/exit
```

Came back: "Resume this session with: claude --resume <session id>". From module 6, every ticket starts in a fresh session.
