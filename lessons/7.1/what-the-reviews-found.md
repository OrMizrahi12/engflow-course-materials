# What the reviews found, and what we did with it

Lesson 7.1, in our words. Your own run will find different things: every pass finds something new. What carries over is the
shape: who looked, what each finding cited, and why we acted or didn't.

## Round one: three reviewers on one diff

The diff: `main...HEAD` on `worktree-balance-engine`, seven commits from lesson 6.4, two files (`src/money/group-money.ts` and
its test).

### The plugin's `code-review` (fresh session, fixed point `main`)

**Standards** (the repo's written rules: `GLOSSARY.md`, `docs/agents/domain.md` and `landing.md`, the decision records, the
odd-cent research doc; the repo had no `CODING_STANDARDS.md` yet):

| Finding | Kind |
|---|---|
| `net` names the balance map; the glossary lists "net" as a word to avoid for Balance | breaks a documented rule (clear) |
| "debtor" and "creditor" in `suggest()` and one test name; both are on the glossary's Avoid lists | breaks a documented rule (probable: the glossary has no word for a member who owes) |
| one settlement shape written twice | possible smell (opinion) |
| plain numbers and strings for amounts and ids | possible smell (opinion) |
| unclear names (`Share.share`, `open`, `out`, `s`, `n`, `add`, `extra`) | possible smell (opinion) |
| one long function | possible smell (opinion) |
| a field (`extra`) that only the tests read | possible smell (opinion) |

**Spec** (spec #1 and its latest comment): all seven tests pass; nothing built beyond the spec; nothing that looks wrong. Gaps
in what the tests state: no suggestions when everyone is settled up, balances summing to zero, the same answer every time, a
payer who isn't a participant, inactive members. One caveat: the hash runs over UTF-16 code units, not bytes, so it matches the
spec only for ASCII ids.

### Claude Code's `/code-review` (bugs)

Eight findings, shown as the session's triage. Six describe input spec #1's comment calls untested preconditions, because the
group service refuses it first: zero participants, an unknown payer or participant id, negative or too-small amounts,
non-integer amounts, and two expenses with one id (which the database can't produce, though the simpler code it suggested
still stands). One is cheap enough not to matter (re-sorting with at most 50 members). Two are worth acting on: the UTF-16
hash (the same caveat as the Spec review) and the missing tests.

### Claude Code's `/security-review` (attack paths)

No high or medium vulnerabilities. The change is one pure function with no input or output, and nothing calls it yet. No
prototype pollution (figures are kept in a `Map`); the hash only picks who gets the odd cent; bad input gives wrong numbers but
exposes nothing, so the group service should check it when it calls the engine. No findings, so no false-positive checks.

## The evidence check

One lead by hand (`grep` of the glossary): the debtor/creditor finding holds in part. The words are banned as names for the
payer and the participant; the engine uses them for a member who owes or is owed, which the glossary has no word for.

Then every lead, with evidence, in one answer: of roughly 30 findings, only a few call for changes. A correction to its own
earlier report: two Standards findings point at wording the code took from the spec (spec line 213 says "match the largest
debtor with the largest creditor"; the unclear names come from the spec's reference code). It checked the bug hunter's
arithmetic itself: 100.5 split three ways gives 101, real but out of scope, because amounts are whole minor units and parsing
stays with ticket #4. The `extra` field stays: the group view will flag who got the leftover unit.

## What we decided

| Acted on | Why |
|---|---|
| rename `net` | a written rule (the glossary's Avoid list) |
| "the member who owes most" instead of debtor/creditor, in code and test names | a written rule; the spec keeps its words, because it records the decision |
| two tests: balances sum to zero; a payer who isn't a participant | spec rules no test stated |
| apply each share to the balances where it's computed | simpler code, the bug hunter's point |
| state the ASCII assumption next to the other preconditions | a real failure case behind it (the hash) |
| `CODING_STANDARDS.md`, its own commit | the rules this review relied on, written down for the next one |

Left as they are: everything with no rule or failure behind it (the opinion smells, the out-of-scope input cases).

## Round two: the same review again

With `CODING_STANDARDS.md` as its main standard, over nine commits:

- **No correctness bugs and no new missing requirements.**
- The fix commit bundles five changes, which breaks the new rule "one behaviour per commit" (the session owned it).
- The glossary itself still defines a balance as a "net position", the word the new standard bans.
- `landing.md` says never mix two changes in one PR, and the standards file rides on the engine's branch.
- The Spec side ran a scratch check: across 2,000 random groups, the shares always added up.
- Not asked for: the standards file probably belongs in its own PR; ticket #4 should know about the ASCII precondition.

Second-pass points we chose to leave: an older commit message that uses "debtor" and "creditor" (the rule covers code, comments
and test names), "the body says why" on three older commit messages, and the minor test gaps we had already left.

## And then we stopped

One commit per change on the engine branch (six), the standards on their own branch off `origin/main` with the glossary wording
fixed and a pointer in `CLAUDE.md`, a comment on #4, both branches pushed and green. No third review: another pass would find
more, so the rule is to act on what this pass cited, and move on.
