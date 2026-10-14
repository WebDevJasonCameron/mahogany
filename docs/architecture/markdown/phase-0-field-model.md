# Phase 0 — Mahogany Field Model

**Status:** Proposed for Scrum Master review  
**Issue:** 0.1.6.2 — Define the Mahogany Field Model  
**Depends on:** 0.1.6.1 — Phase 0 Markdown Contract  
**Downstream:** 0.1.6.3–0.1.6.8

## 1. Purpose

Define Mahogany's canonical conceptual vocabulary for representing meaningful structures found in the Markdown body of a document. This document records architectural decisions; it is **not** an implementation specification or final TypeScript interface design.

Markdown/YAML files remain the source of truth. The Field model is an internal representation of document content, independent of Component Definitions, a particular Markdown parser, and any future derived SQLite index.

## 2. Architectural relationship

```text
Markdown-backed Component
├── Metadata (YAML front matter, when present)
│   └── Component identity, category, state, lineage, etc.
└── Document (Markdown body)
    └── fields[] — ordered collection of Fields
        ├── Heading
        ├── Paragraph
        ├── List
        ├── Table
        └── ...
```

A **Component** combines its management metadata with its document content. A **Document** is the container for the Markdown body and its ordered Fields; the Document is **not itself a Field**. A **Field** represents a supported Markdown block structurally, with its content and any subordinate structures needed to represent that block.

YAML front matter is handled separately from the Markdown body. It does not become an ordinary Field. Additional optional Component metadata, such as future provenance information, likewise does not automatically become a body Field.

**Read Before Write:** Supported Markdown can be read into a Document and Fields without a Component Definition or Mahogany-specific metadata. Such a file is not necessarily a fully managed Mahogany Component.

## 3. Field definition

> A Field is Mahogany's ordered representation of a meaningful Markdown block structure and its content, independent of any Component Definition or inferred TTRPG meaning.

Mahogany represents each supported block structurally. It does **not** require every internal detail, word, inline formatting token, list item, or table cell to become an independently editable top-level Field.

### 3.1 Conceptual Field properties

```typescript
// Conceptual shape only — not an approved production interface.
Field {
  structure
  structureDetails
  data
}
```

| Property | Responsibility |
|---|---|
| `structure` | Identifies the recognized Markdown block type, such as Heading or List. |
| `structureDetails` | Describes characteristics of that structure, such as a heading level or list ordering. Valid details depend on the structure. |
| `data` | Contains the block's actual content. Its shape depends on the structure: Markdown text, ordered subordinate content, or other appropriate structured data. |

These names express the approved **conceptual model**. The final TypeScript types, discriminated unions, and per-structure property definitions will be refined during implementation and relevant downstream issues.

For example:

```typescript
{
  structure: "Heading",
  structureDetails: { level: 3 },
  data: "Character Background"
}
```

A list's `data` may instead contain ordered list items. A table's `data` will eventually contain table-specific structures established in 0.1.6.4. `structureDetails` should be constrained by the structure, not treated as an arbitrary catch-all property bag.

## 4. Phase 0 structural Field vocabulary

The following **eight** top-level structural Field types are approved:

| Structure | Represents | Notes |
|---|---|---|
| `Heading` | ATX and Setext headings | Heading level is a structural detail; section ownership is deferred to 0.1.6.3. |
| `Paragraph` | Paragraph content | Retains relevant inline Markdown. |
| `List` | Ordered, unordered, nested, and task/check lists | List items are subordinate structures; list semantics are detailed in 0.1.6.3. |
| `Blockquote` | Quoted block content | May contain subordinate Markdown blocks; recursion is deferred. |
| `CodeBlock` | Fenced and indented code blocks | Details may include fenced language information where present. |
| `ThematicBreak` | Horizontal/thematic rules | A structural separator. |
| `Table` | GFM pipe tables | First-class structure; detailed table representation belongs to 0.1.6.4. |
| `OpaqueBlock` | Source content recognized as unsafe or unsupported for structural interpretation | Preserves original content without falsely claiming semantic understanding. |

This vocabulary derives from the approved Phase 0 Markdown contract. It is **not** a promise that every syntax element in the Markdown specification becomes its own Field type.

### 4.1 Subordinate structures

`ListItem`, `TableRow`, and `TableCell` are conceptual subordinate structures, **not additional top-level Field types** in the eight-type vocabulary. Individual list items retain their own content and may have their own structural characteristics and optional content interpretations. Their exact type relationships and nesting rules are deferred to 0.1.6.3 and 0.1.6.4.

### 4.2 Lists and future outlines

A single `List` structure covers ordered and unordered lists; task/check state is associated with relevant items. List items may mix ordinary content and key-value-style content. There is no need for separate `OrderedKeyValueList` or `UnorderedKeyValueList` Field types.

The design should not assume decimal numbering is the only numbering convention Mahogany could ever support. Roman/alphabetic hierarchical outlines are a **future enhancement**, not a Phase 0 Markdown syntax or a ninth Field type.

## 5. Structural representation versus content interpretation

Markdown structure and inferred meaning are distinct.

`KeyValue` is an **optional interpretation of content**, not a ninth Markdown block type. For example:

```markdown
Name: Lothar

*Beliefs* Magic resides in muscle.

- Strength: 18
- Retired soldier
```

The first two blocks remain `Paragraph` Fields, and the last block remains a `List` Field. Mahogany may additionally interpret certain content as a key and value. Each list item may independently carry such an interpretation; a list can mix key-value and ordinary items.

