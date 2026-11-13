# Lesson 5.3: criteria that can fail

An acceptance criterion is a promise that someone (you, a reviewer, a test) can check when a ticket is done. It only
grades the work if it can fail. The `to-tickets` documentation names three shapes that can't:

1. **Already true** at the commit the work starts from. Absences are the usual case: "no trackers", "never sent to the
   server", "no undo". In a repository with no app in it, every one of these is true today.
2. **Only another ticket can make it true.** The ticket can't satisfy it by itself.
3. **Restates the request** instead of saying what you would observe.

## The test, for each criterion

1. **What would I see if it were false?** Name the observation: a request to another host, a row still in the database,
   an IP address in the log, a page that doesn't answer.
2. **Is it false at the commit the work starts from?** If yes, it grades the work: keep it. If it is already true, it
   grades nothing: rewrite it.
3. **Rewrite it as a check that fails when the behaviour breaks,** like a test: what the check does, and the exact thing
   that makes it fail.

## The filmed example

Before: "App logs never contain IP addresses." True in an empty repository.

After: "A test sends a group-service write carrying a known client IP, captures everything the app logs while handling it,
and fails if that IP appears." It can only pass once logging really leaves IPs out.

Not every "never" is a problem. "Blocked or missing browser storage never breaks a page" was kept: there is no page at the
starting commit, so its check fails until the ticket builds one.

## Two more things to look for while you read

- **Invented details.** Compare lists in the tickets with the same lists in the spec. On camera, a seed group ("a
  four-member flat") appeared that the spec never mentioned.
- **New behaviour added to make a check possible.** When a rewrite needs the app to do something the spec never asked for,
  decide on purpose. On camera we kept both checks in CI and added no app behaviour.

## A search to start with

```bash
grep -n -E "\[ \] .*(never|There.s no|There are no|isn.t used|nowhere)" tickets-draft.md
```

It only finds the usual suspects. Read every criterion of every ticket the same way, then check again after the fixes:

```bash
grep -n -E "fails (if|unless)" tickets-draft.md
```
