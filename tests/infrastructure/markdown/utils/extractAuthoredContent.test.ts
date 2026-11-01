
import { describe, expect, it } from "vitest";

import {
    extractAuthoredContent,
} from "@/infrastructure/markdown/utils/extractAuthoredContent";

describe("extractAuthoredContent", () => {
    it("removes structural prefixes while preserving authored syntax", () => {
        const markdown = [
            "> Lothar is **very",
            "> strong** indeed.",
        ].join("\n");

        const result = extractAuthoredContent(
            markdown,
            2,
            markdown.length,
            [
                { start: 0, end: 2 },
                { start: 19, end: 21 },
            ],
        );

        expect(result).toBe(
            "Lothar is **very\nstrong** indeed."
        );
    });

    it("preserves literal greater-than characters", () => {
        const markdown = "> Lothar's strength is > 18.";

        const result = extractAuthoredContent(
            markdown,
            2,
            markdown.length,
            [{ start: 0, end: 2 }],
        );

        expect(result).toBe("Lothar's strength is > 18.");
    });

    it("preserves escaped Markdown characters", () => {
        const markdown = String.raw`\*Lothar\*`;

        const result = extractAuthoredContent(
            markdown,
            0,
            markdown.length,
            [],
        );

        expect(result).toBe(markdown);
    });
});