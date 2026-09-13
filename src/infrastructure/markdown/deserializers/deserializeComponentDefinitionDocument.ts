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