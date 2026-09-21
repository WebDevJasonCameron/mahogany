import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { ComponentDefinitionDocument } from "@/domain/components/models/ComponentDefinitionDocument";
import { FieldType } from "@/domain/components/models/FieldType";
import { saveComponentDefinitionDocument } from "@/infrastructure/filesystem/component-definitions/saveComponentDefinitionDocument";
import {ComponentState} from "@/domain/components/models/ComponentState";

describe("saveComponentDefinitionDocument", () => {
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

    test("saves a Component Definition document to the workspace", async () => {
        const document: ComponentDefinitionDocument = {
            definition: {
                id: "character",
                name: "Character",
                state: ComponentState.Library,
                stateId: "core",
                categoryId: "characters",
                copyOf: "",
                fields: [
                    {
                        key: "name",
                        label: "Name",
                        type: FieldType.String,
                        required: true,
                    },
                ],
            },
            body: `# Character
`,
        };

        await saveComponentDefinitionDocument(
            workspaceRoot,
            document
        );

        const savedPath = join(
            workspaceRoot,
            ".mahogany",
            "definitions",
            "characters",
            "character.md"
        );

        const savedMarkdown =
            await readFile(savedPath, "utf8");

        expect(savedMarkdown).toContain(
            "type: component-definition"
        );

        expect(savedMarkdown).toContain(
            "id: character"
        );

        expect(savedMarkdown).toContain(
            "# Character"
        );
    });

    test("creates the Mahogany definitions directory when it does not exist", async () => {
        const document: ComponentDefinitionDocument = {
            definition: {
                id: "character",
                name: "Character",
                state: ComponentState.Library,
                stateId: "core",
                categoryId: "characters",
                copyOf: "",
                fields: [],
            },
            body: `# Character
`,
        };

        await saveComponentDefinitionDocument(
            workspaceRoot,
            document
        );

        const savedPath = join(
            workspaceRoot,
            ".mahogany",
            "definitions",
            "characters",
            "character.md"
        );

        const savedMarkdown =
            await readFile(savedPath, "utf8");

        expect(savedMarkdown).toContain(
            "id: character"
        );
    });
});