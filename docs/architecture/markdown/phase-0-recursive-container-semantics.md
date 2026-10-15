# Phase 0 — Recursive and Container Field Semantics

**Status:** Proposed — Scrum Master review  
**Issue:** 0.1.6.3 — Define Recursive and Container Field Semantics  
**Depends on:** 0.1.6.1 — Phase 0 Markdown Contract; 0.1.6.2 — Mahogany Field Model  
**Downstream:** 0.1.6.4 — Table Field Semantics; 0.1.6.5 — Parser; 0.1.6.6 — Serialization and Round Trip

## 1. Purpose

Define how the approved Field vocabulary represents hierarchy, containment, recursion, repetition, and source ordering in a Markdown Document. This is an **architectural contract**, not a production TypeScript schema, parser algorithm, or UI design.

Mahogany must respect the hierarchy established by supported Markdown syntax without treating document structure as a set of unique key/value properties or as formal relationships between Components. Markdown/YAML files remain the source of truth.

## 2. Foundations and vocabulary

- **Document:** The root container for a Markdown body. It is not a Field. Content outside any heading remains at the Document root.
- **Field:** One of the eight approved structural types: `Heading`, `Paragraph`, `List`, `Blockquote`, `CodeBlock`, `ThematicBreak`, `Table`, and `OpaqueBlock`.
- **Section:** A conceptual, heading-defined container that organizes a Heading Field and the content in its scope. Section is **not** a ninth Field type or a semantic object.
- **ListItem:** An ordered subordinate structure within a List, capable of containing Markdown-defined block content. It is not a ninth Field type.
- **Structural parent:** The single container that owns a particular Field occurrence or subordinate structure in the document tree. Structural ownership does not imply semantic ownership.

A representation may retain the original sequential Field order and derive Section hierarchy from headings. This contract defines the **observable structural relationships**, not whether the implementation stores sections as a primary tree or derives them as a view. The original Markdown source and source order remain authoritative.

## 3. Decision 1 — Heading-defined section ownership

A heading establishes a Section that structurally owns subsequent content and subordinate sections until the next heading of **equal or higher precedence** (numerically equal or smaller heading level), or the end of the enclosing scope/document.

- `#` owns following content and deeper headings until the next `#`.
- `##` owns following content and deeper headings until the next `##` or `#`.
- A heading with a numerically larger level belongs to the nearest preceding heading with a numerically smaller level that is still in scope.
- **Skipped levels are valid.** A `#####` immediately under `#` is its direct subsection. Mahogany must not invent absent `##`, `###`, or `####` sections.
- The original heading levels, text, occurrences, and order are preserved.
- Identically titled headings may repeat; their labels are not unique identifiers.
- Content before the first heading stays at the Document root.

Example:

```markdown
# Lothar

##### Personal Details
Some information.

## Background

###### Family
- Brother 1
- Brother 2

### History
Some history.

# Another Character
```

Conceptual hierarchy:

```text
Document
├── Section: Lothar (#)
│   ├── Section: Personal Details (#####)
│   │   └── Paragraph
│   └── Section: Background (##)
│       ├── Section: Family (######)
│       │   └── List
│       └── Section: History (###)
│           └── Paragraph
└── Section: Another Character (#)
```

A Section owns content for navigation, collapse/expand, display, and future editing. This does **not** turn `Lothar`, `Background`, or `Family` into a ComponentDefinition, unique property, class, or Component relationship.

## 4. Decision 2 — Read existing structure; write deliberate structure

**Reading:** Mahogany accepts valid heading levels as authored, including skipped levels, and must not silently normalize them. Reading an existing document does not authorize rewriting it.

**Writing:** When Mahogany generates new heading hierarchies through its own editing tools, it should use consecutive heading levels that reflect intended nesting (`#`, `##`, `###`, etc.) rather than arbitrary jumps.

Markdown supports headings H1–H6. Mahogany must not invent H7 syntax. How an editor handles an attempted deeper heading section is deferred to editing workflow design; it must not silently produce invalid syntax or restructure existing content.

Visual prominence and styling are separate from heading structure. Future UI styling may change appearance without changing the underlying Markdown heading level.

## 5. Decision 3 — Syntax-defined containers and leaves

