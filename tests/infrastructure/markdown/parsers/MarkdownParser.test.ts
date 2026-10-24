import { describe, expect, it } from "vitest";

import { parseMarkdownFields } from "@/infrastructure/markdown/parsers/MarkdownParser";
import { FieldType } from "@/domain/documents/models/FieldType";

describe("MahoganyMarkdownParser", () => {
    it("parses a heading and paragraph in source order", () => {
        const markdown = [
            "# Lothar",
            "",
            "Lothar is a **fighter**.",
        ].join("\n");

        const fields = parseMarkdownFields(markdown);

        expect(fields).toHaveLength(2);

        expect(fields[0]?.structure).toBe(FieldType.Heading);
        expect(fields[1]?.structure).toBe(FieldType.Paragraph);

        expect(fields[0]?.data).toBe("Lothar");
        expect(fields[1]?.data).toBe("Lothar is a **fighter**.");
    });

    it("parses an ATX heading without structural markers", () => {
        const fields = parseMarkdownFields(
            "## The **Legend** of Lothar"
        );

        expect(fields).toHaveLength(1);
        expect(fields[0]).toEqual({
            structure: FieldType.Heading,
            structureDetails: {
                level: 2,
            },
            data: "The **Legend** of Lothar",
        });
    });

    it("parses a Setext heading without structural markers", () => {
        const fields = parseMarkdownFields(
            "Lothar the Brave\n----------------"
        );

        expect(fields).toHaveLength(1);
        expect(fields[0]).toEqual({
            structure: FieldType.Heading,
            structureDetails: {
                level: 2,
            },
            data: "Lothar the Brave",
        });
    });

    it.each(["---", "***", "___"])(
        "parses thematic break syntax %s",
        (markdown) => {
            const fields = parseMarkdownFields(markdown);

            expect(fields).toEqual([
                {
                    structure: FieldType.ThematicBreak,
                    structureDetails: {},
                    data: null,
                },
            ]);
        }
    );

    it("preserves field ordering around a thematic break", () => {
        const markdown = [
            "# Lothar",
            "",
            "Before the battle.",
            "",
            "---",
            "",
            "After the battle.",
        ].join("\n");

        const fields = parseMarkdownFields(markdown);

        expect(fields.map((field) => field.structure)).toEqual([
            FieldType.Heading,
            FieldType.Paragraph,
            FieldType.ThematicBreak,
            FieldType.Paragraph,
        ]);
    });

    it("preserves unsupported Markdown structures as OpaqueBlocks", () => {
        const markdown = [
            "- Sword",
            "- Shield",
            "- Armor",
        ].join("\n");

        const fields = parseMarkdownFields(markdown);

        expect(fields).toEqual([
            {
                structure: FieldType.OpaqueBlock,
                structureDetails: {},
                data: markdown,
            },
        ]);
    });

    it("preserves unsupported structures in document order", () => {
        const markdown = [
            "# Lothar",
            "",
            "A brave warrior.",
            "",
            "- Sword",
            "- Shield",
            "",
            "After the inventory.",
        ].join("\n");

        const fields = parseMarkdownFields(markdown);

        expect(fields.map((field) => field.structure)).toEqual([
            FieldType.Heading,
            FieldType.Paragraph,
            FieldType.OpaqueBlock,
            FieldType.Paragraph,
        ]);

        expect(fields[2]?.data).toBe("- Sword\n- Shield");
    });

    it("parses a fenced code block with a language", () => {
        const markdown = [
            "```typescript",
            'const name = "Lothar";',
            "```",
        ].join("\n");

        expect(parseMarkdownFields(markdown)).toEqual([
            {
                structure: FieldType.CodeBlock,
                structureDetails: {
                    style: "fenced",
                    info: "typescript",
                },
                data: 'const name = "Lothar";',
            },
        ]);
    });

    it("parses a fenced code block without a language", () => {
        const markdown = [
            "~~~",
            "A mysterious inscription.",
            "~~~",
        ].join("\n");

        expect(parseMarkdownFields(markdown)).toEqual([
            {
                structure: FieldType.CodeBlock,
                structureDetails: {
                    style: "fenced",
                    info: null,
                },
                data: "A mysterious inscription.",
            },
        ]);
    });

    it("parses an indented code block", () => {
        const markdown = [
            '    const name = "Lothar";',
            '    const level = 5;',
        ].join("\n");

        expect(parseMarkdownFields(markdown)).toEqual([
            {
                structure: FieldType.CodeBlock,
                structureDetails: {
                    style: "indented",
                    info: null,
                },
                data: [
                    'const name = "Lothar";',
                    "const level = 5;",
                ].join("\n"),
            },
        ]);
    });

    it("preserves ordering around code blocks", () => {
        const markdown = [
            "# Lothar",
            "",
            "An example spell:",
            "",
            "```",
            "castFireball();",
            "```",
            "",
            "The spell succeeds.",
        ].join("\n");

        const fields = parseMarkdownFields(markdown);

        expect(fields.map((field) => field.structure)).toEqual([
            FieldType.Heading,
            FieldType.Paragraph,
            FieldType.CodeBlock,
            FieldType.Paragraph,
        ]);
    });

    it("parses a blockquote containing a paragraph", () => {
        const markdown = "> Lothar approaches the gate.";

        expect(parseMarkdownFields(markdown)).toEqual([
            {
                structure: FieldType.Blockquote,
                structureDetails: {},
                data: [
                    {
                        structure: FieldType.Paragraph,
                        structureDetails: {},
                        data: "Lothar approaches the gate.",
                    },
                ],
            },
        ]);
    });

    it("parses nested blockquotes recursively", () => {
        const markdown = [
            "> Lothar approaches.",
            ">",
            "> > The guard whispers.",
        ].join("\n");

        const fields = parseMarkdownFields(markdown);

        expect(fields).toHaveLength(1);
        expect(fields[0]?.structure).toBe(FieldType.Blockquote);

        if (fields[0]?.structure !== FieldType.Blockquote) {
            throw new Error("Expected a Blockquote Field.");
        }

        expect(fields[0].data.map((field) => field.structure)).toEqual([
            FieldType.Paragraph,
            FieldType.Blockquote,
        ]);

        const nested = fields[0].data[1];

        expect(nested?.structure).toBe(FieldType.Blockquote);

        if (nested?.structure === FieldType.Blockquote) {
            expect(nested.data).toEqual([
                {
                    structure: FieldType.Paragraph,
                    structureDetails: {},
                    data: "The guard whispers.",
                },
            ]);
        }
    });

    it("preserves field order around a blockquote", () => {
        const markdown = [
            "Before the warning.",
            "",
            "> Beware the dragon.",
            "",
            "After the warning.",
        ].join("\n");

        const fields = parseMarkdownFields(markdown);

        expect(fields.map((field) => field.structure)).toEqual([
            FieldType.Paragraph,
            FieldType.Blockquote,
            FieldType.Paragraph,
        ]);
    });

    it("excludes blockquote markers from multiline paragraph content", () => {
        const markdown = [
            "> Lothar approaches the gate.",
            "> The guard raises his spear.",
        ].join("\n");

        expect(parseMarkdownFields(markdown)).toEqual([
            {
                structure: FieldType.Blockquote,
                structureDetails: {},
                data: [
                    {
                        structure: FieldType.Paragraph,
                        structureDetails: {},
                        data: [
                            "Lothar approaches the gate.",
                            "The guard raises his spear.",
                        ].join("\n"),
                    },
                ],
            },
        ]);
    });
    
});