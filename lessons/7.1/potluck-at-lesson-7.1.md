# Potluck at lesson 7.1

Repository: https://github.com/OrMizrahi12/potluck (public). Clone it to look or to start from here; don't fork it.

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-7.1
```

The tag `lesson-7.1` points at `d1808ed`, the tip of the branch `worktree-balance-engine`. The branch is pushed and its check
passed, but it isn't merged, and no pull request is open yet. `main` is `292703a` (the tag `lesson-6.5`).

## The engine branch: six one-change commits after `aedf1b4`

The review's fixes, split so each commit holds one change, on top of `aedf1b4` (the tag `lesson-6.4`):

| Commit | Message |
|---|---|
| `d922089` | Name the balance map balanceById |
| `f473139` | Apply an expense's shares to balances where they're computed |
| `481c4ab` | Say "the member who owes most" instead of debtor and creditor |
| `8ddeb7c` | List the engine's preconditions on computeGroupMoney |
| `0c78ddd` | Test a payer who isn't a participant |
| `d1808ed` | Test that balances sum to zero |

They change two files, both in `potluck/` of this kit exactly as they are at the tag: `src/money/group-money.ts` (the engine;
its doc comment now lists the preconditions the group service guarantees, including ASCII expense ids) and
`src/money/group-money.test.ts` (nine tests). Tests, type-check and formatting passed on each commit. Of the seven redundant
bits from lesson 6.4, the simpler loop removed the `?? []` lookup; the rest were left as they are. The commits carry Claude Code's usual `Co-Authored-By` line, as
earlier Potluck commits do.

## The standards branch: `worktree-coding-standards` at `f59760d`

Made off `origin/main` in its own worktree (`~/potluck/.claude/worktrees/coding-standards`), because the standards are a
separate change from the engine:

| Commit | Message |
|---|---|
| `e433137` | Write down the coding standards the code already follows |
| `04fe688` | Define balance without the word "net" |
| `f59760d` | Point agents at CODING_STANDARDS.md from CLAUDE.md |

`CODING_STANDARDS.md` (36 lines) is in `potluck-coding-standards/` of this kit, exactly as it is on the branch. The glossary
change replaces "One member's net position in the group" with "One member's position in the group". `CLAUDE.md` gains a short
"Coding standards" section that tells agents to read the file before writing code. Pushed, check passed, not merged. Merge the
engine first: the standards file uses the engine's code as its examples.

## The comment on ticket #4

Posted by the session in this lesson (https://github.com/OrMizrahi12/potluck/issues/4):

> **Expense ids must be ASCII.**
>
> The balance engine (`computeGroupMoney` in `src/money/group-money.ts`, branch `worktree-balance-engine`) hashes an expense id
> with 32-bit FNV-1a over its UTF-16 code units. Those are the id's bytes only when the id is ASCII, and the odd-cent rule
> hashes the bytes. So, for "Shares follow spec #1's odd-cent rule … `FNV-1a(expense id) mod n`" to hold:
>
> - The service must assign expense ids that are ASCII. UUIDs, or integers turned into decimal strings, both qualify.
> - An id with a non-ASCII character would still get a deterministic offset, just not the one byte-wise FNV-1a gives. Any
>   other implementation of the rule would then put the odd cent on a different participant.
>
> This sits with the engine's other preconditions (at least one participant, valid amounts, ids that are members), which are
> listed on `computeGroupMoney`.

## One setting in the lesson's own clone

The repository on camera was created with `git init` in lesson 3.2 and never cloned, so it had no `origin/HEAD`, and
`/security-review` couldn't start. `git remote set-head origin --auto` set it to `main`, once. Your clone has it already.
