# Prompts (Lesson 3.4)

Every line typed or pasted in the lesson, in order. Use your own words; these are the ones from camera.

## In the lesson terminal (`~/potluck`): measure first

```bash
grep -F '**' GLOSSARY.md
wc -w GLOSSARY.md
```

`grep` listed the nine terms (every term in the file starts with two asterisks); `wc -w` gave 278 words. Tab completed
`GLOSSARY.md` both times.

## In the planning session (Claude Code, `~/potluck`)

**1. The command and its line** (`/domain-modeling` typed and picked from the menu; the line after it was written
beforehand and pasted):

```text
/domain-modeling Before the spec, put our words under pressure. Find the words that do two jobs, and invent edge cases that test where one term ends and the next begins. Write down only what we settle.
```

Back came six questions, W1 to W6, each with an edge case Claude invented and a recommended answer after the arrow
(46 seconds, no tool call).

**2. When W2's example didn't add up** (typed):

```text
/wait-what W2
```

The re-pitch (8 seconds) began "W2, again. My first example was wrong" and gave a corrected example.

## In the lesson terminal: the skill file

Pasted, because the path is long:

```bash
cat ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/productivity/wait-what/SKILL.md
```

## Back in the planning session

**3. The answers, by number** (written after reading the round, pasted):

```text
W1 Yes. W2 Yes, with your corrected example. W3 Yes, as a rule for the spec. W4 Yes, also for the spec. W5 Yes. W6 Yes.
```

Claude edited `GLOSSARY.md` in place (16 seconds) and held two rules for the spec.

## In the lesson terminal: the same two commands

The Up arrow brought back the `grep`, then `wc -w GLOSSARY.md`: 10 terms, 327 words.

## Back in the planning session

**4. The ADR question** (typed):

```text
Does any of this need an ADR?
```

**5. The cut** (typed):

```text
Then cut GLOSSARY.md down to words only.
```

## In the lesson terminal: check it on disk

```bash
git status -sb
git diff --stat
git diff GLOSSARY.md
```

The diff opened in the pager: Space for the next page, `q` to quit. Then `clear` (Ctrl+L) and `wc -w GLOSSARY.md`:
211 words, 11 terms.

## Back in the planning session

**6. Commit** (typed), then, after looking, **push** (typed):

```text
Commit it.
```

```text
Push it.
```

## In the lesson terminal: one last look

```bash
git log --oneline -4
git status -sb
```
