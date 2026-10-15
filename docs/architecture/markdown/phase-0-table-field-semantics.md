# Phase 0 — First-Class Table Field Semantics

**Status:** Approved Phase 0 baseline  
**Issue:** 0.1.6.4 — Define First-Class Table Field Semantics  
**Depends on:** 0.1.6.1 — Phase 0 Markdown Contract; 0.1.6.2 — Mahogany Field Model; 0.1.6.3 — Recursive and Container Field Semantics  
**Downstream:** 0.1.6.5 — Markdown Parser; 0.1.6.6 — Serialization and Round Trip; 0.1.6.7–0.1.6.8 — FieldDefinition guidance

## 1. Purpose

Define the canonical **Phase 0 conceptual representation** of a Markdown table as a first-class `Table` Field. Tables must remain structurally useful for future display, editing, search, and indexing while preserving authored Markdown as the source of truth. This document defines table semantics, **not** a production TypeScript type, parser, serializer, or TTRPG rules engine.

## 2. Foundations

- The selected baseline is CommonMark 0.31.2 with GFM 0.29-gfm table support, as established in 0.1.6.1.
- `Table` is one of the eight approved Field structural types. Columns, headers, rows, and cells are **subordinate structures**, not additional Field types.
- The general Field concepts `structure`, `structureDetails`, and `data` remain applicable. Their concrete discriminated TypeScript representation is downstream work.
- A Table occurrence has one structural parent in the Document/Section/container hierarchy. Its subordinate structures are ordered and belong to that table occurrence.
- A table's content and labels do not automatically establish Component relationships or FieldDefinition constraints.

## 3. Decision 1 — Table structure and explicit headers

A Table Field conceptually consists of:

1. An **ordered collection of column definitions**. Each column definition contains its **header cell content**, alignment, and position within the table.
2. An **ordered collection of data rows**, each with an ordered collection of cells.

The GFM header row is explicitly represented through column definitions rather than being treated as an ordinary data row whose role must be inferred. Header text is not a key, need not be unique, and does not identify a column persistently. **Within a parsed table, column definitions are distinguished by position even when their header content is blank or repeated.**

Example:

```markdown
| Level | Proficiency | Features |
| :--- | :---------: | -------: |
| 1 | +2 | Rage |
| 2 | +2 | Reckless Attack |
```

Conceptual representation (illustrative, not a schema):

```text
Table Field
├── Columns (ordered)
│   ├── [0] Header: Level; alignment: left
│   ├── [1] Header: Proficiency; alignment: center
│   └── [2] Header: Features; alignment: right
└── Data rows (ordered)
    ├── [0] [1, +2, Rage]
    └── [1] [2, +2, Reckless Attack]
```

The delimiter row's syntax is interpreted as column alignment information, not as a data row.

## 4. Decision 2 — Cell content and alignment

- Each header and data cell retains its **authored inline Markdown content**, consistent with 0.1.6.1 and 0.1.6.2. This includes supported emphasis, links, inline code, escapes (including escaped pipes), and other inline syntax subject to the established preservation contract.
- Cells are **not** required to have primitive types such as number, enum, or string-valued attributes. A cell containing `01-10`, `+2`, `—`, or `**Lothar**` remains Markdown content.
- GFM column alignment is an explicit property of the **column definition**: `left`, `center`, `right`, or `unspecified`. It is not inferred independently for each data cell.
- Empty cell content is valid. The distinction between an explicitly authored empty cell and a cell omitted from an irregular row is addressed in Decision 3.
- Exact whitespace, escaping, and delimiter formatting guarantees are resolved in 0.1.6.6; preserving interpreted content alone must not be assumed sufficient for lossless round trips.

## 5. Decision 3 — Irregular table preservation

GFM interprets rows relative to the number of header columns. A short row is padded with empty cells in the interpreted table; excess cells in a long row may be ignored by a standard parser. **Mahogany must not treat this normalization as permission to discard or fabricate authored source.**

| Source situation | Required architectural behavior |
| --- | --- |
| Row matches column count | Represent cells in their source order. |
| Row omits trailing cells | Preserve the fact that cells were omitted, when distinguishable from source; a normalized empty display cell must not silently erase that distinction. |
| Row explicitly contains empty cells | Retain empty authored cells and their positions. |
| Row contains excess cells | Retain the excess authored content even if GFM's interpreted table omits it. |
| Table syntax cannot safely be interpreted | Preserve source without silently coercing or discarding content; fallback handling follows the existing `OpaqueBlock` and preservation policies where applicable. |

GFM permits optional leading and trailing pipes. **A leading or trailing pipe is not, by itself, evidence of an additional empty cell.** Whether a cell was explicitly authored as empty or omitted must be determined from the actual row syntax relative to the defined columns; the parser and serializer will establish the exact mechanics in 0.1.6.5–0.1.6.6.

