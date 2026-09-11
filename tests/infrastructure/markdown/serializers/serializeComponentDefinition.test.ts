import { describe, expect, test } from "vitest";

import { ComponentDefinition } from "@/domain/components/models/ComponentDefinition";
import { FieldType } from "@/domain/components/models/FieldType";
import { serializeComponentDefinition } from "@/infrastructure/markdown/serializers/serializeComponentDefinition";

describe("serializeComponentDefinition", () => {
    test("serializes a Character Component Definition to Markdown", () => {
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

        const markdown = serializeComponentDefinition(definition);

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

        expect(() => {
            serializeComponentDefinition(definition);
        }).toThrow("Cannot serialize invalid Component Definition");
    });
});