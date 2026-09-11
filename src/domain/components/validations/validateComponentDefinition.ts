import { ComponentDefinition } from "@/domain/components/models/ComponentDefinition";
import { validateFieldDefinition } from "@/domain/components/validations/validateFieldDefinition";

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

const DIRECTORY_PATTERN = /^[A-Za-z0-9 _-]+$/;

export function validateComponentDefinition(
    definition: ComponentDefinition
): ValidationResult {
    const errors: string[] = [];

    if (!definition.name.trim()) {
        errors.push("Component name is required.");
    }

    if (
        definition.directory.trim() &&
        !DIRECTORY_PATTERN.test(definition.directory)
    ) {
        errors.push(
            `Component directory "${definition.directory}" contains invalid characters.`
        );
    }

    if (!definition.directory.trim()) {
        errors.push("Component directory is required.");
    }

    const seenKeys = new Set<string>();

    for (const field of definition.fields) {
        if (seenKeys.has(field.key)) {
            errors.push(`Duplicate field key: ${field.key}`);
        }

        seenKeys.add(field.key);

        const fieldResult = validateFieldDefinition(field);

        errors.push(...fieldResult.errors);
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}