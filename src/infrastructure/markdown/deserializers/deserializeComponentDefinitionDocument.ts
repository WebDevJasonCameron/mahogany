/**
 * deserializeComponentDefinitionDocument
 *
 * Converts a Component Definition Markdown document into Mahogany's
 * in-memory ComponentDefinitionDocument representation.
 *
 * Deserialization treats Markdown/YAML files as external input and does
 * not assume that their contents are valid simply because Mahogany can
 * parse them. A document must pass several checks before it is accepted
 * as a Component Definition.
 *
 * The deserialization process:
 *
 * - Separates YAML frontmatter from the Markdown body.
 * - Parses the YAML frontmatter into structured data.
 * - Validates Mahogany document metadata.
 * - Confirms the document is a "component-definition".
 * - Confirms the document version is supported.
 * - Validates the expected Component Definition frontmatter structure.
 * - Constructs a ComponentDefinition from the validated frontmatter.
 * - Applies Mahogany's domain validation rules to the resulting definition.
 * - Returns the validated definition together with the preserved Markdown
 *   body as a ComponentDefinitionDocument.
 *
 * Metadata validation is performed separately from the full frontmatter
 * schema so Mahogany can identify the document type and version before
 * attempting to interpret the document-specific structure.
 *
 * The Markdown body is preserved separately from the structured definition
 * data. This allows Mahogany to work with YAML-backed schema information
 * while retaining the human-readable Markdown content of the document.
 *
 * Invalid, malformed, incorrectly typed, unsupported, or domain-invalid
 * documents are rejected by throwing an Error rather than returning a
 * partially trusted ComponentDefinitionDocument.
 *
 * This function performs Markdown deserialization and coordinates
 * validation. It does not read files from the filesystem; filesystem
 * loading is handled separately by `loadComponentDefinitionDocument`.
 */

import { parse } from "yaml";

import { ComponentDefinition } from "@/domain/components/models/ComponentDefinition";
import { ComponentDefinitionDocument } from "@/domain/components/models/ComponentDefinitionDocument";
import { validateComponentDefinition } from "@/domain/components/validations/validateComponentDefinition";
import {
    ComponentDefinitionFrontmatterSchema,
    MahoganyMetadataSchema,
} from "@/infrastructure/markdown/schemas/ComponentDefinitionFrontmatterSchema";

const FRONTMATTER_PATTERN =
    /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n)?([\s\S]*)$/;

export function deserializeComponentDefinitionDocument(
    markdown: string
): ComponentDefinitionDocument {
    const match = markdown.match(FRONTMATTER_PATTERN);

    if (!match) {
        throw new Error(
            "Cannot deserialize Component Definition: Markdown frontmatter is missing."
        );
    }

    const frontmatterText = match[1];
    const body = match[2];

    const parsedYaml = parse(frontmatterText);

    const metadataResult =
        MahoganyMetadataSchema.safeParse(parsedYaml);

    if (!metadataResult.success) {
        throw new Error(
            "Cannot deserialize Component Definition: Invalid Mahogany metadata."
        );
    }

    if (
        metadataResult.data.mahogany.type !==
        "component-definition"
    ) {
        throw new Error(
            "Cannot deserialize Component Definition: Invalid Mahogany document type."
        );
    }

    if (metadataResult.data.mahogany.version !== 1) {
        throw new Error(
            `Cannot deserialize Component Definition: Unsupported version "${metadataResult.data.mahogany.version}".`
        );
    }

    const schemaResult =
        ComponentDefinitionFrontmatterSchema.safeParse(parsedYaml);

    if (!schemaResult.success) {
        throw new Error(
            "Cannot deserialize Component Definition: Invalid frontmatter structure."
        );
    }

    const frontmatter = schemaResult.data;

    const definition: ComponentDefinition = {
        id: frontmatter.id,
        name: frontmatter.name,
        categoryId: frontmatter.categoryId,
        directory: frontmatter.directory,
        copy: frontmatter.copy,
        copyOf: frontmatter.copyOf,
        fields: frontmatter.fields,
    };

    const validationResult =
        validateComponentDefinition(definition);

    if (!validationResult.valid) {
        throw new Error(
            `Cannot deserialize invalid Component Definition: ${validationResult.errors.join(" ")}`
        );
    }

    return {
        definition,
        body,
    };
}