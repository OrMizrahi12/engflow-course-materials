# Potluck at lesson 5.1

Repository: `https://github.com/OrMizrahi12/potluck` (public; clone it, don't fork it).

| Tag | Commit | What it is |
|---|---|---|
| `lesson-5.1` | `b7e1c03` | `main`, unchanged since lesson 4.1: this lesson commits nothing to Potluck |
| `lesson-4.2` | `5fd59d5` | the branch `prototype/balances`: `prototype/potluck-balances.PROTOTYPE.html`, the page the drill copies |
| `lesson-4.1` | `b7e1c03` | the same commit as `lesson-5.1` |

The drill in this lesson ran in a throwaway folder, `~/test-drill`, with its own local git repository. It was never pushed,
and nothing from it is in Potluck. Its files are in this kit under `drill/`.

To get the prototype from your clone without checking out the branch:

```bash
mkdir -p ~/test-drill
git -C ~/potluck show lesson-4.2:prototype/potluck-balances.PROTOTYPE.html > ~/test-drill/potluck-balances.PROTOTYPE.html
```

The spec-bound rules decided in modules 3 and 4 (the odd-cent rule, decimals, the seven rules from the prototype, the
testing choices of lesson 3.3) are still in the planning session's notes. They go into the spec in lesson 5.2. What this
lesson adds is vocabulary only: test, public interface, seam, mock, deep module.
