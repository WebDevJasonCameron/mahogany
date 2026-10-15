# Mahogany — Vocabulary

**Status:** Living architectural reference  
**Location:** `docs/VOCABULARY.md`  
**Last reviewed:** 2026-10-15  
**Scope:** Domain vocabulary and distinctions; not an implementation schema.

## Purpose

This document establishes consistent language for Mahogany's domain model, Markdown representation, and supporting infrastructure. It records **approved** terminology separately from **proposed or deferred** terminology. When an architectural decision changes a term, update this document in the same change as the relevant architecture document and code.

## Approved vocabulary

| Term | Meaning | Important distinction |
| --- | --- | --- |
| **Component** | A reusable, noun-like object used in a world, story, or TTRPG, such as a character, location, item, or species. | A Component is not itself a Markdown Field. |
| **Component Definition** | The definition governing the structure and metadata of a kind of Component. | Not the same as a Markdown Document or Field. |
| **Document** | The container representing the Markdown body of a file, with ordered Fields. | The Document is not itself a Field; it can be read without a Component Definition. |
| **Field** | An occurrence of a meaningful Markdown block structure and its content in a Document. | A Field is actual document content, not a schema or validation rule. |
| **FieldType** | The structural kind of a Field: `Heading`, `Paragraph`, `List`, `Blockquote`, `CodeBlock`, `ThematicBreak`, `Table`, or `OpaqueBlock`. | Does not mean `String`, `Text`, `Number`, or `Enum`. The precise TypeScript symbol name is an implementation choice. |
| **structure** | Conceptual property identifying a Field's Markdown structure. | Not a semantic label like `Strength` or `Class`. |
| **structureDetails** | Conceptual properties specific to the Field structure, such as a heading level or list ordering. | Not an unrestricted bag of metadata. |
| **data** | The content represented by a Field, which may be text or ordered subordinate structures. | Not necessarily a typed scalar value. |
| **Section** | A heading-defined organizational container whose scope follows heading precedence within an enclosing Markdown container. | Derived structure, not a ninth Field type or a Component. |
| **ListItem** | An ordered subordinate structure within a List, capable of holding nested Markdown block content. | Not a top-level Field type. |
| **TableRow / TableCell** | Subordinate structures within a Table, preserving authored order and irregularities. | Not top-level Field types; missing, empty, and excess cells must not be silently conflated. |
| **OpaqueBlock** | An authored source block that Mahogany cannot safely interpret structurally under its supported contract. | Preserve source rather than guess at semantics. |
| **Markdown source** | The original Markdown/YAML text, authoritative for persistence. | A parsed representation or future SQLite index is not the source of truth. |
| **Parser adapter** | Infrastructure translation from a third-party Markdown parser's syntax tree into Mahogany's domain Document/Field model. | Parser-specific AST types should not leak into domain types. |
| **KeyValue** | An optional interpretation of content that may identify a key and value. | Not a ninth Markdown Field type; do not infer it merely from punctuation. |

## Component state vocabulary

| Term | Meaning |
| --- | --- |
| **Library** | Core/source context for reusable Components. |
| **Package** | Context for preparing a story or campaign, identified by its `stateId`. |
| **InPlay** | Checked-out context for play, tied to a specific Package and `stateId`. |
| **state / stateId** | Together identify a context; `stateId` alone is not a globally unique context identifier. |
| **copyOf** | Lineage reference used to trace a copied Component back to its predecessor/source according to the approved state workflow. |

## Provisional or deferred terminology

| Term | Current guidance | Status |
| --- | --- | --- |
| **FieldDefinition** | Historically the name of a TypeScript interface for provisional Component Definition field schemas. Do **not** use it as a synonym for an actual Markdown Field. Its final role and name require a separate migration decision. | **Migration pending** |
| **DataType** | Potential future description of an interpreted value, such as number or enumerated choice. | **Deferred; not an approved Phase 0 Field type** |
| **DataDefinition / DataConstraint** | Potential future rule describing how interpreted data is validated or constrained. | **Deferred; not yet modeled** |
| **FieldStructure** | Possible alternative TypeScript symbol name for the eight Markdown structures. | **Not selected; use approved conceptual vocabulary in architecture docs** |

## Deprecated usage and migration notes

- The current `src/domain/components/models/FieldType.ts` enum (`String`, `Text`, `Number`, `Enum`) reflects an **earlier provisional schema design**. These names must not be presented as the eight approved Markdown Field types.
- The existing `src/domain/components/models/FieldDefinition.ts` is likewise tied to that provisional schema and its consumers. **Do not rename or delete it in isolation.** Review factories, validators, serializers/deserializers, stored YAML compatibility, and tests as one migration.
- The approved Markdown Field model is defined conceptually in `docs/architecture/markdown/phase-0-field-model.md`; recursive semantics and table behavior are defined in adjacent Phase 0 architecture documents. Those documents remain normative where this glossary is abbreviated.
- Existing saved Component Definition Markdown may need an explicit compatibility or migration policy before the provisional schema is replaced.

## Maintenance rules

1. **One term, one meaning:** avoid reusing `Field` for both Markdown block content and typed data-validation rules.
2. **Record status:** mark vocabulary as Approved, Provisional, Deferred, or Deprecated when ambiguity is possible.
3. **Update together:** changes to terminology should update this glossary, related architecture docs, source identifiers, tests, and examples in the same tracked work.
4. **Preserve compatibility intentionally:** renamed types in source code do not automatically justify changing persisted YAML formats.
5. **Keep this readable:** document conceptual meanings here; put detailed algorithms and TypeScript interfaces in their dedicated design documents.

## References

- `docs/architecture/markdown/phase-0-markdown-contract.md`
- `docs/architecture/markdown/phase-0-field-model.md`
- `docs/architecture/markdown/phase-0-recursive-container-semantics.md`
- `docs/architecture/markdown/phase-0-table-field-semantics.md`
