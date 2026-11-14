# Card: review the preview like a user

## Who checks what

| Who | Checks |
|---|---|
| The tests | the logic |
| Claude's browser | the page, on your machine |
| You, on the preview | the real deploy, like a user would |
| You, at the merge | whether it goes in; a migration is a one-way door |

## Before you merge

1. **Open the preview from the pull request** (Vercel's bot comment, or the deployment in the checks). It is the pull
   request's own deployment, on its own copy of the database.
2. **Use test data only.** Made-up names, nothing real: other people may see a preview, and its data is thrown away.
3. **Walk the user's path** the ticket describes, start to finish, the way a user would (on camera: create a group, copy its
   link, go back, paste the link into the address bar, open it, see the same group and its members).
4. **Look at what the tests can't judge**: wording, layout, what happens after each click, at phone width too (your browser's
   device view, or your phone).
5. **Read the pull request's risks** again with the page in front of you: what isn't covered yet, the merge danger.

## Who merges

| The pull request | Who merges |
|---|---|
| no migration | auto-merge, once its check is green |
| adds a migration | you, by hand, after your review |

After the merge, the ticket closes itself if the body says `Closes #N`, and production deploys from `main`.

## It's working if

- You opened the preview from the pull request, not your local server.
- You finished the user's path with test data, and it did what the ticket says.
- The merge was yours whenever the pull request carried a migration.

Ideas from how Matt Pocock's public repositories land changes, described in our own words; the `pr` skill is from
[mattpocock/skills](https://github.com/mattpocock/skills) (MIT License). Unofficial, not affiliated with or endorsed by Matt
Pocock. First used in lesson 6.5.
