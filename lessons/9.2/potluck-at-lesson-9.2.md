# Potluck at the tag `lesson-9.2`

Repository: `https://github.com/OrMizrahi12/potluck` (public; clone it, don't fork it). The tag `lesson-9.2` points at
`2ce5739`, the same commit as `lesson-9.1` and `lesson-8.3`.

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-9.2
```

## What changed in this lesson

Nothing on `main`. Working a map writes decisions, not code:

- Issues: #44, #45, #47, #48, #49 and #50 resolved and closed, each with a resolution comment; #47 to #50 were created in
  this lesson, wired with GitHub's "blocked by" links, as children of the map #41. The map's body now has eight lines in
  Decisions so far and one item in "Not yet specified".
- One branch: `prototype/foreign-amount-ui` (`545685e`), the throwaway UI prototype for #50. No pull request; never merged.
  Look at it with `git fetch origin prototype/foreign-amount-ui` and `git log origin/prototype/foreign-amount-ui`.
- `git ls-remote origin 'prototype/*'` lists it next to `prototype/balances` from lesson 4.2.

## Open pull requests

None (`gh pr list`).
