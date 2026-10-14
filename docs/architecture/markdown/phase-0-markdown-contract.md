# Phase 0 Markdown Contract

**Status:** Approved Phase 0 baseline  
**Issue:** 0.1.6.1 — Define Supported Markdown Document Scope  
**Scope:** Input language, structural recognition, and preservation expectations  
**Implementation:** Deferred to later 0.1.6.x issues

## 1. Purpose

This contract defines the Markdown that Mahogany intends to recognize and preserve during Phase 0. It establishes input requirements for the future Mahogany Field/document model **without defining that model**.

Mahogany is Markdown-first and local-first. Markdown/YAML documents remain the source of truth. Mahogany must be able to read supported Markdown from manually authored files and other applications without requiring a `ComponentDefinition`, `FieldDefinition`, or prior Mahogany optimization.

Conceptually:

```text
Markdown document
        ↓
       Parse
        ↓
Mahogany Field / Document Model
        ↓
 Display / Search / Future indexing
```

Guided authoring through Component Definitions is a separate workflow and must not limit which supported Markdown Mahogany can read.

## 2. Baseline dialect

Mahogany's Phase 0 Markdown baseline is:

1. **CommonMark 0.31.2**, for standard Markdown block and inline syntax.
2. **GitHub Flavored Markdown (GFM), specification 0.29-gfm**, for its standardized extensions, including pipe tables, task lists, strikethrough, extended autolinks, and disallowed-raw-HTML filtering behavior when rendering.
3. **YAML front matter**, as an explicitly supported metadata convention outside the CommonMark/GFM specifications.

This is a compatibility baseline, not a permanent ceiling on Mahogany's capabilities. Mahogany may adopt additional conventions or extensions later when justified by concrete requirements. **No new Mahogany-specific Markdown syntax is defined by this contract.**

## 3. Scope classifications

- **Supported:** Mahogany must recognize the construct's structural role and make it available to its future document model. This does not imply that every nested or inline detail becomes an independent semantic Field in Phase 0.
- **Preserved:** Mahogany must retain the original source where practical, but is not required to provide specialized interpretation or structured editing in Phase 0.
- **Deferred:** Specialized recognition, behavior, authoring, or semantic interpretation is outside Phase 0. A deferred feature's underlying source must still be preserved where practical.
- **Unsafe or ambiguous:** If Mahogany cannot safely preserve a document or proposed modification, it must not silently rewrite or discard the affected content. Later implementation issues will define diagnostics and refusal behavior.

These categories describe promises, not a TypeScript type hierarchy.

## 4. Supported block-level structures

| Construct | Phase 0 treatment | Notes |
| --- | --- | --- |
| ATX headings (`#`–`######`) | Supported | Heading levels and order matter. |
| Setext headings (`===` / `---`) | Supported | Levels 1–2; preserve original style when untouched. |
| Paragraphs | Supported | May contain inline Markdown. |
| Ordered lists | Supported | Preserve item order and numbering information where relevant. |
| Unordered lists | Supported | Preserve item order and nesting. |
| Nested lists | Supported | Includes nested ordered/unordered combinations. |
| GFM task/check lists | Supported | Preserve checked/unchecked state. |
| Blockquotes | Supported | May contain other supported blocks. |
| Fenced code blocks | Supported | Preserve language/info string and literal content; no obligation to interpret a `statblock` or plugin-specific language. |
| Indented code blocks | Supported | Recognize as code, distinct from paragraphs. |
| Thematic breaks / horizontal rules | Supported | Recognize as structural separators. |
| GFM pipe tables | Supported | See Section 6. |
| YAML front matter | Supported | Metadata syntax; not a CommonMark/GFM feature. |
| Link reference definitions | Supported for preservation and link resolution | May be non-rendered source that affects links elsewhere. |
| Raw HTML blocks and inline HTML | Preserved | Specialized HTML interpretation/editing is deferred; see Section 7. |
| HTML comments | Preserved | Do not discard non-rendered source. |
| Footnotes | Preserved | Specialized support is deferred; not part of the formal GFM specification. |
| Wikilinks (`[[Page]]`) | Preserved | Link resolution and Mahogany authoring are deferred. |
| Obsidian/GitHub-style callouts | Preserved | Baseline blockquote rendering may still apply; callout semantics are deferred. |
| Math syntax | Preserved | Specialized math interpretation/rendering is deferred. |
| Definition lists | Preserved where practical | Not part of the selected baseline. |
| Directives and application-specific syntax | Preserved where practical | Includes Homebrewery constructs and other foreign extensions. |

