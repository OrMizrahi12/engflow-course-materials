# Card: /to-questionnaire

One page from Lesson 4.1. When the answer lives in another person's head, write them a questionnaire.

## In and out

- **In:** a decision you can't answer alone and the person who can. Type `/to-questionnaire` and what it is for (on
  camera: `/to-questionnaire Questions for the first group that will use Potluck.`), then answer two questions.
- **Out:** one Markdown document, `to-questionnaire-<name>.md` in the current folder, most important questions first,
  ready for you to send. It never sends anything itself.

## The skill, in one look

- Description: "Turn a decision you can't fully answer into a questionnaire for someone else to fill in."
- `disable-model-invocation: true`: it runs only when you type it.
- The rule: **"Grill the send, not the subject."** It asks you only what you can always answer: who it goes to and what
  you need back. The questions in the document then aim at the gap between what they know and what you need.
- Three steps: (1) who is it going to, in one exchange; (2) what do you need back, in one exchange; (3) write the
  document.

## The document

- A title, a **Purpose** line (the decision riding on it), who it is from and to, and how the answers will be used.
- **Context:** one paragraph for someone who wasn't in your head.
- **How to answer:** a deadline, the rough effort, and "I don't know" is a fine answer.
- One section per theme, most important first. Every question is one idea with a place to answer under it, and a
  "why this matters" line only where it could be misread.
- **Anything else?** A last catch-all question.

## How it ran (on camera)

1. Its first question was about the send: "Who is it going to?" (one person or the whole group, how I know them, what
   kind of group, how technical).
2. My answer (written before recording): the friend who keeps track of the money, in a group of four flatmates who also
   travel together.
3. "What do you need back from them?" came with nine candidates, drawn from where version one assumes how a real group
   behaves. I kept three, cut the rest, and added one: does a rotating extra cent feel fair to them?
4. It wrote 13 questions in four sections plus a catch-all, and warned: don't commit the answered copy, the repo is
   public. One line in `.gitignore` keeps it out of git.

## Rules of thumb

- **Answer only the send.** If it asks about the subject, that's the questionnaire's job, not yours.
- **Add what research can't settle.** The research gave the rule; only a person can say whether it feels fair.
- **Keep answers out of a public repo.** Ignore the file before anyone fills it in.
- **You send it**, by email or on a shared screen. The answers come back into a grilling round, not straight into code.

**It's working if** it asked you nothing about the subject, every item you named is covered by a question, and the file
is out of git.

---
The `to-questionnaire` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the
MIT License, described here in our own words. This course is independent: unofficial, and not affiliated with or
endorsed by Matt Pocock.
