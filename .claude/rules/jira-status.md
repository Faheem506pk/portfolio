# Jira status follows where the code is (STRICT)

When you START work on a ticket (you, Antigravity, Cursor or any agent), move it to **In Progress** first (transition id 21). Only tickets actually being worked on now are In Progress; do not move a ticket you are only reading about.

When the work for a Jira ticket is finished, its status depends on where the code is:

| Where the ticket's commits are | Status |
|---|---|
| Every `KAN-<n>:` commit for the ticket is merged into `deploy/staging` | **Ready for testing** (QA can test it on staging) |
| Any commit is only on a feature branch (for example `faheem-v1`) or only on GitHub, not on `deploy/staging` | **Dev done** |
| Work started, not finished | **In Progress** |

How to check, for each commit of the ticket:

```bash
git fetch origin
for c in $(git log --format=%h --grep="^KAN-<n>:" HEAD); do
  git merge-base --is-ancestor "$c" origin/deploy/staging && echo "$c on staging" || echo "$c NOT on staging"
done
```

Jira workflow quirk (TabTake project KAN): there is no transition named "Dev done". The transition named **"In Review"** (id 31) lands in the **Dev done** status. "Ready for testing" is transition id 4.

When code reaches `deploy/staging` later, move the ticket from Dev done to Ready for testing then. QA retest tickets go to Noor ul Ain.

Mirrored: root `CLAUDE.md` §4 rule 15, `AGENTS.md` hard rule 29.