For all supported structures, the future model must retain document order and distinguish structural content from inferred application semantics.

**Headings:** CommonMark headings are sequential blocks, not intrinsically nested section objects. Any inferred section hierarchy belongs to a later design issue; it must not be assumed to be a fact encoded directly by Markdown.

## 5. Inline Markdown preservation

Inline syntax can occur inside headings, paragraphs, list items, blockquotes, and table cells. At minimum, Phase 0 must preserve the meaning and source of:

- Strong emphasis/bold and emphasis/italics.
- Links, reference-style links, and images.
- Inline code and strikethrough.
- Escaped punctuation and character/entity references.
- Hard and soft line breaks and other formatting that can affect rendering.
- GFM extended autolinks.

This contract does **not** require every inline element to be a separate Mahogany Field. However, a block-level implementation must not discard or flatten away inline formatting merely because Phase 0 focuses on blocks.

Unchanged source should remain unchanged. Exact handling of edits, offsets, and reserialization belongs to 0.1.6.5–0.1.6.6.

## 6. Tables

**GFM pipe tables are required Phase 0 structures.**

The selected syntax uses a header row followed by a delimiter row, with optional column alignment markers and subsequent body rows. Table cells contain inline content; standard GFM does not provide merged cells, multi-row headers, captions, dedicated row-header semantics, or block-level content inside cells.

Mahogany must distinguish the **literal grid encoded by Markdown** from inferred TTRPG meaning, such as dice ranges, level progression, equipment costs, ability scores, or a first column functioning as row labels.

**Preservation caveat:** Under GFM rules, extra cells in a body row may be ignored by a parser. Mahogany must not treat the resulting parsed grid as proof that the ignored source is disposable. Preserve original table source where practical, and do not silently lose extra cells during future writes.

The internal Table Field model, inferred semantics, and editing behavior are deferred to **0.1.6.4 — Define First-Class Table Field Semantics**.

## 7. Raw HTML, comments, and non-rendered source

Raw HTML and HTML comments are part of the source document and must be preserved where practical. They are not automatically Mahogany metadata.

Raw HTML must **not** be rendered as unrestricted executable HTML in the Electron interface. The eventual renderer must use an appropriately safe policy, such as sanitization or source display. The exact renderer/security implementation is deferred.

Comments may carry author notes or conventions from other applications. Mahogany must not strip them simply because they do not render as visible text.

HTML comments are a possible future carrier for Mahogany-specific annotations, but **this contract introduces no Mahogany marker syntax** and does not authorize automatic insertion of markers into imported files.

## 8. Unknown and unsupported content

Mahogany follows **preservation before interpretation**:

1. Read supported Markdown without requiring a Component Definition or optimization step.
2. Retain unfamiliar or unsupported source where practical, even when Mahogany cannot assign it specialized meaning.
3. When specialized interpretation is unavailable, permit a safe fallback presentation, including displaying original source as code-style text where appropriate.
4. Do not assume every unfamiliar extension is detectable as an unknown node: a standard Markdown parser may interpret it as ordinary text, a paragraph, or a blockquote.
5. Do not automatically alter imported documents by adding metadata, markers, or normalization merely because they were opened.
6. If a proposed structured modification cannot safely preserve relevant source, do not silently perform a lossy rewrite. The later editing implementation must define how to decline or surface that operation.

