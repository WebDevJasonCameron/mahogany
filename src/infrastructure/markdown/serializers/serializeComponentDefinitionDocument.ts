import { stringify } from "yaml";

import { ComponentDefinitionDocument } from "@/domain/components/models/ComponentDefinitionDocument";
import { validateComponentDefinition } from "@/domain/components/validations/validateComponentDefinition";

const COMPONENT_DEFINITION_VERSION = 1;

export function serializeComponentDefinitionDocument(
    document: ComponentDefinitionDocument
): string {
    const validationResult =
        validateComponentDefinition(document.definition);

    if (!validationResult.valid) {
        throw new Error(
            `Cannot serialize invalid Component Definition: ${validationResult.errors.join(" ")}`
        );
    }

    const frontmatter = {
        mahogany: {
            type: "component-definition",
            version: COMPONENT_DEFINITION_VERSION,
        },
        id: document.definition.id,
        name: document.definition.name,
        directory: document.definition.directory,
        fields: document.definition.fields,
    };

    const yaml = stringify(frontmatter).trimEnd();
    const body = document.body.trimStart();

    return [
        "---",
        yaml,
        "---",
        "",
        body,
    ].join("\n");
}