Containment follows recognized CommonMark 0.31.2 / GFM 0.29-gfm block structure and heading-defined Section semantics. Mahogany must not infer a block parent-child relationship solely from indentation, textual proximity, labels, or perceived meaning.

| Structure | Role | Permitted subordinate content / boundary |
| --- | --- | --- |
| Document | Root container | Ordered Fields and heading-defined Sections |
| Section | Derived organizational container | Heading Field plus ordered content and subordinate Sections within heading scope |
| Heading | Section anchor | Heading content itself is not an arbitrary block container |
| Paragraph | Leaf block | Inline Markdown/text; no child block Fields |
| List | Container | Ordered ListItems |
| ListItem | Subordinate container | Ordered block content, including paragraphs, nested lists, and blockquotes, where Markdown syntax establishes containment |
| Blockquote | Container | Ordered supported block content, including nested blockquotes and lists, as established by Markdown syntax |
| CodeBlock | Leaf block | Literal code content; not parsed as nested Markdown blocks |
| ThematicBreak | Leaf block | No children |
| Table | Specialized structure | Rows/cells reserved for 0.1.6.4; not arbitrary child block Fields |
| OpaqueBlock | Preserved fallback leaf | Preserved unsupported source; not recursively interpreted in Phase 0 |

List items and table rows/cells are subordinate structures rather than additional canonical Field types. Exact table internals are **not** defined here. Fenced versus indented code and fenced info strings remain relevant structural details reserved for downstream modeling, as established by 0.1.6.2.

### 5.1 List-item containment

```markdown
- Brother: John

  John is a blacksmith.

  > He once served in the king's army.

  - Occupation: Blacksmith
  - Location: Riverdale

- Brother: Jacob
```

The first ListItem may contain its initial paragraph, following paragraph, blockquote, and nested list because **Markdown list syntax** establishes their membership. The second item is a separate sibling. Indentation, marker widths, blank lines, and continuation rules must be interpreted according to the selected Markdown specification/parser, not by a custom rule such as “four spaces always means a child.”

Conversely:

```markdown
Race: Giant

  A race derived from titans, long lost to time...

  Alts: earth, tundra, forest...
```

This does **not** establish `Race: Giant` as a parent Paragraph of the subsequent paragraphs. Two-space indentation outside an applicable container does not create general-purpose paragraph nesting. Four-space indentation may instead produce a code block. Optional semantic interpretations may describe associations, but must not replace or alter the source-defined block hierarchy.

### 5.2 Blockquotes

A Blockquote contains the ordered block structures established by blockquote syntax. It may contain paragraphs, lists, nested blockquotes, and other supported blocks as permitted by the Markdown specification. Its children are not flattened into one string merely because the quote is visually grouped.

## 6. Decision 4 — Recursion depth and safety

The conceptual Field model imposes **no arbitrary domain-level nesting depth** on recursive structures such as lists and blockquotes. Markdown headings themselves are limited to H1–H6; that limit does not impose a six-level limit on lists or blockquotes.

Parser, traversal, and UI implementations may establish practical safeguards for excessively deep, oversized, or malformed inputs. Such safeguards must not silently discard, flatten, or rewrite existing content. Handling a limit (for example, refusing an operation or retaining original source) belongs to downstream implementation design.

Visual styling and indentation policies are independent of architectural recursion limits.

## 7. Decision 5 — Single structural parent and source ordering

- Each **Field occurrence** has exactly one structural parent within its Document. The Document is the root and has no parent.
- Each subordinate container occurrence (such as a Section or ListItem) likewise has one structural parent.
- Every container preserves its children in **source order**, recursively.
- Child collections are ordered sequences, not dictionaries keyed by heading text, label, or interpreted KeyValue name.
- Repeated headings, labels, list items, and values are valid and do not cause identity collisions.
- Persistent Field UUIDs, ordering keys, and back-references to parents are **not required** for Phase 0.
- The containment model is an **acyclic tree**: an occurrence cannot contain itself, an ancestor, or a shared occurrence with a second parent.

References to other content are different from structural ownership. Inline links, anchors, wikilinks, or future Component relationships may point to another document or section without moving that target into the referring Field's containment tree.

