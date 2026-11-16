# Group deletion is scheduled with a 30-day grace period, then purged by cron

Deleting a group does not remove it. It sets `deleteAt` 30 days ahead (a scheduled deletion), and the deletion can be cancelled (restored) until then. A cron route (`src/app/api/cron/purge-deleted-groups`) later purges groups past their date, including their uploaded documents in S3. A group that fails to purge stays in place and is retried on the next run. The user also has to type the group's name to confirm.

**Source of the reason:** PR #420 (`589ede5`, 2026-10-10, by Levin Herr): "giving them a 30 day grace period to cancel the deletion. This way, users with malicious intent will not be able to instantly delete groups. There's also a small safety mechanism, forcing users to input the group name. That way, there's no accidental deletion of the wrong group and brute forcing is significantly harder." The grace period is needed because anyone with the link can edit a group (see [ADR-0001](./0001-no-accounts-link-is-access.md)).

**Not recorded:** why the grace period is 30 days specifically.
