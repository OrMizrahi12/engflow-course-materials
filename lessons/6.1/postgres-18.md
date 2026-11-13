# Postgres 18 on your own machine

The spec says local development runs against the developer's own Postgres 18, filled by the seed script. You connect as
your own user over the local socket, so no password is typed or stored anywhere.

## Ubuntu, and Windows (WSL, Ubuntu)

As on camera, the way postgresql.org describes it (https://www.postgresql.org/download/linux/ubuntu/):

```bash
sudo apt install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh      # adds the PostgreSQL project's apt repository; press Enter
sudo apt install -y postgresql-18
pg_lsclusters                                                        # 18 main ... online?
sudo pg_ctlcluster 18 main start                                     # only if it says down
sudo -u postgres createuser -s $USER
createdb potluck
psql potluck -c 'show server_version'                                # 18.x
```

Connection string for `.env.local`:

```text
DATABASE_URL=postgresql:///potluck?host=/var/run/postgresql
```

On a normal Ubuntu desktop the server starts by itself after the install. On camera it did not (the machine blocks
services from starting during installs), so it was started by hand; after a restart, run `sudo pg_ctlcluster 18 main start`
again if `pg_lsclusters` says `down`. Under WSL the same applies when the distribution runs without systemd.

## macOS

With Homebrew:

```bash
brew install postgresql@18
brew services start postgresql@18
createdb potluck                    # Homebrew's server already has a role named after your user
psql potluck -c 'show server_version'
```

If `createdb` is not found, add Homebrew's `postgresql@18/bin` folder to your `PATH` (Homebrew prints the line to use).
Postgres.app (https://postgresapp.com) works too; create the `potluck` database from its window or with `createdb`.

Connection string for `.env.local` (the macOS socket lives in `/tmp`):

```text
DATABASE_URL=postgresql:///potluck?host=/tmp
```

## Then

In the worktree: copy `.env.example` to `.env.local` and change the URL if yours differs, then `npm ci`,
`npm run db:seed` and `npm run dev`. `.env.local` is git-ignored: it never gets committed.
