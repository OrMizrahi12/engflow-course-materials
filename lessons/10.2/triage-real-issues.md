# Card: triage real issues

One page from Lesson 10.2. Triage is reading each incoming report and deciding what it is and what happens to it next.
`/triage` does the reading and the checking; you make the calls.

## Two labels on every issue

- **One category:** `bug` or `enhancement`.
- **One state:** where it goes next.

| State | Means | Comes with |
|---|---|---|
| `needs-triage` | the maintainer still has to evaluate it (where an unlabeled issue normally goes first) | design questions, when only you can answer them |
| `needs-info` | waiting on the reporter | a note: what we've established so far, and what we still need from you |
| `ready-for-agent` | fully specified: an agent can build it while you're away | an agent brief |
| `ready-for-human` | the same brief, but an agent can't do it | the brief plus why not |
| `wontfix` | closed, for one of three reasons | see below |

`needs-info` only works when the reporter can read the note and answer. On a copy of someone else's tracker they can't, so
every open question stays with you in `needs-triage`.

## One issue, all the way

| Step | What happens |
|---|---|
| Gather | read the issue in full (every comment, not just the body), the out-of-scope folder, the decision records, the code |
| Verify the claim | reproduce it on your copy: a throwaway test or a run, then delete it |
| Check before deciding | already fixed? rejected before? conflicts with a decision record? anything upstream to learn from? |
| Recommend, then wait | a category, a state and why; it stops and asks before it changes anything |
| Grill it if it's fuzzy | a vague report gets questions before a brief |
| Apply | the labels, the comment (each starting with the skill's disclaimer line), the close where it's done |

## The agent brief

A contract with an agent that might pick it up weeks from now: **current behavior**, **desired behavior**, **key interfaces**
named by type (paths and line numbers go stale while the issue waits), **acceptance criteria** you can check one at a time,
and an explicit **out of scope**, so it doesn't fix what you decided to leave alone. Put your own decisions in it.

## Three ways to close, one file

| Reason | Points at | Writes |
|---|---|---|
| Already built | the code, a setting, the README | nothing |
| Duplicate | its twin (GitHub's duplicate link) | nothing |
| Rejected request | the reason | `.out-of-scope/<topic>.md`: what's out, why, and Prior requests |

Only the rejection writes a file. If built things or duplicates went in there, the next triage would match new requests
against things you actually have. Commit the file: until it's pushed, a comment that quotes its path points nowhere.

## Rules of thumb

- **Check the claim before you label it.** A report can be right, wrong, or right about more than it says.
- **One conversation for one issue; one pass for the rest,** with "apply nothing yet" until you've read the table.
- **Write each no down once.** A fresh conversation (`/clear`) found `.out-of-scope/accounts.md` by itself and matched the
  new request to it; nobody had to argue it again.
- **Never post to someone else's project.** Copy the issues into your own tracker, read upstream with GET only.

**It's working if** every issue has exactly one category and one state, every comment starts with the disclaimer, the
out-of-scope file is committed, and a new request for the same idea is matched to it.

---
Spliit is open source under the MIT License, by Sebastien Castiel and contributors. The `triage` skill is from
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License, described here in our own
words. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock or by Spliit's authors.
