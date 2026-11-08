# The three prompts of Potluck v0

These are the exact words used in lesson 1.2, in order, in one Claude Code session. Nothing else was typed into
Claude. Use them as they are: the point is to see what one plain-English prompt gives you.

## 1. The one prompt (pasted)

```text
Build me a web app called Potluck for splitting shared expenses with friends. You make a group, add people, log who paid for what and who it was for, and it shows who owes who and the easiest way to settle up. Keep it simple and make it look nice.
```

## 2. Change request 1 (typed, after testing v0 in the browser)

```text
Cy left the trip early. Let me remove people from a group.
```

## 3. Change request 2 (typed, after testing change 1)

```text
Next trip is Japan. Let groups pick dollars, euros or yen.
```

## If Claude asks you something

In the lesson Claude didn't ask any questions. If it asks you one, answer like a vibe coder in a hurry:

```text
Your call. Keep it simple.
```

If it tells you to start a server to see the app, ask it to do that for you, then open the address it prints:

```text
Start it for me.
```

## What happened on camera (Claude Code 2.1.319, Opus 5.5, auto mode)

| Prompt | Claude's own timer | What it did |
|---|---|---|
| The one prompt | 3 min 24 s | wrote `logic.js`, `index.html`, `app.js`, `styles.css`; checked 2,000 random splits and clicked through the app in a browser with no window; fixed two small bugs it found; no test files |
| Change 1 | 54 s | "left the group" instead of deleting: Cy stays in past expenses and in Settle up until paid; changed `app.js` and `styles.css` |
| Change 2 | 1 min 16 s | found that yen was already listed but broken (amounts kept in hundredths); whole-yen amounts; a dollars / euros / yen picker; no switching between yen and the others once a group has expenses; changed `logic.js`, `app.js`, `styles.css` |

Your v0 will be different: Claude builds something new on every run. That's fine, and it's part of the lesson.
