# Card: three reviewers, one diff

## Side by side

| | The plugin's `code-review` | Claude Code's `/code-review` | Claude Code's `/security-review` |
|---|---|---|---|
| Asks | Built right? The right thing? | What input would make this line wrong? | Is there a path an attacker could use? |
| Reads | The repo's written rules, classic code smells, the spec the commits cite | The diff, hunting for bugs | The diff against `origin/HEAD` |
| Needs | A fixed point (`main`) | Nothing; an optional level (no level: its default) | `origin/HEAD` in the repository (a clone has it) |
| Gives | Two reports, Standards and Spec, each with its worst issue | Many leads; it favors finding a lot over checking each one | Only confident, exploitable findings, each through a false-positive check (score 8 or higher kept) |
| Type | `/mattpocock-skills:code-review main` | `/code-review` | `/security-review` |

In Claude Code 2.1.323 the built-in `/code-review` runs in the background as a separate agent, and the session shows its triage
of the findings rather than the raw list. If `/security-review` stops on "ambiguous argument 'origin/HEAD...'", run
`git remote set-head origin --auto` once (a repository made with `git init` has no `origin/HEAD`).

## Then the same four steps, whichever reviewer it was

1. **Check each lead** against what it cites: the rule, the spec line, the code. By hand for one, by asking for evidence for
   the rest.
2. **Act on the ones with something real behind them:** a written rule or a failure you can show.
3. **Write the judgment calls down** in `CODING_STANDARDS.md`, so the next review reads them.
4. **Stop.** Every pass finds something new; act on what this one cites, then move on.

## It's working if

- Each finding you acted on has its evidence on screen, and each one you left has a reason.
- The out-of-scope findings were matched against what the spec decided, not argued away.
- A second pass reads your new rules (and may catch your own fixes breaking them), and you stop after it.

The plugin's `code-review` is from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License), described in our
own words; `/code-review` and `/security-review` are part of Claude Code. This course is unofficial, not affiliated with or
endorsed by Matt Pocock. First used in lesson 7.1.
