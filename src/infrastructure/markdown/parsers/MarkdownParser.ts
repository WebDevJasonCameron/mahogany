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
            case "heading":
                fields.push({
                    structure: FieldType.Heading,
                    structureDetails: {
                        level: node.depth,
                    },
                    data: markdown.slice(
                        node.position!.start.offset!,
                        node.position!.end.offset!,
                    ),
                });
                break;

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
        }
    }

    return fields;
}