import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import type { RootContent, Blockquote } from "mdast";

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
    blockquotes: readonly Blockquote[] = [],
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
                const firstChild = node.children[0];
                const lastChild = node.children[node.children.length - 1];

                const start = firstChild?.position?.start.offset;
                const end = lastChild?.position?.end.offset;

                if (start === undefined || end === undefined) {
                    throw new Error(
                        "Unable to determine paragraph content boundaries."
                    );
                }

                fields.push({
                    structure: FieldType.Paragraph,
                    structureDetails: {},
                    data: extractParagraphContent(
                        markdown,
                        start,
                        end,
                        blockquotes.length,
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

            case "blockquote": {
                fields.push({
                    structure: FieldType.Blockquote,
                    structureDetails: {},
                    data: parseNodes(
                        node.children,
                        markdown,
                        [...blockquotes, node],
                    ),
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