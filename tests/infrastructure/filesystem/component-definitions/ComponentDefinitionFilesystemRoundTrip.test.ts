import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { ComponentDefinitionDocument } from "@/domain/components/models/ComponentDefinitionDocument";
import { FieldType } from "@/domain/components/models/FieldType";
import { loadComponentDefinitionDocument } from "@/infrastructure/filesystem/component-definitions/loadComponentDefinitionDocument";
import { saveComponentDefinitionDocument } from "@/infrastructure/filesystem/component-definitions/saveComponentDefinitionDocument";

describe("Component Definition filesystem round trip", () => {
    let workspaceRoot: string;

    beforeEach(async () => {
        workspaceRoot = await mkdtemp(
            join(tmpdir(), "mahogany-test-")
        );
    });

    afterEach(async () => {
        await rm(workspaceRoot, {
            recursive: true,
            force: true,
        });
    });

    test("saves and reloads a Component Definition document", async () => {
        const original: ComponentDefinitionDocument = {
            definition: {
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
                    {
                        key: "characterType",
                        label: "Character Type",
                        type: FieldType.Enum,
                        required: true,
                        options: ["PC", "NPC"],
                    },
                ],
            },
            body: `# Character

Characters represent people or creatures within the game world.

## Notes

This text should survive being written to disk and loaded again.
`,
        };

        await saveComponentDefinitionDocument(
            workspaceRoot,
            original
        );

        const restored =
            await loadComponentDefinitionDocument(
                workspaceRoot,
                "characters",
                original.definition.id
            );

        expect(restored).toEqual(original);
    });
});