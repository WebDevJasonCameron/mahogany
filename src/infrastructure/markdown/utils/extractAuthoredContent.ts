/**
 * extractAuthoredContent.ts
 *
 * Extracts original Markdown source content while excluding
 * explicitly identified structural syntax ranges.
 *
 * Structural ranges must come from a Markdown-aware parser.
 *
 * This utility does not parse Markdown or normalize authored syntax.
 */

export interface SourceRange {
    start: number;
    end: number;
}

export function extractAuthoredContent(
    markdown: string,
    startOffset: number,
    endOffset: number,
    structuralRanges: readonly SourceRange[],
): string {
    if (
        startOffset < 0 ||
        endOffset > markdown.length ||
        startOffset > endOffset
    ) {
        throw new Error("Invalid Markdown source boundaries.");
    }

    const ranges = structuralRanges
        .filter(
            (range) =>
                range.end > startOffset &&
                range.start < endOffset
        )
        .map((range) => ({
            start: Math.max(range.start, startOffset),
            end: Math.min(range.end, endOffset),
        }))
        .sort((a, b) => a.start - b.start);

    let result = "";
    let cursor = startOffset;

    for (const range of ranges) {
        if (range.start < cursor) {
            throw new Error("Overlapping Markdown structural ranges.");
        }

        result += markdown.slice(cursor, range.start);
        cursor = range.end;
    }

    result += markdown.slice(cursor, endOffset);

    return result;
}