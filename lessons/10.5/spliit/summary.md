# The summary: decided and still open

As printed in the session after my second answer ("Sautéed for 13s", no tools). I did not answer its last question in this
lesson: the dim suggestion in the prompt box afterwards is only a guess at my next message, and it was never sent.

Questions 1–12 are settled. No issue gets filed until you've chosen an interface.

**Decided**

- **Scope**: extract an expense form model from `expense-form.tsx`. `expenseFormSchema` stays as it is. Splitting the schema (candidate 2) comes after, as its own change.
- **Shape**: a plain TypeScript module of pure functions, with no React or react-hook-form imports. The component's effects become thin: read the values, call the model, set the values.
- **What the model owns**:
  - building initial form values for edit, repayment, and new from a URL or receipt scan
  - the submit mapping to minor units, including dropping the currency fields when no conversion happened
  - the split preview
  - auto-balancing a by-amount split
  - the figures behind the "must add up" error
  - `enforceCurrencyPattern`
  - converting in both directions between the original amount and the group-currency amount
- **What stays in the component**:
  - the `shareEdits` map and the dirty and reset triggers
  - the `localStorage` reads and writes; the model only converts the default splitting options it is given
  - the translated conversion-rate status message
  - working out from the URL whether `?amount=` is in cents or whole units; the model gets an already-read prefill object, and fixing that ambiguity is candidate 6
- **Arguments, not hidden calls**: the model takes today's date and an id generator as arguments, so tests behave the same in both of Jest's timezones.
- **Preview**: it builds a `ShareInput` and calls `getParticipantShare` directly, with reimbursements giving 0. The fake Prisma row goes. Tests check that the result matches `calculateShare`.
- **Auto-balance input**: the total amount, the current split values, the set of participants the user edited, and the group currency. It returns new split values.
- **Behaviour**: this is a strict refactor. Tests written against the new module will lock in today's behaviour, and the e2e specs must pass unchanged. Any behaviour change gets its own labelled commit. The likely one is routing the per-participant conversion at `:1264` through `convertToGroupCurrency`, which may round differently at the edges.
- **Location**: `src/app/groups/[groupId]/expenses/expense-form-model.ts`, with its test file beside it.
- **Glossary**: no new term. Inside the model, names use the existing glossary terms (split value, share, original amount, conversion rate, reimbursement).

**Still open**

1. **The interface itself.** For example: separate functions vs. one object built from the group and currency, how split values are typed on each side, and whether the preview returns one participant's share or all of them.
2. **Tracking (Q13).** Whether to file this as an issue with these decisions as its spec, branch and PR plan, and separate issues for candidate 2 and for the `groupId` scoping bug in candidate 3. That bug is a real gap: `getExpense`, `updateExpense` and `deleteExpense` ignore `groupId`. It doesn't depend on any of this, so you may want it filed sooner.

For item 1, I can have three or four sub-agents each design the interface from a deliberately different angle against the decisions above. I'd then lay the designs out side by side, compared on depth, locality and where the seam sits. Should I start that?
