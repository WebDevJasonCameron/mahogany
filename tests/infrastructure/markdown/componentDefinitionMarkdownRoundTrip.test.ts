import { describe, expect, test } from "vitest";

import { createComponentDefinition } from "@/domain/components/factories/createComponentDefinition";
import { ComponentDefinitionDocument } from "@/domain/components/models/ComponentDefinitionDocument";
import { FieldType } from "@/domain/components/models/FieldType";
import { deserializeComponentDefinitionDocument } from "@/infrastructure/markdown/deserializers/deserializeComponentDefinitionDocument";
import { serializeComponentDefinitionDocument } from "@/infrastructure/markdown/serializers/serializeComponentDefinitionDocument";
import {ComponentState} from "@/domain/components/models/ComponentState";
import {copyComponentDefinition} from "@/domain/components/factories/copyComponentDefinition";

describe("Component Definition Markdown round trip", () => {
    test("preserves the definition and Markdown body", () => {
        const definition = createComponentDefinition(
            "Character",
            ComponentState.Library,
            "core",
            "character",
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

        expect(restored.definition.id).toBe(original.definition.id);
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
state: library
stateId: core
categoryId: character
copyOf: null
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

    test("preserves state and state ID through Markdown round trip", () => {
        const definition = createComponentDefinition(
            "Character",
            ComponentState.InPlay,
            "ravenloft-saturday",
            "character",
        );

        const original: ComponentDefinitionDocument = {
            definition,
            body: "# Character\n",
        };

        const markdown =
            serializeComponentDefinitionDocument(original);

        const restored =
            deserializeComponentDefinitionDocument(markdown);

        expect(restored.definition.state).toBe(
            ComponentState.InPlay
        );

        expect(restored.definition.stateId).toBe(
            "ravenloft-saturday"
        );
    });

    test("preserves copyOf lineage through Markdown round trip", () => {
        const source = createComponentDefinition(
            "Character",
            ComponentState.Library,
            "core",
            "character"
        );

        const copy = copyComponentDefinition(
            source,
            ComponentState.Package,
            "ravenloft"
        );

        const original: ComponentDefinitionDocument = {
            definition: copy,
            body: "# Character\n",
        };

        const markdown = serializeComponentDefinitionDocument(original);
        const restored = deserializeComponentDefinitionDocument(markdown);

        expect(restored.definition.id).toBe(copy.id);
        expect(restored.definition.copyOf).toBe(source.id);
    });
});