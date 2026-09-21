import { describe, expect, test } from "vitest";

import { ComponentDefinition } from "@/domain/components/models/ComponentDefinition";
import { ComponentDefinitionDocument } from "@/domain/components/models/ComponentDefinitionDocument";
import { FieldType } from "@/domain/components/models/FieldType";
import { serializeComponentDefinitionDocument } from "@/infrastructure/markdown/serializers/serializeComponentDefinitionDocument";
import {ComponentState} from "@/domain/components/models/ComponentState";

describe("serializeComponentDefinitionDocument", () => {
    test("serializes a Character Component Definition Document to Markdown", () => {
        const definition: ComponentDefinition = {
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
                {
                    key: "characterType",
                    label: "Character Type",
                    type: FieldType.Enum,
                    required: true,
                    options: ["PC", "NPC"],
                },
            ],
        };

        const document: ComponentDefinitionDocument = {
            definition,
            body: `# Character
`,
        };

        const markdown =
            serializeComponentDefinitionDocument(document);

        expect(markdown).toBe(
            `---
mahogany:
  type: component-definition
  version: 1
id: character
name: Character
state: library
stateId: core
categoryId: characters
copyOf: ""
fields:
  - key: name
    label: Name
    type: string
    required: true
  - key: characterType
    label: Character Type
    type: enum
    required: true
    options:
      - PC
      - NPC
---

# Character
`
        );
    });

    test("refuses to serialize an invalid Component Definition", () => {
        const definition: ComponentDefinition = {
            id: "character",
            name: "",
            state: ComponentState.Library,
            stateId: "core",
            categoryId: "characters",
            copyOf: "",
            fields: [],
        };

        const document: ComponentDefinitionDocument = {
            definition,
            body: `# Character
`,
        };

        expect(() => {
            serializeComponentDefinitionDocument(document);
        }).toThrow("Cannot serialize invalid Component Definition");
    });
});