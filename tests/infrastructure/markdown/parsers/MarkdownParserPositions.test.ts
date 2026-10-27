import { describe, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";

describe("Markdown source position investigation", () => {
    it("inspects nested blockquote positions", () => {
        const markdown = [
            "> > Lothar is __strong__.",
            "> > His strength is > 18.",
        ].join("\n");

        const tree = unified()
            .use(remarkParse)
            .use(remarkGfm)
            .parse(markdown);

        console.dir(tree, { depth: null });
    });
});