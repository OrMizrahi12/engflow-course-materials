# The map's sub-issues with their state, open blockers and assignees (lesson 9.1, run from ~/potluck).
# Replace OrMizrahi12/potluck with your own repository and 41 with your map's issue number.
gh api repos/OrMizrahi12/potluck/issues/41/sub_issues --jq '.[] | "#\(.number) \(.state) blocked_by=\(.issue_dependencies_summary.blocked_by) assignees=\(.assignees|length) \(.title)"'
