/**
 * collectBlockquotePrefixRanges.ts
 *
 * Identifies the source ranges occupied by Markdown Blockquote
 * prefixes using micromark's tokenizer.
 *
 * These ranges can be passed to extractAuthoredContent() to
 * exclude structural Blockquote syntax while preserving
 * authored Markdown content.
 *
 * This utility does not modify the original Markdown.
 */

import { parse, preprocess } from "micromark";

import type { SourceRange } from "./extractAuthoredContent";

export function collectBlockquotePrefixRanges(
    markdown: string
): SourceRange[] {
    const parser = parse();

    const events = parser.document().write(
        preprocess()(markdown, undefined, true)
    );

    const ranges: SourceRange[] = [];

    for (const [action, token] of events) {
        if (
            action !== "enter" ||
            token.type !== "blockQuotePrefix"
        ) {
            continue;
        }

        const start = token.start.offset;
        const end = token.end.offset;

        if (start === undefined || end === undefined) {
            throw new Error(
                "Blockquote prefix token is missing source offsets."
            );
        }

        ranges.push({ start, end });
    }

    return ranges.sort((a, b) => a.start - b.start);
}