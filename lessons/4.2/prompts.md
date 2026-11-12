# Prompts (Lesson 4.2)

Every line typed or pasted in the lesson, in order. Use your own words; these are the ones from camera.

## In the planning session (Claude Code, `~/potluck`)

**1. The handoff** (`/handoff` typed, then a space; the sentence was written beforehand and pasted as one line):

```text
/handoff Next: a fresh session in its own folder, ~/potluck-prototype, builds a logic prototype of how balances and settlements work: one HTML file we drive with buttons, to find where the idea breaks. That folder won't load your memory notes, so write down every rule the model needs.
```

The command echoes as `/mattpocock-skills:handoff`. 55 seconds later: the file `/tmp/potluck-prototype-handoff.md`
(105 lines) and a reply that starts "The handoff is written to /tmp/potluck-prototype-handoff.md."

## In the lesson terminal (`~/potluck`): read the handoff

```bash
ls /tmp/*.md
wc -l /tmp/potluck-prototype-handoff.md
grep -n '^#\|^\*\*' /tmp/potluck-prototype-handoff.md
head -3 /tmp/potluck-prototype-handoff.md
sed -n '42,50p' /tmp/potluck-prototype-handoff.md
sed -n '97,101p' /tmp/potluck-prototype-handoff.md
```

Tab completed the file name each time. `wc -l` printed 105. The file as written is `example-handoff.md` in this kit.

## In the lesson terminal: the handoff skill

Pasted, because the path is long:

```bash
cat ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/productivity/handoff/SKILL.md
```

## A new terminal window (Ctrl+Shift+N): the fresh session

```bash
mkdir ~/potluck-prototype && cd ~/potluck-prototype
ls -a
claude -n prototype
```

The trust dialog: "Yes, I trust this folder".

## In the prototype session (Claude Code, `~/potluck-prototype`)

**2. The prototype** (`/prototype` typed, then a space; the request pasted, with the path from step 1):

```text
/prototype Read /tmp/potluck-prototype-handoff.md first: it's the handoff from our planning session. Build the logic prototype it describes, in this folder.
```

It ran for 9 minutes 11 seconds and wrote `~/potluck-prototype/potluck-balances.PROTOTYPE.html`.

## In the lesson terminal: the prototype skill

```bash
cat ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/prototype/SKILL.md
```

## In the browser

Pasted into the address bar of the open tab (Ctrl+L):

```text
file:///home/<you>/potluck-prototype/potluck-balances.PROTOTYPE.html
```

Replace `<you>` with your user name (on camera it was `superposition`). Tabs driven: **Greedy isn't fewest** (steps 1 to 3),
then **Editing moves the cent** (steps 1 and 2).

## Back in the prototype session

**3. The answer goes back** (`/handoff` typed, then a space; the argument pasted):

```text
/handoff Back to the planning session in ~/potluck: what the prototype showed.
```

28 seconds: `/tmp/potluck-prototype-findings-handoff.md` (55 lines; `example-findings-handoff.md` in this kit). Then typed:

```text
/exit
```

## Back in the planning session

**4. Read the answer** (pasted):

```text
Read /tmp/potluck-prototype-findings-handoff.md: it's the prototype session's answer.
```

The dialog "Allow this read outside the working directories?": option 4, "Yes, but ask again next time". 26 seconds later:
eight questions, P1 to P8, each with a recommendation.

**5. The decision** (typed):

```text
Yes to all seven. Note them for the spec, not the repo.
```

**6. Keep the prototype** (typed):

```text
Commit the prototype on its own branch, not main.
```

17 seconds: `5fd59d5` on the new branch `prototype/balances`, not pushed.

**7. Publish the branch** (typed):

```text
Push it.
```

11 seconds: `prototype/balances` on GitHub, tracked by the local branch; no pull request.

## In the lesson terminal: where we are

```bash
cd ~/potluck
git branch -a
git log --oneline -2 prototype/balances
git status -sb
```
