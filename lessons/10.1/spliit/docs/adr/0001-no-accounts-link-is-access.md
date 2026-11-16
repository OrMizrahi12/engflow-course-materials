# No accounts: a group's link is its access control

Spliit has no user accounts or authentication. Anyone who has a group's URL can view and edit everything in it, and participants are plain names inside one group. This has been true since the first version (`ed55c69`, 2023-12-05), and the rest of the design builds on it: the active user, recent groups, starred groups and archived groups are all kept per browser because there is no account to attach them to.

**Source of the reason: none recorded.** No commit, PR or code comment says why accounts were left out. Upstream issues requesting accounts or authentication are still open with no maintainer reply on them (spliit-app/spliit#76, #257, #478, #614). Treat this as the existing state rather than a reasoned decision, and look for the maintainer's view before reversing it.

## Consequences

- Any destructive action is available to anyone with the link. PR #420 (see [ADR-0004](./0004-scheduled-group-deletion.md)) gave group deletion a grace period and a name confirmation for exactly this reason.
