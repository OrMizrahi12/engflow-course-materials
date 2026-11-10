# The 27 skills in mattpocock-skills 1.3.1

As installed in Lesson 2.4 from Anthropic's official marketplace (`claude-plugins-official`). Each skill's full name is
`mattpocock-skills:<name>`; typing the short name (`/grill-me`) works when nothing else shares it.

- **You type it** (user-invoked): the skill's `SKILL.md` has `disable-model-invocation: true`. `/skills` shows it as
  `user-only`. Claude never starts it on its own.
- **Claude can call it** (model-invoked): no flag. Claude loads it when the work matches its description, and you can
  still type it yourself.

The one-line summaries are ours, not the skills' own text. "Lesson" is where the course teaches it first.

## You type it (16)

| Skill | What it is for, in short | Lesson |
|---|---|---|
| `ask-matt` | Asks which skill or flow fits your situation, then routes you to it | 1.3, 2.4 |
| `grill-me` | A relentless interview about a plan or idea, with no files written | 3.1 |
| `setup-matt-pocock-skills` | One-time setup of a repository for these skills: issue tracker, labels, doc layout | 3.2 |
| `grill-with-docs` | The same interview inside a repository, writing a glossary and decision records as you go | 3.3 |
| `wait-what` | For when an answer didn't land: stop and explain it again, plainly | 3.4 |
| `to-questionnaire` | Turns a question that someone else must answer into a questionnaire for them | 4.1 |
| `handoff` | Writes a handoff so a fresh session can pick up the work | 4.2 |
| `to-spec` | Turns the current conversation into a written spec | 5.2 |
| `to-tickets` | Breaks a plan or spec into small tickets with their blocking order | 5.3 |
| `implement` | Implements a piece of work from a spec or tickets | 6.1 |
| `retro` | A short retrospective on how a piece of work went | 7.2 |
| `teach` | Teaches you a topic step by step | 7.5 |
| `implement-spec` | Implements the result of `to-spec` and `to-tickets` | 8.2 |
| `wayfinder` | Plans work too big for one session as a shared map of decision tickets | 9.1 |
| `triage` | Moves issues and outside pull requests through triage roles | 10.2 |
| `improve-codebase-architecture` | Looks for ways to deepen a codebase's modules and reports them | 10.5 |

## Claude can call it (11)

| Skill | What it is for, in short | Lesson |
|---|---|---|
| `grilling` | The interview itself; `grill-me` and `grill-with-docs` both call it | 3.1 |
| `domain-modeling` | Builds and sharpens the project's shared language (glossary, decisions) | 3.3 |
| `research` | Investigates a question against primary sources and writes the findings to a file | 4.1 |
| `prototype` | Builds a throwaway prototype to answer one design question | 4.2 |
| `codebase-design` | Shared words for designing modules with simple interfaces | 5.1 |
| `tdd` | Test-driven development: a failing test first, then the code | 5.1 |
| `wizard` | Writes a step-by-step script for the steps only a person can do | 6.2 |
| `pr` | Writes a pull request description | 6.3 |
| `code-review` | Reviews changes since a fixed point against the repo's standards and the spec | 7.1 |
| `writing-for-agents` | How to write documents that agents read, such as skills and CLAUDE.md | 7.3 |
| `diagnosing-bugs` | A diagnosis loop for hard bugs and slow code | 10.3 |

## Two names, two tools

Claude Code has its own built-in `/code-review` ("Review the current diff or a PR for bugs and cleanups"). The plugin's
skill is `/mattpocock-skills:code-review`. When you mean the plugin's, type or pick the full name.

## Credits

These skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License.
This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.