The conceptual Table model must therefore accommodate both the **GFM-interpreted rectangular view** and enough **authored source information** to preserve irregularities. This does not prescribe a specific source-span, raw-row, or supplemental-cell implementation. Those mechanics belong to 0.1.6.5 and 0.1.6.6.

A parser that exposes only normalized rows is insufficient on its own to guarantee preservation of extra or omitted authored cells. Future implementation must account for that limitation before writing modified tables.

## 6. Decision 4 — Structural versus semantic interpretation

GFM explicitly identifies column headers, rows, cells, and alignment. It does **not** establish that:

- The first column consists of **row headers**.
- `d100` indicates a dice mechanic.
- `01-10` denotes a numeric range.
- `Strength` is a defined attribute, or `16` is a typed score.
- A cell naming another Component creates a formal Component relationship.

These meanings may be useful **optional interpretations** later, but must not replace or reorganize the underlying Table Field or its authored Markdown.

The model must permit future designation of a column (commonly the first) as **row headers** for presentation, accessibility, and semantic interpretation. That designation is **not mandatory or automatically inferred in Phase 0**. Conventional terminology: **column headers** appear across the top; **row headers** label individual rows, often down the first column.

Future roll-table behavior, typed columns, row-header display, and other domain interpretations are independent of the canonical table structure.

## 7. Decision 5 — Identity, repetition, and ordering

- Column definitions are ordered by source position.
- Data rows are ordered by source position.
- Cells are ordered within their respective rows.
- Header content is associated with its corresponding column by **position**, not by unique header text.
- Duplicate column headers, duplicate rows, and identical cell values are valid and must not be deduplicated or treated as identity collisions.
- Phase 0 does **not** require persistent Mahogany identifiers for columns, rows, or cells. Containment and position distinguish occurrences in the current structure.
- Positional indices may change when a table is edited; they are **not stable identities**. Temporary editor IDs or future reference mechanisms can be designed separately if a demonstrated need arises.

No ordered table collection should be modeled as a dictionary keyed by header or cell content.

## 8. Relationship to the Document and recursive Field model

A `Table` remains a single Field occurrence in its enclosing Document, Section, ListItem, or other Markdown-valid container. Its internal columns, rows, and cells are specialized subordinate structures, **not arbitrary nested block Fields**. Ordinary GFM table cells contain inline content, not unrestricted block-level children.

Tables must preserve their own internal ordering and the Table Field's position relative to neighboring Fields. Section hierarchy, structural ownership, and preservation of unsupported neighboring content continue to follow 0.1.6.3.

## 9. Parser and serializer requirements (downstream)

**0.1.6.5 — Parser:**

- Recognize GFM table syntax and explicit header/delimiter structure.
- Expose ordered column definitions, alignment, data rows, and cell content.
- Preserve or otherwise make recoverable authored distinctions hidden by normalized parser output, including missing versus empty cells and excess cells.
- Avoid silently interpreting domain semantics or discarding unsupported inline source.

**0.1.6.6 — Serialization and round trip:**

- Preserve meaningful header/data distinctions, alignment, cell content, and ordering.
- Prevent silent source loss when irregular tables or parser-normalized content are present.
- Specify how authored escapes, whitespace, delimiters, and irregularities survive untouched reads and edits; do not claim byte-exact round trips from this conceptual model alone.
- Respect the approved no-implicit-write and source-preservation policies for external documents.

The exact in-memory source-retention mechanism, parser adapters, and serializer algorithms are deliberately not selected here.

## 10. Boundaries and deferred work

This issue does **not** implement parsing, serialization, rendering, SQLite indexing, dice/range interpretation, table-specific Component relationships, or a Table FieldDefinition schema. Future FieldDefinition work (0.1.6.7–0.1.6.8) may supply expected columns, required values, typed guidance, and TTRPG meaning **without redefining the underlying Table Field**.

Mahogany's future search/index layer may distinguish table, header, column, row, and cell content, but remains derived from Markdown rather than authoritative over it.

## 11. Acceptance criteria for architecture review

- [x] First-class Table Field with ordered column definitions and data rows.
- [x] Explicit GFM header-cell and alignment semantics.
- [x] Ordered cells and preservation of inline Markdown content.
- [x] Empty, omitted, and excess cell preservation requirements.
- [x] Duplicate header/value handling without artificial identities.
- [x] Structural versus semantic interpretation boundary, including optional future row-header designation.
- [x] No mandatory persistent row/column/cell IDs.
- [x] Explicit parser/serializer requirements and downstream boundaries.

**Review status:** Approved by Scrum Master (review of commit `a500dd1`, October 15, 2026). Minor documentation clarifications incorporated after approval. Acceptance checkboxes reflect architectural coverage, not parser or serializer implementation verification.
