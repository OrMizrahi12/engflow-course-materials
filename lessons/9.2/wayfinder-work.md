# Card: working a wayfinder map

One page from Lesson 9.2. A map from `/wayfinder` is worked one decision per session: claim the ticket, resolve it, write
the answer down, stop.

## The loop

| Step | What happens |
|---|---|
| A fresh session | `/wayfinder <map>`; a ticket number is optional |
| Load the map | the low-res view: the map body and its sub-issues, not every ticket |
| Choose and claim | the ticket you named, or the first frontier ticket; assign it before any work |
| Resolve it by its label | grilling: rounds of questions with recommended answers; prototype: throwaway variants; research: a background agent |
| Record in three places | a resolution comment, the closed ticket, one line in Decisions so far (a context pointer) |
| Graduate the fog | anything the answer made specific leaves "Not yet specified" as a new ticket, wired with blocking |
| Stop | one ticket per session, even with new tickets waiting |

## Parallel sessions

Unblocked tickets can run at the same time, each in its own session. The tracker is the only state they share:

- **The claim keeps them apart.** A session skips a ticket that already has an assignee and takes the next one.
- **Read the map right before writing it.** Another session may have added its line in the meantime; keep it.
- **A session that writes code gets its own worktree** (`claude -w <name>`), like the prototype session.

## Rules of thumb

- **No production code mid-map.** Decisions go on tickets; files in the repo change once the spec exists. If a session
  edits a file anyway (on camera: the glossary), say so and have it undo the edit.
- **Answer the rounds, don't skim them.** Each question comes with a recommended answer and its reasons; "yes to all" is
  fine only when you read them.
- **A "how should it look?" question is a prototype ticket.** Several structurally different variants on the real page,
  flipped by a person; the verdict goes on the ticket, the code stays on a branch that never merges.
- **Leave the last question for the next session.** When only the spec is left, writing it starts fresh (lesson 9.3).

## It's working if

- every ticket was assigned before its first question;
- every closed ticket has a resolution comment, and the map has one line per closed ticket;
- "Not yet specified" shrinks as tickets appear, and ends with only the destination itself;
- `main` hasn't moved, and no pull request was opened;
- the next session starts from the tracker, not from a long chat.

Credits: the `wayfinder` and `prototype` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt
Pocock (MIT License), described here in our own words. This course is unofficial and not affiliated with or endorsed by
Matt Pocock.
