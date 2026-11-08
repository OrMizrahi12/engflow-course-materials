# Card: vibe coding

**What it is:** you describe what you want, the AI writes the code, and you judge the result by using it. You never
read the code. Matt Pocock's definition: accepting code without reviewing it.

**When it's fine:** throwaway code, where a failure costs nothing: a prototype, a one-off tool, a quick look at what an
idea could be.

**When it isn't:** anything that has to live: money, other people's data, an app you'll keep changing, anything
someone else relies on.

## The flow

idea → one prompt → code you don't read → you try the app → ship it?

What goes in: a wish in plain English. What comes out: an app that runs, plus every decision the AI made for you.

## Test it with real numbers (one line each)

1. An odd split: $100 between three people. Only one person pays the extra cent.
2. Change a settled expense: the balances still make sense, and the person who paid never owes.
3. Someone leaves with a debt: the debt stays until it's paid.
4. A currency without cents: ¥1,000 between three is ¥334 + ¥333 + ¥333.
5. After a change, the old data still adds up.
6. Type money the way people do: `12,50` is twelve-fifty, never twelve hundred fifty.

## Runs on my laptop, or lives in production

| On my laptop | In production |
|---|---|
| one folder | a repository with history |
| checks run once | tests on every change, behind a gate |
| no review | reviewed |
| data in one browser | a real database |
| a `file://` address | an address anyone can open |

From lesson 1.2 of *Claude Code: The Professional Engineering Workflow*. This course is independent: unofficial, and
not affiliated with or endorsed by Matt Pocock.
