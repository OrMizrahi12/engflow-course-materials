# The issues it filed (turn 3's reply)

Claude's reply after it filed the three issues in our own copy of Spliit ("Brewed for 1m 30s"). Nothing was filed upstream. Our repository name is replaced with `<you>`.

| # | Title | Labels |
|---|---|---|
| 18 | Extract the expense form model from expense-form.tsx (strict refactor) | `ready-for-agent` (its body is `issue-18-spec.md`) |
| 19 | Expense amount limit is checked in whole units on the client and in cents on the server; split the expense schema | `bug`, `needs-triage`; blocked by #18 |
| 20 | Expense get/update/delete ignore groupId, so one group's link can act on another group's expense | `bug`, `needs-triage` |

---

I filed all three issues on <you>/spliit. I didn't create a branch or a PR.

- **#18: Extract the expense form model** (`ready-for-agent`). The body is the full spec from this session: Q1–Q12 and the hybrid interface we chose. It also lists the designs we rejected and why. Branded unit types are marked "reconsider after the schema split" rather than ruled out. It names the test cases to write first, and the three current behaviours to keep as they are and not fix:
  - the percentage preview doesn't round
  - a repayment opened without `?to=` gets an empty participant
  - the per-participant conversion uses the fetched exchange rate

  It mentions #12 and #13, two existing bugs in the same by-amount auto-balance logic. The refactor neither fixes them nor blocks them.
- **#19: Split the expense schema** (`bug`, `needs-triage`). It describes the bug: the form accepts amounts up to 1,000,000,000.00 but the server only takes up to 10,000,000.00, so a 50,000,000 expense passes the form and then fails with a raw error. It's marked as blocked by #18 on GitHub, so it shows up as blocked.
- **#20: Expense get, update and delete ignore `groupId`** (`bug`, `needs-triage`). With one group's link and another group's expense id, someone can read, overwrite or delete that expense, and the activity entry is logged in the wrong group. I rated it low severity, because expense ids can't be guessed. It doesn't depend on any of the refactoring, so it can be picked up any time.

I added nothing to `GLOSSARY.md` and wrote no ADR.

Of the other review candidates, recurring expenses created once per request, one expense shape for share calculations, money and per-device preferences have no issues yet. So does the rest of the `api.ts` restructuring beyond #20.
