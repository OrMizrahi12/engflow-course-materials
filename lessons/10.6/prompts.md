# Lesson 10.6 prompts and commands, in order

Everything typed or pasted on camera, in order, with what came back. The session is the one from lesson 10.5
(`spliit-architecture`, tab 6), where the expense form model was grilled; the last two rows run in a plain shell tab inside
your standalone copy of Spliit. Times are the turn's own clock.

| # | Where | Typed or pasted | What came back |
|---|---|---|---|
| 1 | session | `Yes, start them.` (typed) | "Baked for 3m 42s": Claude read the skill's design-it-twice page, set the constraints in one line, launched four background sub-agents (minimal, flexible, most common caller, units in the types); they came back after 1m 29s, 1m 42s, 2m 12s and 2m 12s; then the four designs, the comparison on depth, locality and seam placement, and a recommendation: a hybrid |
| 2 | session | my pick and the ADR question (pasted, below) | "Churned for 17s": the `domain-modeling` skill loaded; "None of them pass": every rejected design fails "hard to reverse"; no ADR, nothing for the glossary; Q13 (tracking) asked again |
| 3 | session | `Yes. File all three issues. No branch or PR today.` (typed) | "Brewed for 1m 30s": three issues in our own copy: #18 the spec (`ready-for-agent`), #19 the schema split (`bug`, `needs-triage`, blocked by #18), #20 a `groupId` scoping gap (`bug`, `needs-triage`) |
| 4 | shell | `gh issue list --limit 4` | #20, #19, #18, #17 with their labels |
| 5 | shell | `gh issue view 18 --json body --jq .body \| less`, then `/Interface shape`, `/Rejected and not`, `/Pin these`, `/Done when`, `q` | the spec: Why, What, Decisions, Interface shape (the chosen hybrid, then "Rejected and not to be reintroduced here"), Tests (ending in "Pin these current behaviours"), Done when, Related |
| 6 | shell | `git status` | `nothing to commit, working tree clean` |

Your issue numbers will differ. Claude Code may show a dim suggestion in the prompt box (on camera "Yes, start the
design-it-twice agents", later "Go with the hybrid"): it is only a guess at your next message, and it was never sent.

## Prompt 1: start the designs

```
Yes, start them.
```

The answer to the question the last lesson ended on ("For item 1, I can have three or four sub-agents each design the
interface from a deliberately different angle ... Should I start that?"). If your session ended differently, ask for it in
your own words, for example: "Design the interface of <candidate> twice: start three or four sub-agents in parallel, each under
a different constraint, then compare them on depth, locality and seam placement."

## Prompt 2: the pick, and the ADR question

```
The hybrid. It keeps the guards in the component and the preview whole, as we decided. Before we go on: does any rejected design pass the three ADR tests?
```

The pick comes with its reason, in the decisions already made (Q8 kept the guards in the component, Q9 made the preview return
every share at once). The second sentence asks the `domain-modeling` question: an ADR is written only when a decision is hard
to reverse, surprising without context and the result of a real trade-off.

## Prompt 3: file the decision

```
Yes. File all three issues. No branch or PR today.
```

The answer to Q13 (tracking). "No branch or PR today" keeps this lesson to the design: the issue is the hand-off.
