import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import type { RootContent, PhrasingContent, Blockquote } from "mdast";

import { FieldType } from "@/domain/documents/models/FieldType";
import type { Field } from "@/domain/documents/models/Field";

const markdownProcessor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter, ["yaml"]);

export function parseMarkdownFields(markdown: string): Field[] {
    const tree = markdownProcessor.parse(markdown);

    return parseNodes(tree.children, markdown);
}

function parseNodes(
    nodes: readonly RootContent[],
    markdown: string,
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
                    data: markdown.slice(start, end),
                });

                break;
            }

            case "paragraph": {
                fields.push({
                    structure: FieldType.Paragraph,
                    structureDetails: {},
                    data: extractInlineContent(node.children, markdown),
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

            case "blockquote": {
                fields.push({
                    structure: FieldType.Blockquote,
                    structureDetails: {},
                    data: parseNodes(node.children, markdown),
                });

                break;
            }

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
                    data: markdown.slice(start, end),
                });

                break;
            }
        }
    }
    return fields;
}

function extractParagraphContent(
    markdown: string,
    start: number,
    end: number,
    blockquoteDepth: number,
): string {
    const source = markdown.slice(start, end);

    if (blockquoteDepth === 0) {
        return source;
    }

    return source
        .split(/\r\n|\n|\r/)
        .map((line, index) => {
            if (index === 0) {
                return line;
            }

            
            
            let content = line;

            for (let depth = 0; depth < blockquoteDepth; depth++) {
                const match = content.match(/^ {0,3}> ?/);

                if (!match) {
                    break;
                }

                content = content.slice(match[0].length);
            }

            return content;
        })
        .join("\n");
}

function extractInlineContent(
    nodes: readonly PhrasingContent[],
    markdown: string,
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

                    const source = markdown.slice(start, end);

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

                    return markdown.slice(start, end);
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

                    return markdown.slice(start, end);
                }

                default:
                    throw new Error(
                        `Unsupported inline Markdown node: ${node.type}`
                    );
            }
        })
        .join("");
}