# Prompts (Lesson 4.1)

Every line typed or pasted in the lesson, in order. Use your own words; these are the ones from camera.

## In the lesson terminal (`~/potluck`): the research skill

Pasted, because the path is long:

```bash
cat ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/research/SKILL.md
```

## In the planning session (Claude Code, `~/potluck`)

**1. The question** (`/research` typed, then a space; the question was written beforehand and pasted as one line):

```text
/research One question: when an equal split doesn't come out even in the currency's smallest unit, who gets the leftover? Check what real expense-splitting apps and money libraries do, and where each currency's number of decimals comes from (ISO 4217). Stop when we can pick a rule. Cite only pages you opened.
```

The command echoes as `/mattpocock-skills:research`. About 18 seconds later: `Agent(Research odd-cent split rules)`,
"Backgrounded agent", and the plan. The agent finished after 4 minutes 25 seconds; Claude read the file and reported back
in the same conversation, ending with "Which odd-cent rule do you want, and (a) or (b)?"

## In the lesson terminal: check the file

```bash
git status -sb
grep -c 'https://' docs/research/odd-cent-rounding.md
cat docs/research/odd-cent-rounding.md
```

`git status -sb` showed `?? docs/research/`; `grep -c` printed 12. Tab completed the file name.

## In the browser: follow two links

Pasted into the address bar (citation 3 narrowed to lines 44 to 49, then citation 8):

```text
https://github.com/spliit-app/spliit/blob/73478ed2f67a59e83866948caeece6bf2ecb985e/src/lib/shares.ts#L44-L49
https://tc39.es/ecma402/#sec-currencydigits
```

## Back in the planning session

**2. The decision** (typed):

```text
The Spliit rule, and (a). Both go in the spec.
```

Twelve seconds: both rules written out, "The odd cent is no longer open."

**3. The questionnaire** (typed):

```text
/to-questionnaire Questions for the first group that will use Potluck.
```

Four seconds: "Before I write the questionnaire, I need to know who's getting it. Who is it going to?"

**4. Who it goes to** (A1, written before recording, pasted):

```text
The friend who keeps track of the money in the first group that will use Potluck: four flatmates who also travel together. I'm one of them. They're not technical, but they know how the group really splits and pays each other back today.
```

Eight seconds: "What do you need back from them?" with nine numbered candidates.

**5. What you need back** (A2, written after reading the list, pasted):

```text
Keep 2, 4 and 7, cut the rest, and add one: whether an extra cent that rotates between people feels fair to them. Most of all I need to know if one currency per group and one payer per expense hold up for them.
```

Thirty-two seconds: `Write(to-questionnaire-first-group.md)`, four sections in priority order, and two things to sort
out before sending (fill in the deadline; don't commit the answered copy).

**6. Keep it out of git** (typed):

```text
Add it to .gitignore.
```

## In the lesson terminal: the questionnaire skill and the file

```bash
cat ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/productivity/to-questionnaire/SKILL.md
grep '^#' to-questionnaire-first-group.md
cat to-questionnaire-first-group.md
```

The first line was pasted; the other two typed, with Tab for the file name.

## Back in the planning session: commit and push

```text
Commit the research and the .gitignore.
```

```text
Push it.
```

`b7e1c03` "Add odd-cent rounding research; ignore the first-group questionnaire", then `183fe54..b7e1c03 main -> main`.

## In the lesson terminal: one last look

```bash
git log --oneline -3
git status -sb
```