An **unrecognized source region** is conceptually distinct from an author-intended Markdown **code block**. The eventual Field model may need a way to retain uninterpreted source, but its TypeScript representation is not decided here.

## 9. TTRPG-specific compatibility considerations

The baseline covers many common TTRPG document patterns: character descriptions, sectioned NPC notes, nested inventories, task lists, random encounter tables, progression tables, and fenced statblock data.

Additional patterns exist but do not require new syntax during Phase 0:

| Pattern | Phase 0 stance |
| --- | --- |
| Bold `Label: Value` lines | Preserve Markdown; automatic key/value inference deferred. |
| Obsidian wikilinks and callouts | Preserve; specialized semantics deferred. |
| Obsidian Dataview inline fields and query fences | Preserve; query execution and field inference deferred. |
| Fantasy Statblocks or other plugin-specific fenced blocks | Support the fence; preserve contents; plugin semantics deferred. |
| Homebrewery/GM Binder extensions | Preserve original source where practical; specialized interpretation deferred. |
| Dice expressions and roll ranges | Preserve as text; no automatic game-system semantics. |
| Advanced tables (merged cells, captions, multiple headers) | Not part of baseline GFM; preserve foreign syntax where practical. |

## 10. Deliberate Phase 0 exclusions

This contract does not require:

- Parsing or executing plugin-specific TTRPG languages or queries.
- Specialized wikilink, callout, math, or directive editing.
- Automatic conversion of prose, bold labels, or table columns into game-specific fields.
- Advanced table syntax outside GFM.
- A new Mahogany-specific Markdown dialect or comment-marker format.
- A Library clone/replace/optimization implementation or an editing-permission workflow.
- A particular parser library, editor framework, or serializer algorithm.

These exclusions do not waive the preservation expectations in Sections 5–8.

## 11. Constraints passed to later issues

| Issue | Requirement carried forward |
| --- | --- |
| **0.1.6.2 — Mahogany Field Model** | Represent supported block structures and source order; allow uninterpreted content; do not require a Component Definition to read. |
| **0.1.6.3 — Recursive and Container Semantics** | Handle nested lists and blockquotes; decide how, if at all, section hierarchies are derived from sequential headings. |
| **0.1.6.4 — Table Field Semantics** | Model GFM tables without silently losing raw cells or inventing TTRPG meaning. |
| **0.1.6.5 — Markdown → Field Parsing** | Implement the chosen input scope, extension handling, and preservation behavior; evaluate parser ecosystem and diagnostics. |
| **0.1.6.6 — Field → Markdown Round-Trip** | Preserve unchanged source wherever practical; avoid whole-file normalization and destructive writes; test unusual syntax and tables. |
| **0.1.6.7–0.1.6.8 — FieldDefinition** | Guided authoring must build on, not restrict, the document language; decide template-specific validation separately. |
| **0.1.6.9 — Integration Tests** | Test representative ordinary and foreign Markdown, nesting, tables, comments, inline preservation, and no-op round-trips. |

**Non-binding implementation research:** Researcher 2 recommends evaluating unified/remark/mdast for parsing and source-span-aware edits for preservation. Those are candidates for later issues, **not** approved implementation requirements under 0.1.6.1.

## 12. Change policy

This is the approved **Phase 0 baseline**, not a claim that every future Markdown requirement has already been anticipated. Amend it when a concrete incompatibility or new requirement is identified, and record the reason in the relevant GitHub issue or commit.

Changes must continue to respect Read Before Write, portable source files, and the rule that unsupported content is not silently disposable.

## References

- [CommonMark 0.31.2](https://spec.commonmark.org/0.31.2/)
- [GitHub Flavored Markdown specification](https://github.github.com/gfm/)
- Researcher 2, *Assignment 005 — Mahogany Markdown & Structured Document Architecture* (2026-10-12; research input, not itself an architectural decision).
