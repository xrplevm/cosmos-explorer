---
name: error-handling-always-present
description: Error handling must always be included — not optional, not deferred
type: feedback
---

Always include error handling when implementing any feature. Do not defer it to a polish phase.

**Why:** User explicitly stated this is a requirement, not optional.

**How to apply:** Every hook, adapter method, page, and component must handle and surface errors. No silent failures. No empty catch blocks. Error states are first-class citizens alongside loading and success states.
