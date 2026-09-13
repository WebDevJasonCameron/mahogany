import { describe, expect, test } from "vitest";

import { FieldType } from "@/domain/components/models/FieldType";
import { deserializeComponentDefinitionDocument } from "@/infrastructure/markdown/deserializers/deserializeComponentDefinitionDocument";

describe("deserializeComponentDefinition", () => {
    test("deserializes Markdown into a Component Definition", () => {
        const markdown = `---
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
`;

        const document =
            deserializeComponentDefinitionDocument(markdown);

        expect(document.definition).toEqual({
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
        });

        expect(document.body).toBe(`# Character
`);
    });

    test("rejects Markdown without frontmatter", () => {
        const markdown = `# Character`;

        expect(() => {
            deserializeComponentDefinitionDocument(markdown);
        }).toThrow(
            "Cannot deserialize Component Definition: Markdown frontmatter is missing."
        );
    });

    test("rejects the wrong Mahogany document type", () => {
        const markdown = `---
mahogany:
  type: component
  version: 1
id: character
name: Character
directory: Characters
fields: []
---
`;

        expect(() => {
            deserializeComponentDefinitionDocument(markdown);
        }).toThrow(
            "Cannot deserialize Component Definition: Invalid Mahogany document type."
        );
    });

    test("rejects the wrong Mahogany document type", () => {
        const markdown = `---
mahogany:
  type: component
  version: 1
id: character
name: Character
directory: Characters
fields: []
---
`;

        expect(() => {
            deserializeComponentDefinitionDocument(markdown);
        }).toThrow(
            "Cannot deserialize Component Definition: Invalid Mahogany document type."
        );
    });

    test("rejects an unsupported Component Definition version", () => {
        const markdown = `---
mahogany:
  type: component-definition
  version: 99
id: character
name: Character
directory: Characters
fields: []
---
`;

        expect(() => {
            deserializeComponentDefinitionDocument(markdown);
        }).toThrow(
            'Cannot deserialize Component Definition: Unsupported version "99".'
        );
    });

    test("rejects a Component Definition that violates domain rules", () => {
        const markdown = `---
mahogany:
  type: component-definition
  version: 1
id: character
name: ""
directory: Characters
fields: []
---
`;

        expect(() => {
            deserializeComponentDefinitionDocument(markdown);
        }).toThrow(
            "Cannot deserialize invalid Component Definition"
        );
    });
});