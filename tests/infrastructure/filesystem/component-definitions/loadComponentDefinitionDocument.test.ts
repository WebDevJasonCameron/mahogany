import { afterEach, beforeEach, describe, expect, test } from "vitest";
import {
    mkdir,
    mkdtemp,
    rm,
    writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { FieldType } from "@/domain/components/models/FieldType";
import { loadComponentDefinitionDocument } from "@/infrastructure/filesystem/component-definitions/loadComponentDefinitionDocument";

describe("loadComponentDefinitionDocument", () => {
    let workspaceRoot: string;

    beforeEach(async () => {
        workspaceRoot = await mkdtemp(
            join(tmpdir(), "mahogany-test-")
        );

        await mkdir(
            join(
                workspaceRoot,
                ".mahogany",
                "definitions",
                "characters"
            ),
            {
                recursive: true,
            }
        );
    });

    afterEach(async () => {
        await rm(workspaceRoot, {
            recursive: true,
            force: true,
        });
    });

    test("loads a Component Definition document from the workspace", async () => {
        const markdown = `---
mahogany:
  type: component-definition
  version: 1
id: character
name: Character
categoryId: characters
directory: Characters
copy: false
copyOf: ""
fields:
  - key: name
    label: Name
    type: string
    required: true
---

# Character
`;

        const filePath = join(
            workspaceRoot,
            ".mahogany",
            "definitions",
            "characters",
            "character.md"
        );

        await writeFile(
            filePath,
            markdown,
            "utf8"
        );

        const document =
            await loadComponentDefinitionDocument(
                workspaceRoot,
                "characters",
                "character"
            );

        expect(document.definition).toEqual({
            id: "character",
            name: "Character",
            categoryId: "characters",
            directory: "Characters",
            copy: false,
            copyOf: "",
            fields: [
                {
                    key: "name",
                    label: "Name",
                    type: FieldType.String,
                    required: true,
                },
            ],
        });

        expect(document.body).toBe(`# Character
`);
    });

    test("fails when the Component Definition file does not exist", async () => {
        await expect(
            loadComponentDefinitionDocument(
                workspaceRoot,
                "characters",
                "missing"
            )
        ).rejects.toThrow();
    });
});