The model must not automatically treat every colon or emphasized phrase as proof of a key-value relationship. Recognition, confirmation, validation, and the exact representation of optional interpretations are **not finalized in this issue**. Such interpretations must not replace or discard the original Markdown content.

Value-oriented notions such as `String`, `Text`, `Number`, and `Enum` are not structural Markdown Field types. Their future relationship to guided content entry belongs to FieldDefinition redesign in 0.1.6.7.

## 6. Document order, repetition, and identity

- A Document maintains its Fields in **source document order**.
- Lists, tables, and other containers maintain meaningful order within their subordinate content. An *unordered list* means its Markdown marker type is unordered; it does **not** mean Mahogany may scramble its items.
- Repeated headings, labels, keys, and list-item descriptions are valid. Human-readable labels are not unique identifiers.
- Phase 0 Fields **do not require persistent UUIDs**. Their location and structural relationships are sufficient for a particular parsed representation.
- A Field's position is not promised to be stable across edits. Any future need to track individual Fields persistently must be justified by a concrete requirement.

## 7. Inline Markdown and source preservation

During Phase 0, Field content must retain relevant inline Markdown, including emphasis, links, inline code, and other constructs required by 0.1.6.1. For example, `*Lothar*` and `_Lothar_` may remain in the content as written; Mahogany need not strip formatting into separate Field attributes.

`sourceInfo` is **not** a required Field property. Every Field already belongs to a Document, and a Field does not need to repeat its file path or Component identity.

This decision does **not** claim that storing Markdown in `data` alone guarantees exact byte-for-byte round trips. The precise treatment of untouched source regions, edits, whitespace, source spans, and serialization safety belongs to **0.1.6.6**. If later work requires a separate document-level preservation mechanism, that can be evaluated without adding `sourceInfo` to every Field now.

Reference-style link definitions may appear separately from the links that use them; their preservation is a **document-wide concern**, not necessarily a separate Field. Exact representation is deferred to parsing and serialization design.

## 8. Unsupported and preserved content

When Mahogany can identify content it cannot safely represent as a supported structure, it may retain the original source in an `OpaqueBlock`:

```typescript
{
  structure: "OpaqueBlock",
  structureDetails: {},
  data: "Original unsupported source content"
}
```

An `OpaqueBlock` is **not** an authored fenced code block. It indicates preservation without a claim of structural understanding.

Not every unfamiliar extension will be detectable as unknown: a standard parser may interpret some syntax as ordinary text or another supported structure. Parser detection and fallback rules belong to **0.1.6.5**. Unsupported content must not be silently discarded. If a future edit or serialization cannot preserve it safely, the operation should fail explicitly rather than risk data loss, under rules finalized in **0.1.6.6**.

Raw HTML and HTML comments remain source content even when a renderer filters, suppresses, or sanitizes them. Rendering policy is distinct from source preservation.

## 9. Architectural independence and extensibility

- **ComponentDefinition is not required** to construct Fields from supported Markdown.
- **FieldDefinition is guidance**, not ownership of existing Fields. It may later reference the same structural vocabulary without determining what Markdown is readable.
- The Field model is independent of the chosen Markdown parser's native AST. A parser adapter will translate into Mahogany's model in 0.1.6.5.
- SQLite and search indexes are **derived consumers**, not sources of truth or defining schemas for Fields.
- New Markdown structures and optional content interpretations should be addable without redesigning Component identity, state, or lineage.

## 10. Deferred decisions and issue boundaries

| Issue | Responsibility |
|---|---|
| **0.1.6.3** | Recursive/container semantics, nested lists, blockquotes, heading-derived sections, subordinate structure relationships. |
| **0.1.6.4** | First-class table model, rows, cells, headers, alignment, and edge cases. |
| **0.1.6.5** | Markdown parsing, parser adapter, unsupported syntax detection, deterministic reads. |
| **0.1.6.6** | Markdown serialization, round trips, source preservation guarantees, safe edits and failures. |
| **0.1.6.7** | FieldDefinition redesign and relationship to structural and value semantics. |
| **0.1.6.8** | Definition validation and conformance semantics. |
| **0.1.6.9** | Integration and regression verification. |

Out of scope here: production parser/serializer code, exact TypeScript interfaces, full recursive rules, table internals, Component Builder UI, SQLite schema, provenance schema, and custom Mahogany Markdown syntax.

## 11. Decision summary

1. A Field represents supported Markdown block structure, not a database column or instantiated FieldDefinition.
2. The Phase 0 vocabulary consists of eight top-level structures: Heading, Paragraph, List, Blockquote, CodeBlock, ThematicBreak, Table, and OpaqueBlock.
3. Each Field conceptually has `structure`, `structureDetails`, and `data`; the shape of `data` varies by structure.
4. `KeyValue` is an optional content interpretation, not a structural Field type.
5. List items and table elements are subordinate structures; detailed semantics are deferred.
6. The Document is separate from Field and owns an ordered collection of Fields.
7. YAML front matter and other Component metadata are separate from body Fields.
8. Repetition is legal; no permanent Field UUIDs are required in Phase 0.
9. Inline Markdown is retained in content; `sourceInfo` is not a required Field property.
10. Unsupported content is preserved when safely possible, with `OpaqueBlock` available as a fallback representation.
11. Markdown remains authoritative; parser ASTs, Component Definitions, and SQLite do not define the Field model.

## 12. Completion criteria

This architecture document establishes the conceptual Field definition, eight-type vocabulary, core property responsibilities, document ordering, repetition and identity rules, optional interpretation policy, unsupported-content strategy, and downstream boundaries. It is ready for Scrum Master review. **Approval of this document does not authorize implementation beyond the scope of the corresponding roadmap issues.**
