import { stringify } from "yaml";

import { ComponentDefinition } from "@/domain/components/models/ComponentDefinition";
import { validateComponentDefinition } from "@/domain/components/validations/validateComponentDefinition";

const COMPONENT_DEFINITION_VERSION = 1;

export function serializeComponentDefinition(
    definition: ComponentDefinition
): string {
    const validationResult = validateComponentDefinition(definition);

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
        id: definition.id,
        name: definition.name,
        directory: definition.directory,
        fields: definition.fields,
    };

    const yaml = stringify(frontmatter);

    return [
        "---",
        yaml.trimEnd(),
        "---",
        "",
        `# ${definition.name}`,
        "",
    ].join("\n");
}