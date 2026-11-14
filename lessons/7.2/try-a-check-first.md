# Try a check before it can block a merge

A new check joins `npm run check`, and from then on CI fails every pull request it flags. So try it first, on real code,
while it can't block anything yet.

1. **Red on the old mistake.** Run it on a commit that still has the slip (in the lesson: `aedf1b4`, the engine before the
   review). It should flag exactly the slips you know about. If it misses one, it isn't the check you need yet.
2. **Run it over today's code.** Run it on `main` with the waiting branch merged in. Each hit is one of two things:
   - a **real slip nobody saw** (in the lesson: `const trip`): fix it in its own commit, before the rule goes in, so `main`
     doesn't start failing;
   - a **false positive**: narrow the rule. If it can't be narrowed without guessing, that part stays a judgment call in
     `CODING_STANDARDS.md` (in the lesson: glossary entries with a qualifier, like "Split (as a noun)").
3. **Prove it blocks.** Make one small file that breaks the rule and try to commit it: the pre-commit step should refuse it.
   Then delete the file.
4. **Wire it in.** Only now: the check runs from `npm run check` (CI) and the pre-commit step.
5. **Shrink the written rule.** Whatever the check enforces comes out of `CODING_STANDARDS.md`; the file keeps only what no
   tool can judge.

Ask for it in one line: "Before the rule goes in, try it: run it over the old code and over main with the change merged in,
and show me what it flags in each."
