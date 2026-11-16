# Potluck at lesson 7.4

Repository: https://github.com/OrMizrahi12/potluck (public). Clone it to look or to start from here; don't fork it.

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-7.4
```

The tag `lesson-7.4` points at `d2649a1`, `main` after PR #24 merged. The lesson starts from `7c3f5d2` (the tag `lesson-7.3`).

## Five commits after `lesson-7.3`

| Commit | Message |
|---|---|
| `921d96b` | Name the group link in the glossary |
| `6711c5b` | Answer 404 for a group link no group has (`Closes #21`) |
| `bd2b5c0` | Merge pull request #22 from OrMizrahi12/worktree-unknown-links |
| `0c8919e` | Answer a link that can't be a group link without the database |
| `d2649a1` | Merge pull request #24 from OrMizrahi12/worktree-link-shape |

What changed, in seven files:

- `GLOSSARY.md`: a new term, **Group link**: "The address that opens one group; anyone who has it can open the group, and it
  is the only way in." Its Avoid list is Invite, share link, token (for the whole address). URL stays off it, because the
  lint from lesson 7.2 bans one-word Avoid entries from code names, and the code says `url` and `databaseUrl` for real URLs.
- `src/proxy.ts` (new, in this kit): Next's Proxy for `/g/:token`; it only passes the real database to the handler.
- `src/app/g/group-link-proxy.ts` (new, in this kit): `answerGroupLink(db, request)`. A real group link passes through
  untouched; anything else is rewritten to `/g/no-group`. A failed lookup throws: an error, never a pass-through or a 404.
- `src/app/g/no-group/page.tsx` (new, in this kit): a static page that calls `notFound()` at build time, so production serves
  it as a real 404 with the "No group at this link" screen.
- `src/app/g/not-found.tsx`: moved up from `src/app/g/[token]/`, so one copy of the text covers both routes.
- `src/group/service.ts`: `hasGroup(db, linkToken)`, a light existence check, and the shape rule beside `newLinkToken()`:

  ```ts
  /** What newLinkToken() makes: 16 bytes in unpadded base64url. */
  const LINK_TOKEN_SHAPE = /^[A-Za-z0-9_-]{22}$/;
  ```

  `hasGroup` returns `false` without a query for any link that doesn't match it.
- `src/app/g/group-link-proxy.test.ts` (new, in this kit): three tests at the seam agreed in the grilling. An unknown link is
  sent to `/g/no-group` (checked with Next's `isRewrite` and `getRewrittenUrl` helpers, because the status on the Proxy's own
  response isn't what production serves); a real group's link passes through; and a malformed link (`/g/wp-login.php`) is
  answered with a closed PGlite database, so any query would throw. `npm run check` passes with 33 tests.

The three code commits carry Claude Code's usual `Co-Authored-By` line, as on camera; the merges are GitHub's.

## Pull requests, issues

- **#21** "An unknown group link answers 404" (`bug`, `ready-for-agent`): filed by the grilling, closed by #22. The full text is
  in `issue-21.md`.
- **#22** "Answer 404 for a group link no group has" (branch `worktree-unknown-links`), merged as `bd2b5c0` with auto-merge
  after the required check passed in 56 seconds. Its Evidence: production builds of `main` and the branch, curled before and
  after (before both 200; after, the unknown link `404 Not Found` with `x-middleware-rewrite: /g/no-group` and the real one
  200), and a headless browser check of the screen. The real link is written as `<real group link>`. It names the Proxy's
  database lookup on every group link as an accepted tradeoff, and what isn't covered: the test proves where an unknown link
  is sent, not the 404 itself, and `/verify` wasn't run because of #19.
- **#24** "Answer a link that can't be a group link without the database" (branch `worktree-link-shape`), merged as `d2649a1`
  after the check passed in 52 seconds. Its Evidence is the closed-PGlite test, failing before the change with
  `PGlite is closed` and passing after. Not covered: no browser walk, because of #23.
- **#23** "Unknown group link logs a dev error from /g/no-group" (`ready-for-agent`): filed during the shape check, after
  `/verify`'s walk found it. In dev, every unknown group link logs `Route "/g/no-group": Could not validate instant ...` from
  the page #22 added. The issue carries the browser walk and the helpers move, so they don't depend on any session's notes.
- **#19** (the reload loop under `npm run dev`) is still open at the tag; it goes to `/diagnosing-bugs` in its own worktree.

## The production site

After both merges the production deploy succeeded, and a link to a group that doesn't exist answers `HTTP/2 404` with the
screen "No group at this link". Every valid group open costs one extra indexed lookup (the Proxy's check, then the page's);
a link that can't be real costs none.
