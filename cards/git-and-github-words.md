# Card: six words for git and GitHub

One page from Lesson 3.2. The words the rest of the course leans on, each with where you saw it on the Potluck page.

| Word | What it is | On the page in lesson 3.2 |
|---|---|---|
| **Repository** | a folder plus its whole history | `OrMizrahi12 / potluck`, Private, then Public |
| **Commit** | a saved snapshot of your files, with a message that says what changed | `9eea3cd` "Add README"; "1 Commit", later "2 Commits" |
| **Branch** | commits lined up one after another; the main line is usually `main` | `main`, "1 Branch" |
| **Issue** | one piece of work written down; together, the project's to-do list | the Issues tab (empty for now) |
| **Label** | a tag on an issue, so skills and people can sort the work | `bug`, `wontfix`, `ready-for-agent` on the Labels page |
| **Pull request** | a branch asking to join `main`, so the change can be reviewed first | the Pull requests tab (module 6) |

And the copy: **GitHub** keeps a copy of the same repository online; a **push** updates that copy from your machine
(`git push`, or `gh repo create … --push` the first time). A **remote** is the name your repository uses for that copy,
usually `origin`.

## Seen in the lesson

- A new GitHub repository came with 10 labels (accessibility, bug, documentation, duplicate, enhancement, good first
  issue, help wanted, invalid, question, wontfix). The setup added four role labels next to them.
- Every commit Claude makes ends with `Co-Authored-By: Claude …`, so the history records who wrote what.
- Private first: check what's in a repository before anyone else can see it. Going public is one command, and it can't be
  quietly undone.
