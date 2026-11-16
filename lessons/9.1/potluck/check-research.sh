# What the research agents left behind (lesson 9.1, run one line at a time from ~/potluck).
git fetch -q
git branch -r | grep research
git show --stat --oneline origin/research/exchange-rate-sources
git show --stat --oneline origin/research/multi-currency-in-other-apps
gh pr list
git show origin/research/exchange-rate-sources:docs/research/exchange-rate-sources.md | head -9
