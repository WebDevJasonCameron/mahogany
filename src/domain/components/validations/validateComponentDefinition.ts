/**
 * validateComponentDefinition
 *
 * Validates a ComponentDefinition against Mahogany's domain rules and
 * returns all validation errors found in the definition.
 *
 * Component-level validation currently ensures that:
 *
 * - `name` is not blank.
 * - `directory` is not blank.
 * - `directory` contains only filesystem-safe characters currently
 *   supported by Mahogany.
 * - `categoryId` is not blank and follows Mahogany's category ID format.
 * - Field keys are unique within the Component Definition.
 * - Every FieldDefinition satisfies its own validation rules.
 *
 * Category IDs use lowercase alphanumeric words separated by hyphens.
 * This validates the structure of a category ID, but does not determine
 * whether that ID exists in the Component Definition Category Registry.
 * Registry membership is a separate concern.
 *
 * Field-specific validation is delegated to `validateFieldDefinition`
 * rather than duplicated here. Any errors returned by the field validator
 * are collected with the Component Definition's other validation errors.
 *
 * Validation is non-mutating and collects all discovered errors rather
 * than stopping at the first failure. Callers can therefore present the
 * user with the complete set of problems that must be corrected.
 *
 * `ValidationResult.valid` is true only when no validation errors were
 * discovered.
 */

import { ComponentDefinition } from "@/domain/components/models/ComponentDefinition";
import { validateFieldDefinition } from "@/domain/components/validations/validateFieldDefinition";

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

const DIRECTORY_PATTERN = /^[A-Za-z0-9 _-]+$/;
const CATEGORY_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

    if (!definition.categoryId.trim()) {
        errors.push(
            "Component Definition category ID cannot be blank."
        );
    } else if (
        !CATEGORY_ID_PATTERN.test(
            definition.categoryId
        )
    ) {
        errors.push(
            "Component Definition category ID is invalid."
        );
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