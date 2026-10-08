---
name: Bun lockfile compatibility
description: Compatibility of this imported repository's lockfile with the workspace Bun toolchain.
---

The imported `bun.lock` uses lockfile version 2. The workspace's Bun 1.3.6 cannot parse it and ignores it; using `bun add` rewrites the lockfile and adds Bun to `.replit`.

**Why:** A routine package installation created a large unrelated lockfile change and could resolve a different dependency graph.

**How to apply:** Keep the imported lockfile unless intentionally migrating it. After package operations, inspect `bun.lock` and `.replit` diffs; use a compatible package manager when possible.
