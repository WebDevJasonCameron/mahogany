/**
 * MarkdownParserTokens.test.ts
 *
 * Diagnostic investigation of micromark token events.
 *
 * Purpose:
 * Determine whether micromark exposes source positions for
 * structural Markdown syntax, particularly Blockquote prefixes.
 *
 * This test does not validate Mahogany's production parser.
 */

import { describe, expect, it } from "vitest";

import { parse, preprocess } from "micromark";

describe("Markdown token investigation", () => {
    it("inspects multiline blockquote token events", () => {
        const markdown = [
            "> Lothar is **very",
            "> strong** indeed.",
        ].join("\n");

        const parser = parse();

        const events = parser.document().write(
            preprocess()(markdown, undefined, true)
        );

        const tokens = events.map(([action, token]) => ({
            action,
            type: token.type,
            start: {
                line: token.start.line,
                column: token.start.column,
                offset: token.start.offset,
            },
            end: token.end
                ? {
                    line: token.end.line,
                    column: token.end.column,
                    offset: token.end.offset,
                }
                : null,
        }));

        console.dir(tokens, { depth: null });

        expect(tokens.length).toBeGreaterThan(0);
    });
});