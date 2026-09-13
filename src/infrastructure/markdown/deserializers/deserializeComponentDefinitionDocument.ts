import { parse } from "yaml";

import { ComponentDefinition } from "@/domain/components/models/ComponentDefinition";
import { ComponentDefinitionDocument } from "@/domain/components/models/ComponentDefinitionDocument";
import { validateComponentDefinition } from "@/domain/components/validations/validateComponentDefinition";

interface ComponentDefinitionFrontmatter {
    mahogany?: {
        type?: string;
        version?: number;
    };

    id?: string;
    name?: string;
    directory?: string;
    fields?: ComponentDefinition["fields"];
}

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

    const frontmatter =
        parse(frontmatterText) as ComponentDefinitionFrontmatter;

    if (frontmatter.mahogany?.type !== "component-definition") {
        throw new Error(
            "Cannot deserialize Component Definition: Invalid Mahogany document type."
        );
    }

    if (frontmatter.mahogany?.version !== 1) {
        throw new Error(
            `Cannot deserialize Component Definition: Unsupported version "${frontmatter.mahogany?.version}".`
        );
    }

    const definition: ComponentDefinition = {
        id: frontmatter.id ?? "",
        name: frontmatter.name ?? "",
        directory: frontmatter.directory ?? "",
        fields: frontmatter.fields ?? [],
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