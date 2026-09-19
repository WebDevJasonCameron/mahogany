/**
 * serializeComponentDefinitionDocument
 *
 * Converts an in-memory ComponentDefinitionDocument into the Markdown
 * format used to persist Component Definitions in a Mahogany workspace.
 *
 * Before serialization, the ComponentDefinition is validated against
 * Mahogany's domain rules. Invalid definitions are rejected rather than
 * being written into Mahogany's source-of-truth Markdown files.
 *
 * The serialization process:
 *
 * - Validates the ComponentDefinition.
 * - Builds the versioned YAML frontmatter representation.
 * - Includes definition identity, category, directory, copy/origin
 *   metadata, and field schema.
 * - Serializes the frontmatter to YAML.
 * - Preserves the document's Markdown body.
 * - Combines the YAML frontmatter and Markdown body into a complete
 *   Markdown document.
 *
 * `COMPONENT_DEFINITION_VERSION` identifies the persisted format version
 * written by this serializer. Changes to the stored document contract that
 * are not backward compatible may require introducing a newer version and
 * corresponding deserialization/migration behavior.
 *
 * `copy` and `copyOf` are persisted so a copied Component Definition retains
 * information about the definition from which it originated across save
 * and load operations.
 *
 * This function performs serialization only. It does not determine the
 * document's filesystem path or write files to disk; filesystem persistence
 * is handled separately by `saveComponentDefinitionDocument`.
 */

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
        state: document.definition.state,
        stateId: document.definition.stateId,
        categoryId: document.definition.categoryId,
        copyOf: document.definition.copyOf,
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