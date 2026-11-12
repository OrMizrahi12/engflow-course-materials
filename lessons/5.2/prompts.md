# Lesson 5.2: every line typed or pasted, in order

Two windows: the **planning session** (the Claude Code session from lessons 3.1 to 4.2, still open) and the **lesson
terminal** (a plain shell). Claude Code ran in auto mode with Opus 5.5. What came back is summarized; your session will word
its replies differently.

## 1. What to-spec does (lesson terminal)

The lesson terminal starts in the plugin's skills folder
(`~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering`).

```bash
grep -n -E "^desc|^disab|NOT|^[0-9]\. |seam|^## |ready-for" to-spec/SKILL.md
```

Came back: the description (turn the current conversation into a spec, no interview, just synthesis),
`disable-model-invocation: true` (only you can start it, by typing `/to-spec`), "Do NOT interview the user", the three
steps (explore the repo; sketch the seams you'll test at, the highest one possible, "the ideal number is one", and check
them with the user; write the spec from the template and publish it with the `ready-for-agent` label), and the template's
headings.

## 2. Run it where you grilled (planning session)

Type `/to-spec`, pick it from the menu, type a space, then paste:

```text
Write it to spec-draft.md in this folder first and don't publish yet: the repo is public, so I'll read the draft before it goes up.
```

Came back (after 18 seconds): two proposed seams, "as few as the design allows":

1. **The group service**, the main seam: the server-side interface the pages call, with commands (create group, add
   expense, and the rest) and one read that returns the group view. Tests call it directly against a real Postgres schema
   in PGlite: every rule, the version check on edits, the migrations.
2. **Playwright on each pull request's preview**, for what only exists in the browser: the "who are you?" prompt, the
   "my groups" list, the formatted amounts, the phone-width layout.

Then a question: is this right, or do you also want direct tests on the pure money logic, for example a property test?

## 3. Answer the seams question (planning session)

```text
Yes, those two. Run that property test through the service.
```

Came back (after 2 minutes 7 seconds): `spec-draft.md`, 336 lines, not published, not committed. 96 user stories, the
implementation decisions with two short snippets from the prototype, the two seams in Testing, and a list of six gaps it had
filled itself ("Check these as you read"): the link token is at least 128 bits; expenses newest first; groups and members
carry version numbers; the database backs up some rules; exact text limits left open; an offline save shows an error.

## 4. Read the draft (lesson terminal)

```bash
cd ~/potluck
git status -s
wc -l spec-draft.md
grep -n "^## " spec-draft.md
grep -c -E "^[0-9]+\. As " spec-draft.md
sed -n '/^## Out/,/^## Further/p' spec-draft.md
```

Came back: `?? spec-draft.md` (untracked); `336 spec-draft.md`; seven headings (Problem Statement, Solution, User
Stories, Implementation Decisions, Testing Decisions, Out of Scope, Further Notes); `96`; the out-of-scope list, which
includes one line we never discussed: "Recurring expenses".

## 5. Check it against what we decided (lesson terminal)

The seven rules from the prototype (lesson 4.2) live only in Claude's notes. Your notes folder is named after your home
folder: look in `~/.claude/projects/` for the folder that ends in `-potluck`.

```bash
tail -9 ~/.claude/projects/<your-potluck-project-folder>/memory/potluck-v1-design.md
sed -n '/^## Impl/,/^## Test/p' spec-draft.md | grep -i -E "small set|5,000 settle|themselves|case-insens|no expenses and|too small|onto a participant"
grep -n -i -E 'hash\(|"N.A."|fraction digits|advisory lock' spec-draft.md
grep -c -i region spec-draft.md
grep -c -i typescript spec-draft.md
grep -n -i -E "backup|questionnaire|recurring" spec-draft.md
```

Came back: the seven rules in the notes, and a line in the draft for each of them (all seven made it). The odd-cent hash,
the 13 currency codes with no minor unit, explicit fraction digits and the advisory lock on migrations: all there.
`region`: `0`, good, because we never decided a hosting region and the draft didn't invent one. `typescript`: `0`, a
defect, because we chose TypeScript in module 3. Backups: a launch blocker, as parked. Line 316: "Recurring expenses"
(never discussed). Line 328: "a questionnaire is out with the first real group" (it was never sent).

## 6. One correction with four fixes (planning session)

```text
Four fixes before it goes up. The questionnaire was never sent: say it's written but not sent yet. Recurring expenses never came up: take them out of Out of Scope. Name TypeScript next to Next.js. Members carry a version number too, as the schema says. Your six filled gaps are fine.
```

Came back (after 14 seconds): the four replacements, its own notes updated (the questionnaire is written but not sent;
the stack's language is TypeScript), and the draft still untracked and unpublished.

## 7. Check the fixes (lesson terminal)

```bash
grep -n -i -E "typescript|questionnaire|recurring|members, expenses" spec-draft.md
```

Came back: line 146 "Next.js app in TypeScript", line 246 "Groups, members, expenses and settlements each carry a version
number", line 327 "a questionnaire ... is written but not sent yet", and no line about recurring expenses.

## 8. Publish (planning session)

```text
Publish it, then delete the draft.
```

Came back (after 20 seconds): a size check and a check for stray @-mentions, then
`gh issue create --title "Spec: Potluck v1" --label ready-for-agent --body-file <a temporary copy of the body>`, issue #1.
It compared the published body with the draft (no differences beyond a trailing newline), deleted the draft,
`git status -sb` was clean, and it updated its notes: the issue is now the source of truth.

## 9. On GitHub (browser)

Open the issue's link from the reply. Title "Spec: Potluck v1", issue #1, Open, the label `ready-for-agent` (its tooltip:
"Fully specified, ready for an AFK agent"), the sections, and at the bottom the event that added the label.

Back in the planning session, nothing more is typed. The window stays open for lesson 5.3.