## 8. Decision 6 — Unsupported content and annotations

Unsupported content must coexist with recognized Fields inside the appropriate containing structure whenever its location can be established. An unsupported child must not cause Mahogany to discard the entire enclosing Section, ListItem, or Blockquote.

- **Preservation:** Retain recognized unsupported source as faithfully as practical, using `OpaqueBlock` when appropriate. `OpaqueBlock` is a fallback representation, **not a universal detector** of unfamiliar Markdown extensions; an extension such as a wikilink may already have been parsed as ordinary paragraph text.
- **Display:** Expose preserved content and indicate when Mahogany does not fully support its interpretation. Identical rendering to another application's extension is not guaranteed.
- **External files:** Reading does not write. Mahogany may add HTML comment annotations to an existing externally authored file **only with explicit user authorization** to modify that original file.
- **Mahogany-authored files:** When recognized unsupported content is introduced or retained through Mahogany's editing workflow, Mahogany writes appropriate HTML comment annotations on save.
- **Idempotence:** Mahogany must recognize its own annotations and avoid duplicating them on subsequent saves.
- **No structural side effects:** An annotation is a source-level notice, not a new parent-child relationship, Component metadata field, or semantic Component link.

Illustrative annotation only — **not an approved comment format**:

```markdown
<!-- mahogany:unsupported:start -->
:::custom-statblock
Custom syntax Mahogany does not understand.
:::
<!-- mahogany:unsupported:end -->
```

Exact detection, annotation syntax, safe placement (including interaction with Markdown block parsing), source-span handling, and round-trip behavior are deferred to 0.1.6.5 and 0.1.6.6. Annotation insertion must not silently change the meaning of surrounding Markdown; where safe insertion cannot be established, downstream design must provide a non-destructive alternative rather than compromising preservation.

## 9. Structural hierarchy is not Component semantics

Containment describes **where content appears in a Markdown Document**, not what domain relationship it asserts.

For example, a `Family` Section containing `Brother: John` does not automatically establish a formal Mahogany relationship to a `John` Component. Nor does a repeated `Brother` label require unique keys. Optional KeyValue interpretation remains an **annotation of authored content**, not a replacement for it, as approved in 0.1.6.2.

Formal Component references, semantic relationships, provenance, and FieldDefinition-specific uniqueness rules are separate concerns.

## 10. Downstream requirements

The parser and serializer designs must honor the following requirements:

1. Preserve the original Markdown heading levels, source ordering, and repeated occurrences.
2. Recover or expose heading-based Section scope without inventing missing heading levels.
3. Respect Markdown-defined list-item and blockquote containment, including mixed child block types.
4. Preserve source order at every level and avoid converting repeated content into keyed maps.
5. Keep structural ownership acyclic and single-parent; keep links/references separate.
6. Preserve unsupported content in place when recognized and avoid unnecessary loss of surrounding supported structure.
7. Respect no-implicit-writes for external files and the approved annotation authorization policy.
8. Retain enough source fidelity for safe round-trip serialization; exact guarantees are specified in 0.1.6.6.
9. Keep table internals available for first-class modeling under 0.1.6.4.

## 11. Explicit non-goals

This issue does **not** implement a parser, serializer, renderer, collapsible UI, production TypeScript types, editing commands, style customization, or Component relationships. It does not define detailed table internals, arbitrary inferred paragraph nesting, parent-pointer requirements, or new Field types. It does not establish final HTML comment syntax or universal detection of unsupported Markdown extensions.

## 12. Review checklist

- [ ] Document and heading-defined Section responsibilities are explicit.
- [ ] Heading hierarchy supports skipped levels without fabricated placeholders.
- [ ] Read/write heading conventions and H1–H6 limitations are explicit.
- [ ] Containers, leaves, ListItems, and blockquote recursion are defined.
- [ ] Recursive depth, source order, repetition, and single-parent ownership are defined.
- [ ] Unsupported content and annotation authorization preserve the no-implicit-writes rule.
- [ ] Structural containment is separated from semantic Component relationships.
- [ ] Table internals, parsing, and serialization are reserved for their downstream issues.

**Approval:** Pending Scrum Master review. Once approved, update this status to **Approved Phase 0 baseline** and align the architecture index.
