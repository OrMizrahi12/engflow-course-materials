# Does any rejected design pass the three ADR tests? (turn 2's reply)

Claude's answer after it loaded the `domain-modeling` skill ("Churned for 17s"). No ADR was written.

---

None of them pass. All three tests have to hold, and every rejected design fails the first one: **hard to reverse**.

| Rejected design | Hard to reverse | Surprising without context | Real trade-off |
|---|---|---|---|
| **A**: change union for the reactions | ✗ The expense form is the only caller of a module that lives in its own folder. Switching later rewrites one component's effects. | ✗ Named functions are the default. Nobody wonders why there's no union. | ✓ |
| **B**: exported per-split-mode rules table | ✗ The table is still built, just not exported. Exporting it later is a one-line change. | ✗ Keeping an implementation detail private needs no explanation. | ✓ |
| **C**: per-participant preview | ✗ Cheap to change. | ✗ The behaviour is already decided (Q9) and visible in the code. | ✓ |
| **D**: branded unit types | ✗ Brands can be added later without touching any runtime behaviour. | ~ A reader might ask why amounts aren't branded, given ADR-0003. | ✓ |

D comes closest, but recording it would mislead future reviewers. The reason for rejecting brands is temporary: the form's state can't carry them while `expenseFormSchema` checks both the form's typed values and the minor units the server receives. Candidate 2 removes exactly that constraint. An ADR saying "we decided against branded units" would then stop a future review from suggesting the right move at the right moment.

So no ADR, and nothing to add to `GLOSSARY.md` either; Q7 already settled that the expense form model isn't a domain term.

The design tree for this candidate is now complete: Q1–Q12 and the hybrid interface are decided. The only branch still open is **Q13: tracking**. That means filing the GitHub issue with these decisions as its spec, the branch and PR plan, and the separate issues for candidate 2 and the `groupId` scoping bug. Want to take that now?
