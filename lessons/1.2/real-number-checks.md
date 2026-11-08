# Six real-number checks

Test your v0 the way a user would, with numbers friends really use. Do them in this order: checks 1 to 3 on the app the
first prompt built, check 3 again after change request 1, checks 4 to 6 after change request 2. Write down what your
app shows, then compare it with the right answer.

| # | When | What to do | The right answer | What v0 did on camera | Your app |
|---|---|---|---|---|---|
| 1 | after the first prompt | Group "Ski trip" with Ana, Ben and Cy. Ana pays a $100 cabin, split between all three. Read any "each" hint before you save, then the balances. | $100 doesn't divide by three: the shares are $33.34 + $33.33 + $33.33, so only **one** person pays the extra cent. Ana gets back $66.66 (or $66.67), the other two owe $33.33 (or one of them $33.34). The balances add up to zero. A hint that says "$33.34 each" is wrong (three times $33.34 is $100.02). | Balances right (Ana gets back $66.66, Ben and Cy owe $33.33). The hint said **"$33.34 each"**: wrong. | |
| 2 | after the first prompt | Mark the suggested payments paid ("everyone's square"). Then the cabin turns out to cost $120: change it. | You can edit the expense. Afterwards Ben and Cy each owe $6.67 (a $40 share minus the $33.33 they paid) and Ana gets back $13.34. At no point does Ana, who paid, owe money. | **No way to edit** an expense, only delete. Deleting the cabin left the two payments, so Settle up turned around: **Ana owed $66.66**. Logging the cabin again at $120 gave the right $6.67 / $13.34. | |
| 3 | after the first prompt, and again after change 1 | Cy leaves the trip early: remove Cy from the group. | A clear rule you agree with. A sensible one: Cy stays in past expenses, Cy's debt stays until it's paid, and new expenses leave Cy out. The totals still add up. | Before change 1: refused ("Cy is part of some expenses — delete those first."). After change 1: Cy moved to "Left the group", still owed $6.67, and new expenses offered only Ana and Ben. Right, but the rule was Claude's decision. | |
| 4 | after change 2 | Group "Japan" in yen with Ana, Ben and Cy. Ana pays ¥1,000 for dinner, split between all three. | Yen has no cents: shares ¥334 + ¥333 + ¥333, no decimals anywhere. Ana gets back ¥666 (or ¥667), the others owe ¥333 (or one of them ¥334). | Right: hint "¥333–¥334 each", Ana gets back ¥666, Ben and Cy owe ¥333. | |
| 5 | after change 2 | Go back to the Ski trip. Does it still add up? | Exactly what it showed before the changes: Ben and Cy owe $6.67, Ana gets back $13.34. | Right: unchanged. Checked by hand, once. | |
| 6 | after change 2 | Group "Paris" in euros with Ana and Ben. Ana buys a coffee and types the price the way most of Europe writes it: `12,50`. | €12.50, so Ben owes €6.25. Or a clear message asking for a dot. | **€1,250.00**: the comma was read as a thousands separator, and Ben owed €625.00 for half a coffee. | |

## One more: check the summary too

Claude's own summary after change 2 had a wrong example: "¥20,000 split three ways comes out as ¥7,000, ¥7,000 and
¥6,999". Those add up to ¥20,999. The right split is ¥6,667 + ¥6,667 + ¥6,666 (the hint it quoted next,
"¥6,666–¥6,667 each", was right). Read every number in a summary the way you read the app.

## Why these six

Each one is a question nobody answered before the code was written: who pays the odd cent, what happens to a settled
expense, what leaving means for money, how a currency without cents works, whether old data survives a change, and how
people really type amounts. In a vibe-coded app, the AI answers them silently, and you only find out by testing.
