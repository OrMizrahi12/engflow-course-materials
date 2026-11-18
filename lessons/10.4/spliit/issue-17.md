# #17 Expense title and currency accept blank values; add a shared visible-text rule and a CI check for length-only text rules

Label: `needs-triage`. Filed by the Claude Code session in Lesson 10.4, exactly as below.

---

Follow-up from the retro on #14 (group name of only spaces).

**Problem**

#14 fixed the group name in `src/lib/schemas.ts` by counting only visible characters. Other user-facing text fields still validate with a length-only `z.string().min(n, 'minN')`, which counts spaces, tabs, no-break spaces (U+00A0) and zero-width spaces (U+200B) as characters:

| Line (at `59c41d7`) | Field | Rule | Blank value that passes |
|---|---|---|---|
| `:17` | group currency symbol | `min(1, 'min1')` | `" "` |
| `:23` | participant name | `min(2, 'min2')` | `"  "` (tracked in #16) |
| `:66` | expense title | `min(2, 'min2')` | `"  "` |

Checked against the same zod rule in isolation (`z.string().min(2,'min2').safeParse('  ')` and `z.string().min(1,'min1').safeParse(' ')` both succeed). Not reproduced through the app or the real schema for the title or currency.

Expected: a blank title or currency is rejected the same way as an empty one, with the existing `min2` / `min1` message.

**Proposal**

1. Extract the #14 rule from `groupFormSchema.name` into one helper in `src/lib/schemas.ts`, e.g. `visibleText(min, max)`, that counts characters after removing `[\s\p{Cf}]` and reports the existing `minN` / `maxN` keys. Checked, not trimmed: the value is saved as typed (same decision as #14).
2. Use it for the group name, the expense title and the currency symbol. #16 (participant name) can use the same helper.
3. Unit-test the helper once in `src/lib/schemas.test.ts`, in the style of the #14 group-name tests.
4. Add a CI step to `.github/workflows/ci.yml` that fails when a length-only rule with a user-facing message key comes back. This is the signature that matched every affected field (and nothing else) at `59c41d7`:

   ```sh
   ! grep -nE "\.min\([0-9]+, 'min[0-9]+'\)" src/lib/schemas.ts
   ```

   The message key (`'min1'`, `'min2'`) marks a field shown to users; ID fields use `.min(1)` with no key and are not matched.

**Out of scope / decide in triage**

- U+3164 (Hangul Filler) still passes the #14 rule; see #16.
- Whether the currency symbol should accept other invisible input, or move to a fixed list, is a separate question.

Related: #14, #16.
