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
    
});