import { describe, expect, test } from "vitest";

import { createComponentDefinition } from "@/domain/components/factories/createComponentDefinition";
import { ComponentDefinitionDocument } from "@/domain/components/models/ComponentDefinitionDocument";
import { FieldType } from "@/domain/components/models/FieldType";
import { deserializeComponentDefinitionDocument } from "@/infrastructure/markdown/deserializers/deserializeComponentDefinitionDocument";
import { serializeComponentDefinitionDocument } from "@/infrastructure/markdown/serializers/serializeComponentDefinitionDocument";

describe("Component Definition Markdown round trip", () => {
    test("preserves the definition and Markdown body", () => {
        const definition = createComponentDefinition(
            "Character",
            "Characters",
            [
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
            ]
        );

        const original: ComponentDefinitionDocument = {
            definition,
            body: `# Character

Characters represent people or creatures within the game world.

## Notes

This text was written manually by the user.
`,
        };

        const markdown =
            serializeComponentDefinitionDocument(original);

        const restored =
            deserializeComponentDefinitionDocument(markdown);

        expect(restored.definition).toEqual(original.definition);
        expect(restored.body).toBe(original.body);
    });

    test("preserves manually edited Markdown body content", () => {
        const markdown = `---
mahogany:
  type: component-definition
  version: 1
id: character
name: Character
directory: Characters
fields: []
---

# Character

This paragraph was manually edited.

- Custom note
- Another note

## Design Notes

Do not erase this content.
`;

        const document =
            deserializeComponentDefinitionDocument(markdown);

        expect(document.body).toBe(`# Character

This paragraph was manually edited.

- Custom note
- Another note

## Design Notes

Do not erase this content.
`);
    });
});