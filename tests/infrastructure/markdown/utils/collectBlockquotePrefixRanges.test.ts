/**
 * collectBlockquotePrefixRanges.test.ts
 *
 * Verifies that structural Blockquote prefixes are identified
 * by their original source positions.
 */

import { describe, expect, it } from "vitest";

import {
    collectBlockquotePrefixRanges,
} from "@/infrastructure/markdown/utils/collectBlockquotePrefixRanges";

describe("collectBlockquotePrefixRanges", () => {
    it("collects prefixes from multiline blockquotes", () => {
        const markdown = [
            "> Lothar is **very",
            "> strong** indeed.",
        ].join("\n");

        expect(collectBlockquotePrefixRanges(markdown)).toEqual([
            { start: 0, end: 2 },
            { start: 19, end: 21 },
        ]);
    });

    it("collects prefixes from nested blockquotes", () => {
        const markdown = [
            "> > Lothar approaches.",
            "> > The guard responds.",
        ].join("\n");

        const ranges = collectBlockquotePrefixRanges(markdown);

        expect(ranges.map(({ start, end }) =>
            markdown.slice(start, end)
        )).toEqual([
            "> ",
            "> ",
            "> ",
            "> ",
        ]);
    });

    it("does not treat literal greater-than characters as prefixes", () => {
        const markdown = [
            "> Lothar's strength is > 18.",
            "> His defense is > 15.",
        ].join("\n");

        const ranges = collectBlockquotePrefixRanges(markdown);

        expect(ranges).toHaveLength(2);

        expect(ranges.map(({ start, end }) =>
            markdown.slice(start, end)
        )).toEqual(["> ", "> "]);
    });

    it("does not invent prefixes for lazy continuation lines", () => {
        const markdown = [
            "> Lothar approaches.",
            "The guard responds.",
        ].join("\n");

        const ranges = collectBlockquotePrefixRanges(markdown);

        expect(ranges).toEqual([
            { start: 0, end: 2 },
        ]);
    });

    it("returns no ranges for ordinary paragraphs", () => {
        const markdown = "Lothar is **very strong**.";

        expect(collectBlockquotePrefixRanges(markdown)).toEqual([]);
    });
});