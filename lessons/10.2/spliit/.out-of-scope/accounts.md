# User accounts and authentication

Spliit has no user accounts, logins or authentication, optional or otherwise. A group's link is its access control: anyone who has it can view and edit the group. We are keeping it that way.

This covers every form of the request we've seen:

- signing up or logging in (e.g. with Auth.js / NextAuth),
- linking groups to an account so they sync across devices,
- tying a participant in a group to a person's identity,
- environment flags that switch public group creation or sign-up on or off, which only make sense once accounts exist.

## Why this is out of scope

Spliit has been account-free since its first version, and the rest of the design depends on that (see [ADR-0001](../docs/adr/0001-no-accounts-link-is-access.md)):

- A **participant** is just a name inside one group. Nothing links participants across groups, so the same person in two groups is two unrelated participants. Accounts would add an identity layer that every part of the domain model currently goes without.
- The **active user**, **recent groups**, **starred groups** and **archived groups** are all kept in the browser, per device, because there is no account to attach them to. Accounts would mean either a second, account-backed version of each of these or moving them all to the server.
- Safety features are designed around open links rather than identities. Group deletion has a 30-day grace period and asks you to type the group's name to confirm ([ADR-0004](../docs/adr/0004-scheduled-group-deletion.md)), because anyone with the link can edit the group.

Accounts would also mean storing personal data (emails, credentials) that Spliit doesn't store today, with all the security and privacy work that comes with it.

Spliit's main appeal is that you can share a link and start splitting with no sign-up. Optional accounts would still bring all of the costs above into the codebase, even for users who never sign up.

Someone who wants their groups on every device can open the same group links there, or use a fork that adds accounts. An upstream user runs one (spliit.cloud).

## Prior requests

- #5: "[Feature Request] Authentication (Optional)" (copied from upstream `spliit-app/spliit#257`)
- #15: "Question: what if we would like to save old groups to an account?" (copied from upstream `spliit-app/spliit#478`)
