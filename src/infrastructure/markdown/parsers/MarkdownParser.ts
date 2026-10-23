import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";

import { FieldType } from "@/domain/documents/models/FieldType";
import type { Field } from "@/domain/documents/models/Field";

const markdownProcessor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter, ["yaml"]);

export function parseMarkdownFields(markdown: string): Field[] {
    const tree = markdownProcessor.parse(markdown);
    const fields: Field[] = [];

    for (const node of tree.children) {
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

            case "paragraph":
                fields.push({
                    structure: FieldType.Paragraph,
                    structureDetails: {},
                    data: markdown.slice(
                        node.position!.start.offset!,
                        node.position!.end.offset!,
                    ),
                });
                break;

            case "thematicBreak": {
                fields.push({
                    structure: FieldType.ThematicBreak,
                    structureDetails: {},
                    data: null,
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