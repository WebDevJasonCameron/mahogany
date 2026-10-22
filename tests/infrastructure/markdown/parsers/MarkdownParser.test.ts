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

        expect(fields[0]?.data).toBe("# Lothar");
        expect(fields[1]?.data).toBe("Lothar is a **fighter**.");
    });
});