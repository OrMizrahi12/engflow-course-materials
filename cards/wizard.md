# Card: /wizard, dashboard work as a script you run

## What goes in, what comes out

| In | Out |
|---|---|
| A manual procedure only a human can do: dashboards, clicks, sign-ins, keys | A bash script in the repo that walks you through it, one stage per screen |
| The repo and the ticket, which Claude reads first | Claude's plan first: the ordered stages and what each one captures, for your yes |
| Your answers to its questions (the region, push or not, what to change) | The script, checked (`bash -n`, `shellcheck`) and committed, never run by Claude |

## How it runs

1. **Scope.** Claude reads the repo (README, config, workflows, `.env*` names) and the ticket, and checks the services' docs.
2. **Stages first.** It shows the stages before writing anything, and waits for your yes. Code that belongs to the change
   (a build command, a config file) it writes itself: the wizard is only for what a person has to click.
3. **The script.** It copies the skill's library unchanged and writes the stages below it. Each stage opens its page,
   lists the clicks, and asks for a value only after the page that shows it.
4. **You run it.** Secrets you paste are typed blind (`ask_secret`), so they never reach the model and never show on screen.

## Reach for it when

- A step needs a human: a sign-in, a dashboard, an API key, an approval in a browser.
- You will do the setup again (a new account, a teammate, a fresh environment): commit the script, link it from the README.

## Not for

- Anything the agent can do itself, like a build command or a config file: it should simply do it.
- A one-off click you will never repeat.

## It's working if

- The stages were shown and agreed before any script was written.
- Each page opens before its value is asked; secrets are typed blind.
- Each stage fits one screen; Ctrl-C and a re-run keep the values already saved.
- The last screen says what it did and what is left by hand.

From [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License), described in our own words; unofficial, not
affiliated with or endorsed by Matt Pocock. First used in lesson 6.2.
