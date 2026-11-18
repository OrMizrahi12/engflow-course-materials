# #16 A participant name of only spaces (or other invisible characters) passes validation

Label: `needs-triage`. Filed by the Claude Code session in Lesson 10.4, exactly as below.

---

Split out from #14, which fixed the same flaw for the **group** name only.

**Description**

Participant names are validated with `z.string().min(2, 'min2').max(50, 'max50')` in `groupFormSchema` (`src/lib/schemas.ts`, the `participants` array). The rule counts characters, not visible ones, so a participant named with two or more spaces, tabs, no-break spaces (U+00A0) or zero-width spaces (U+200B) is accepted. The group form, `groups.create` and `groups.update` all validate against this one schema.

Not reproduced separately for participants. Expected from the shared pattern: such a participant is saved and shows with no visible name in the participant lists, the "Who are you?" dialog and the paid-by/paid-for pickers.

**Expected:** the same result as an empty participant name: "Enter at least two characters." under that participant, and nothing saved.

**Notes for whoever picks this up**

- #14 fixed the group name by counting only visible characters: `name.replace(/[\s\p{Cf}]/gu, '').length >= 2`, reporting `min2`. Names are checked, not trimmed: surrounding spaces are kept as typed.
- The duplicate-name check in the same schema's `superRefine` compares raw strings, so `"John"` and `"John "` count as different participants. Decide whether that is in scope.
- **U+3164 (Hangul Filler)** renders blank but is neither whitespace nor a format character (`\p{Cf}`), so the #14 rule still accepts it, for group names too. It was deliberately left out of #14; decide here whether to handle it (for both names) or not.
