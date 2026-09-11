import { ComponentDefinition } from "@/domain/components/models/ComponentDefinition";
import { FieldDefinition } from "@/domain/components/models/FieldDefinition";

export function createComponentDefinition(
    name: string,
    directory: string,
    fields: FieldDefinition[] = []
): ComponentDefinition {
    return {
        id: createComponentId(name),
        name: name.trim(),
        directory: directory.trim(),
        fields,
    };
}

function createComponentId(name: string): string {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}