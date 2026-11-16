# Card: day one in someone else's codebase

One page from Lesson 10.1. Before you change code nobody on your side wrote: make a copy that can't reach the original,
run it the way its README says, and get its words written down.

## In order

| Step | How (on camera) | Why |
|---|---|---|
| A copy that can't reach upstream | `git clone`, `git reset --hard <commit>`, `git remote remove origin`, `gh repo create <name> --private --source . --push` | a fork stays linked to its parent; a standalone copy has nowhere to send a pull request by accident |
| Pin one commit | `git reset --hard 73478ed` | their main keeps moving; everything after this works on the same files |
| Their automation | `gh workflow list`, then `gh workflow disable` for what is theirs (release image, end-to-end, benchmark) | it came with the code and runs on your account; keep CI, which checks your work |
| Run it from its README | its own steps: a database, `.env`, `npm install` (the migrations), `npm test`, `npm run dev` | the README is the contributor's path; a full green test run is your starting line |
| Setup, once per repo | `/setup-matt-pocock-skills` | tracker, triage labels and domain-doc layout for the engineering skills |
| Its words | `/grill-with-docs` with "help me document this repo"; answer "Document what's here, rename nothing" | a glossary that disagrees with the code misleads the next reader |
| Decisions it inherited | ask each ADR to say where its reason comes from (a commit, a PR, a code comment), or that none was found | an invented reason for someone else's choice is worse than no record |
| Two projects, two glossaries | compare the glossaries: same idea under a different word, same word with a different meaning | the clash is where people talk past each other |

## Rules of thumb

- **Clone, don't fork,** when the copy is yours to work in and nothing should flow back.
- **Disable, don't delete,** workflows that aren't yours: a repository setting, the code stays as it was.
- **Read before you run, run before you change:** the README's steps, then all the tests.
- **"Source of the reason: none recorded" is a good answer.** Ask the maintainer before reversing that decision.

**It's working if** `gh repo view` says `"isFork": false`, the tests pass before you touch anything, `GLOSSARY.md` grew
while you answered, and every decision record names its source or says none was found.

---
Spliit is open source under the MIT License, by Sebastien Castiel and contributors. The `setup-matt-pocock-skills` and
`grill-with-docs` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT
License, described here in our own words. This course is independent: unofficial, and not affiliated with or endorsed by
Matt Pocock or by Spliit's authors.
