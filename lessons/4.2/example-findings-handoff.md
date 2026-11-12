# Handoff: what the Potluck logic prototype showed

Written 2026-11-11. The prototype session ran in `~/potluck-prototype` and is done. The next session runs in `~/potluck` (the real repo) and turns these findings into decisions. Decisions are the user's to make: put each to them as a question with a recommendation.

## Read first (don't duplicate)

- `/tmp/potluck-prototype-handoff.md`: the brief the prototype was built from. It holds every rule the prototype implements (money, members, expenses, the odd-cent rule, balances, settlements, greedy suggested settlements). None of those rules were changed.
- `~/potluck/GLOSSARY.md`, `~/potluck/docs/research/odd-cent-rounding.md`: unchanged, and still canonical.
- `~/potluck-prototype/potluck-balances.PROTOTYPE.html`: the prototype itself. Open it in a browser. It has 13 scenario tabs that reproduce each finding below, plus an "Experiments" tab. The pure logic sits in `<script id="potluck-logic">`, a reducer plus pure functions with no DOM, which can be lifted into the real code once the rules are settled.

## State of the prototype

- All scenarios were run end to end in headless Chrome. Every rule behaved as specified, and the "balances sum to zero" check passed after every action.
- `~/potluck-prototype` is **not a git repo**. Nothing was committed. The prototype skill's capture step (commit the prototype to a throwaway branch and point to it from the implementation issue) is still open. Ask the user where it should live, for example a `prototype/balances` branch in `~/potluck`.
- Nothing in `~/potluck` was modified.

## Findings, with the decisions they raise

1. **Greedy isn't "the smallest set".** This was the known tension. Random groups, with 2,000 to 10,000 groups per size:
   - With amounts like $37.81, greedy was worse than the true minimum 0% of the time at 4–7 members, about 0.1–0.3% at 8–9, and about 0.6% at 10.
   - With round amounts like $40.00, it was worse 0–0.3% of the time at 4–7 members, about 1–2% at 8–9, and about 5% at 10, with at most 2 extra settlements.
   - Greedy loses only when a subset of balances cancels out exactly. Odd cents rarely allow that.
   - A minimal case (the "Greedy isn't fewest" tab) has balances of +20, +40, −50, −40 and +30. Greedy gives 4 settlements; 3 would do.
   - An exact minimum (a subset DP, `fewestSettlements` in the prototype) costs about 14 ms at 18 nonzero balances and isn't feasible at 50.
   - **Decision:** reword "smallest set" to "a small set", or use the exact minimum below a size threshold and greedy above it. The prototype didn't change the rule.
2. **Editing an expense moves the odd cent onto members who weren't touched.** Changing the participant count `n` changes `hash(id) mod n`. In the "Editing moves the cent" tab, swapping Ben for Dee moves the cent to Cai. Shares are restored exactly when the edit is reverted. **Question:** is a 1-unit balance change on an untouched member acceptable, and should the UI explain it?
3. **The rotation is fair.** Over 1,000 expenses among 5 members, the rotation gave each member 276–299 leftover units. "First by creation order" gave 582 down to 0. This supports the existing rule; nothing to decide.
4. **Zero shares are possible.** ¥6 split among 7 gives one participant ¥0. BHD 0.001 split between 2 gives one of them 0.000. The rules allow both. **Question:** allow, warn, or refuse when the amount is smaller than the number of participants?
5. **An inactive member can get several suggested settlements.** Dee, who moved out, was asked to pay both Ana and Ben. Greedy doesn't minimise the number of settlements per person. This is minor and may be worth a note.
6. **Self-settlement (undecided).** If allowed, it is recorded but changes no balance, so it does nothing. The prototype refuses it by default, behind a switch. **Recommendation:** refuse it.
7. **Gaps the rules don't cover:**
   - **Changing currency** after a group has expenses or settlements would reinterpret every stored minor-unit amount. The prototype refuses it.
   - **Settlements have no cap.** Only expenses are capped at 5,000.
   - **Duplicate member names** are allowed, which makes suggested settlements ambiguous.
   - **HUF** shows 2 decimals per ISO 4217, which may look odd to Hungarian users (forints are usually shown without decimals).
8. **Caps are fine.** With 50 members and 5,000 expenses, recomputing the ledger, suggestions and invariants takes about 10 ms in Node, and a single reducer edit about 0.06 ms. Nothing needs to change.

## Implementation notes worth keeping

- FNV-1a is 32-bit over UTF-16 code units of the expense id (`Math.imul(h, 0x01000193)`, offset basis `0x811c9dc5`), `>>> 0`.
- Greedy breaks ties by member creation order, so it is deterministic.
- Amount text is parsed to integer minor units by string handling, never through floats.
- Expense ids in the prototype are sequential (`exp-N`). The real ids will differ, so the rotation offsets seen in the scenarios won't carry over.

## Still open elsewhere (unchanged)

- Real backups are a launch blocker.
- The questionnaire for the flatmate who tracks the flat's money is still out with the user. Its answers may challenge "one currency per group" and "one payer per expense". Don't assume the answers.

## Suggested skills

- **`mattpocock-skills:grilling`**: put findings 1, 2, 4, 6 and 7 to the user one at a time, each with a recommendation.
- **`mattpocock-skills:domain-modeling`**: if "suggested settlement" is redefined, for example as "a small set" rather than "the smallest set", or if rules are settled for self-settlement, zero shares or currency changes, record that in `~/potluck/GLOSSARY.md` or an ADR.
- **`mattpocock-skills:prototype`**: only for the capture step (commit the prototype to a throwaway branch and leave a pointer on the implementation issue), or if a decision needs another prototype pass.
- **`mattpocock-skills:tdd`**: when the validated logic module is lifted into the real code.
