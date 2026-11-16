# Card: /teach, a teaching workspace for what you need to learn next

## What it builds

| In its folder | What it holds |
|---|---|
| The folder itself | the workspace: keep it out of your project (a folder, ideally its own git repo) |
| `MISSION.md` | why you're learning: what you'll do with it |
| `RESOURCES.md` | the sources it checked first |
| `lessons/0001-….html` | one page, one goal; it cites where its facts come from |
| `learning-records/` | what you've shown you know, so the next lesson starts from there |
| `reference/`, `assets/`, `NOTES.md` | a reference sheet, reusable pieces (styles, quiz, labs), its own notes |

You start it; Claude never does (the skill is user-invoked).

## Start it

```bash
mkdir ~/learn-<topic> && cd ~/learn-<topic>
git init -q
claude          # a new folder: answer the trust question yourself
```

Then `/teach` (in some versions only the plugin's full name, `/mattpocock-skills:teach`), a space, and one message:
what you want to learn, why (the job it's for), what you already know, and the gap. Without the why, it interviews you
first. Add "Don't open files for me" if you'd rather open the lesson yourself.

## Reach for it when

- The learning is the job: a skill you'll need next week, with a reason you can name.

## Not for

- One question in passing: just ask.
- Your project's own files: keep the workspace outside the repo.

## It's working if

- The lesson has one goal, and its claims link to sources you can open.
- The quizzes make you predict before you see the answer (check where the right answers sit: they shouldn't always be the
  first button).
- There is something to do for real (a lab, a practice repo), not only reading.
- After you report back, the next lesson starts from what you showed, not from zero.

From [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License), described in our own words. Unofficial, not
affiliated with or endorsed by Matt Pocock. First used in lesson 7.5.
