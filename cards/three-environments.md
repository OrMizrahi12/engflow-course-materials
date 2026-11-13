# Card: three environments, three databases

## Where the app runs

| Environment | What it is | Its database | Its secret lives in |
|---|---|---|---|
| Local | your laptop | your own Postgres, filled with fake data by the seed | `.env.local` (git-ignored) |
| Preview | a private address for every pull request, built by Vercel | its own Neon branch, copied from `development` (seed data, never real people's) | Vercel's settings |
| Production | built only from `main` | Neon's root branch, where real people's data will live; never seeded | Vercel's settings |

None of them goes in the repository.

## The order that matters

1. Neon project: one root branch, `production`, empty.
2. `development` copied from the root while it is still empty, then seeded, then made the **default** branch.
3. The Vercel project.
4. The link (Neon's Vercel integration): pick **Production branch = `production` by hand**; it is filled in with the default.
5. Only then the first push: its preview is copied from `development`.

If a preview copied production, the default branch was set after the link: set it, then connect again.

## Two connection strings

- **Pooled** (`DATABASE_URL`, host with `-pooler`): for the app; many short requests share a few connections.
- **Direct** (`DATABASE_URL_UNPOOLED`): for migrations and the seed; an advisory lock needs one session, which a pooler that
  hands out a connection per transaction can't keep.

## The safe path for schema changes

- A preview build migrates only its own copy, so a bad migration can't touch production.
- Only a production build, from `main`, migrates production.
- The advisory lock means two builds never migrate at once.
- If a migration fails, the build fails, and the previous version keeps serving.

## On the free plans

Vercel Hobby is for non-commercial use. On Neon Free, past the limits only the default branch keeps running; a preview's
branch is deleted when its pull request merges. Pick one region for both, nearest your users (Frankfurt in the lesson).

First used in lesson 6.2.
