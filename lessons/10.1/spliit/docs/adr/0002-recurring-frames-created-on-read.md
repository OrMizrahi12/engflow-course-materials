# Recurring frames are created on read and are independent once created

A recurring expense does not store its future frames, and no scheduler creates them. The next frame is created (`createRecurringExpenses` in `src/lib/api.ts`) whenever a group's expenses are read. Once a frame exists it is an ordinary, independent expense: the link points only at the current frame, never forward, so editing or deleting one frame leaves the others alone, and deleting the current frame stops the series.

**Source of the reason:** the "Acknowledged decisions" section of PR #263 (`94c101c`, 2025-04-19, by trandall):

- *Creating on read*: "I took inspiration from [PR #114] which chose to do something similar. I think that it's possible/straightforward to add a job to perform this task. But this method was very lightweight and doesn't preclude a later change."
- *Not linking forward*: "It's still an option to add this linking later. But not adding it now keeps the model more flexible." The same reason is in a code comment on `RecurringExpenseLink` in `prisma/schema.prisma`: once the next expense is created, "it should be treated as it's own independent entity."

## Consequences

- Reading a group's expenses can write to the database. `src/lib/perf-instrumentation.ts` notes that `getGroupExpenses` runs an unscoped `createRecurringExpenses()` pass first.
- Because the pass is unscoped, a read of any group creates due frames for every group. If nobody reads any group, no frames are created.
- There is no "delete the whole series" operation. Each past frame has to be deleted on its own.
