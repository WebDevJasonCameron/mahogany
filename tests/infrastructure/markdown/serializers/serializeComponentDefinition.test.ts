import { describe, expect, test } from "vitest";

import { ComponentDefinition } from "@/domain/components/models/ComponentDefinition";
import { ComponentDefinitionDocument } from "@/domain/components/models/ComponentDefinitionDocument";
import { FieldType } from "@/domain/components/models/FieldType";
import { serializeComponentDefinitionDocument } from "@/infrastructure/markdown/serializers/serializeComponentDefinitionDocument";

describe("serializeComponentDefinitionDocument", () => {
    test("serializes a Character Component Definition Document to Markdown", () => {
        const definition: ComponentDefinition = {
            id: "character",
            name: "Character",
            directory: "Characters",
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
directory: Characters
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
            directory: "Characters",
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