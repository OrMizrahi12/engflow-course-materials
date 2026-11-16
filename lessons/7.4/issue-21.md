# Issue #21, as the grilling filed it

Filed on camera at the end of the `/grill-with-docs` session (step 9), labelled `bug` and `ready-for-agent`, and closed by
PR #22. Copied from https://github.com/OrMizrahi12/potluck/issues/21.

**Title:** An unknown group link answers 404

## Problem

Opening a group link whose token matches no group shows "No group at this link", but the response is HTTP 200 (noted in #16). The page streams: with Cache Components on, Next sends the prerendered shell, and with it a `200`, before the page's request-time lookup runs, so the page's `notFound()` can't change the status. The Next 16.4.6 docs (`loading.md` → Status codes, `streaming.md` → The HTTP contract) say a request-time 404 needs Proxy.

## Decisions

1. **A Proxy on `/g/:token` checks that a group with the token exists before the page renders.** Unknown → 404. Known → the request continues to the page. A valid open now costs two database lookups. That's accepted; if the latency shows up, cache the existence query rather than drop the check. Rejected: turning off Cache Components (affects the whole app for one status code) and keeping the 200 (Next's noindex already covers search engines, but not the status itself).
2. **The 404 shows today's "No group at this link" screen**: same heading, copy and "Create a group" link, with one copy of the text. The docs don't settle how a Proxy 404 renders that screen, so that's for the build to work out.
3. **The page keeps its own `notFound()`** as a backstop for a group that disappears between the Proxy's check and the page's lookup.
4. **A database failure in the Proxy is an error.** It's not caught, not passed through, and not turned into a 404.

## Testing

- One Vitest test at the Proxy's handler, against PGlite (`src/test/db.ts`), in CI: an unknown token gets 404, a real group's token passes through.
- PR Evidence: `curl -sI` of an unknown and a real group link, before and after.

## Out of scope

- Rejecting links that can't be a real token without asking the database (tokens are 22 characters from `[A-Za-z0-9_-]`). This comes next as its own test-first change.
- Playwright coverage (not in CI; blocked by #19).

## Done when

`curl -sI <base>/g/<unknown token>` answers `404` and the body shows "No group at this link". A real group link still answers `200` and opens the group. `npm run check` passes.

The **Group link** glossary entry added during this grilling ships in the same PR.
