import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import type { RootContent, PhrasingContent, Blockquote } from "mdast";

import { FieldType } from "@/domain/documents/models/FieldType";
import type { Field } from "@/domain/documents/models/Field";
import { collectBlockquotePrefixRanges } from
        "@/infrastructure/markdown/utils/collectBlockquotePrefixRanges";
import { extractAuthoredContent } from
        "@/infrastructure/markdown/utils/extractAuthoredContent";
import type { SourceRange } from
        "@/infrastructure/markdown/utils/extractAuthoredContent";

const markdownProcessor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter, ["yaml"]);

export function parseMarkdownFields(markdown: string): Field[] {
    const tree = markdownProcessor.parse(markdown);

    const structuralRanges =
        collectBlockquotePrefixRanges(markdown);

    return parseNodes(tree.children, markdown, structuralRanges);
}

function parseNodes(
    nodes: RootContent[],
    markdown: string,
    structuralRanges: readonly SourceRange[],
): Field[] {
    const fields: Field[] = [];

    for (const node of nodes) {
        switch (node.type) {
            case "heading": {
                const firstChild = node.children[0];
                const lastChild = node.children[node.children.length - 1];

                const start = firstChild?.position?.start.offset;
                const end = lastChild?.position?.end.offset;

                if (start === undefined || end === undefined) {
                    throw new Error(
                        "Unable to determine heading content boundaries."
                    );
                }

                fields.push({
                    structure: FieldType.Heading,
                    structureDetails: {
                        level: node.depth,
                    },
                    data: extractAuthoredContent(
                        markdown,
                        start,
                        end,
                        structuralRanges
                    )
                });

                break;
            }

            case "paragraph": {
                fields.push({
                    structure: FieldType.Paragraph,
                    structureDetails: {},
                    data: extractInlineContent(
                        node.children,
                        markdown,
                        structuralRanges
                    ),
                });

                break;
            }

            case "thematicBreak": {
                fields.push({
                    structure: FieldType.ThematicBreak,
                    structureDetails: {},
                    data: null,
                });

                break;
            }

            case "code": {
                const sourceStart = node.position?.start.offset;
                const sourceEnd = node.position?.end.offset;

                if (sourceStart === undefined || sourceEnd === undefined) {
                    throw new Error(
                        "Unable to determine code block source boundaries."
                    );
                }

                const source = markdown.slice(sourceStart, sourceEnd);

                const isFenced = /^(?: {0,3})(?:`{3,}|~{3,})/.test(source);

                fields.push({
                    structure: FieldType.CodeBlock,
                    structureDetails: {
                        style: isFenced ? "fenced" : "indented",
                        info: node.lang ?? null,
                    },
                    data: node.value,
                });

                break;
            }

            case "blockquote":
                fields.push({
                    structure: FieldType.Blockquote,
                    structureDetails: {},
                    data: parseNodes(
                        node.children,
                        markdown,
                        structuralRanges
                    ),
                });
                break;

            default: {
                const start = node.position?.start.offset;
                const end = node.position?.end.offset;

                if (start === undefined || end === undefined) {
                    throw new Error(
                        `Unable to preserve unsupported Markdown node: ${node.type}`
                    );
                }

                fields.push({
                    structure: FieldType.OpaqueBlock,
                    structureDetails: {},
                    data: extractAuthoredContent(
                        markdown,
                        start,
                        end,
                        structuralRanges
                    )
                });

                break;
            }
        }
    }
    return fields;
}

function extractInlineContent(
    nodes: readonly PhrasingContent[],
    markdown: string,
    structuralRanges: readonly SourceRange[],
): string {
    return nodes
        .map((node) => {
            switch (node.type) {
                case "text": {
                    const start = node.position?.start.offset;
                    const end = node.position?.end.offset;

                    if (start === undefined || end === undefined) {
                        throw new Error(
                            "Unable to determine text node source boundaries."
                        );
                    }

                    const source = extractAuthoredContent(
                        markdown,
                        start,
                        end,
                        structuralRanges
                    )

                    // Preserve authored text when its source is contiguous.
                    // Multiline text inside containers requires additional handling.
                    if (!/[\r\n]/.test(source)) {
                        return source;
                    }

                    return node.value;
                }

                case "break": {
                    const start = node.position?.start.offset;
                    const end = node.position?.end.offset;

                    if (start === undefined || end === undefined) {
                        throw new Error(
                            "Unable to determine hard line break source boundaries."
                        );
                    }

                    return extractAuthoredContent(
                        markdown,
                        start,
                        end,
                        structuralRanges
                    )
                }

                case "emphasis":
                case "strong":
                case "delete":
                case "inlineCode":
                case "link":
                case "image": {
                    const start = node.position?.start.offset;
                    const end = node.position?.end.offset;

                    if (start === undefined || end === undefined) {
                        throw new Error(
                            `Unable to preserve inline Markdown node: ${node.type}`
                        );
                    }

                    return extractAuthoredContent(
                        markdown,
                        start,
                        end,
                        structuralRanges
                    )
                }

                default:
                    throw new Error(
                        `Unsupported inline Markdown node: ${node.type}`
                    );
            }
        })
        .join("");
}