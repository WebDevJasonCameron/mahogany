# Mahogany Architecture

This directory contains approved architectural contracts and decisions for Mahogany.

Mahogany is a local-first, Markdown-first application for managing reusable Components and their use in stories and tabletop role-playing games. Markdown/YAML files remain the authoritative source of user content; implementation models and future indexes exist to interpret and work with those files.

## Documents

| Document | Status | Related issue | Purpose |
| --- | --- | --- | --- |
| [Phase 0 Markdown Contract](markdown/phase-0-markdown-contract.md) | Approved baseline; amend as requirements emerge | 0.1.6.1 | Defines which Markdown structures Phase 0 recognizes, what it preserves, and what is deferred. |

## Documentation conventions

- **Issues track work; architecture documents record decisions.** Link the relevant document from the GitHub issue before closing it.
- **Keep scope explicit.** Each contract identifies its requirements, exclusions, and decisions reserved for later issues.
- **Update deliberately.** If implementation or research exposes a concrete incompatibility, revise the affected contract and note why; do not silently reinterpret it.
- **Prefer concise, durable contracts.** Research reports, experiments, and speculative designs do not become architectural requirements merely by being referenced.

## Guiding principles

1. **Read Before Write.** Existing Markdown documents must be readable without a Mahogany Component Definition or prior conversion.
2. **User ownership.** Files remain ordinary, portable Markdown/YAML wherever practical.
3. **Preservation before interpretation.** Lack of semantic support is not permission to discard content.
4. **Opinionated, but extensible.** Mahogany may eventually establish conventions for managed content; those conventions must not be assumed to exist in imported documents.

## Scope of this index

This is an index, not a complete system design. Add documents as architectural decisions are approved. Earlier Phase 0 decisions do not need to be retroactively rewritten merely to populate this directory.
