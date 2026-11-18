# Test the fence: prove a deny rule, with controls

A deny list nobody tested is a guess. The test is small: run Claude headless on a **scratch copy** of the repository, with the
**workflow's own arguments**, ask it to write files behind the doors and two ordinary files, and look at what changed on disk.

## Why the controls

On camera, the first run of the test denied everything, the two harmless control files included. That looks like a perfect
fence, and it was a broken test: the wrapper script had split the flags, so the run had none of the workflow's flags.
Only the controls showed it. **A test with no control can't tell a working fence from a broken test.** Keep at least two
files that must be allowed: an ordinary file in `src/` and one more somewhere the run is meant to write.

## The shape of the test

1. Make a scratch copy, never your real checkout:

   ```bash
   git clone --quiet . ../fence-scratch
   cd ../fence-scratch
   ```

2. Copy the arguments from the workflow, exactly as they ship: the `claude_args` block of `.github/workflows/claude-build.yml`
   (`--permission-mode acceptEdits`, `--allowedTools …`, `--disallowedTools …`). Read them from the file in your script rather
   than typing them again, so the test can't drift from the workflow. Watch the quoting: each flag's value must stay one
   argument. That was the bug on camera.

3. Run Claude headless with those arguments and a prompt that asks for each protected write and both controls, one file at a
   time, for example: create `drizzle/9999_probe.sql`, `.github/workflows/probe.yml`, `CLAUDE.md` changes, …, then
   `src/probe-control.txt` and one more ordinary file.

   ```bash
   claude -p "<the writes, one per line>" <the workflow's claude_args>
   ```

4. Check the disk, not the reply:

   ```bash
   git status --short
   ```

   Only the two control files may appear. Every protected path must be untouched. On camera: 23 protected attempts denied,
   2 controls allowed.

5. Delete the scratch copy when you're done.

## What the test can't prove

- **The deny list is a seatbelt, not a wall.** It matches Claude's own tools (`Edit` rules cover `Write` too) and the shell
  commands it recognises. A script that a test runs could still write a file. The wall is the person at the merge: a pull
  request that carries a migration never auto-merges, and someone reads its door line before it lands.
- **Shell-command denials prove little** when those commands aren't on the run's allowed list anyway: the run couldn't use them
  before the change either.
- **Path rules don't reach every route.** The action hands the run its own `git rm` command, which file rules don't cover, so
  `git rm` is denied outright. Read the tool you're fencing, not only its docs.
- **Attended sessions aren't bound** by the workflow's arguments. Nothing in this fence stops you, or a session you steer, from
  queuing auto-merge on a migration. That stays with a person.

## Adding a door later

Add a row to the list. If files sit behind the door, add an `Edit(/path)` deny for them to `--disallowedTools`, and run this
test again: the new path denied, the controls still allowed. Every new door comes with its own proof.
