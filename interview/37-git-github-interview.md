# 37. Git Core Architecture, GitHub & Workflow Commands

## 1. Git Internal Architecture
- **Git Storage Objects (`.git/objects/`)**:
  - *Blob*: Compressed file contents (hash of content).
  - *Tree*: Represents directories mapping file names to Blob hashes.
  - *Commit*: Pointer to a root Tree object + author, commit message, and parent commit hashes.
  - *Annotated Tag*: Named reference pointing permanently to a specific commit object.

---

## 2. Command Comparisons & Conflict Resolution
- **`git merge` vs `git rebase`**:
  - `merge`: Performs a 3-way merge creating a new merge commit. Non-destructive; preserves full historical context.
  - `rebase`: Re-applies feature branch commits on top of tip of target branch. Produces a clean, linear commit history.
- **`git reset` vs `git revert`**:
  - `reset --hard <hash>`: Destructively moves `HEAD` back to commit hash; discards uncommitted changes.
  - `revert <hash>`: Appends a new commit that explicitly reverses changes of a previous commit (safe for shared branches).
- **`git reflog` & Recovery**: Records every local pointer change (`HEAD`). Used to recover lost commits or deleted branches after accidental resets/rebases (`git checkout HEAD@{2}`).

---

## 3. Merge Conflict Resolution & Branching Strategy
- **Resolving Conflicts**:
  1. Identify files via `git status`.
  2. Edit conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>> feature`).
  3. Stage resolved files with `git add <file>` and complete via `git commit`.
- **Git Squash & Interactive Rebase**: Combines multiple draft commits into a single atomic commit before merging into main (`git rebase -i HEAD~5`).
