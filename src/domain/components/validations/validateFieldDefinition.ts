/**
 * validateFieldDefinition
 *
 * Validates a single FieldDefinition against Mahogany's field-level
 * domain rules and returns all validation errors found.
 *
 * Field validation currently ensures that:
 *
 * - `key` is not blank.
 * - `key` begins with a letter and contains only letters and numbers.
 * - `label` is not blank.
 * - Enum fields contain at least one option.
 * - Enum options do not contain blank values.
 * - Enum options do not contain duplicate values.
 * - Non-Enum fields do not contain options.
 *
 * Enum options are trimmed when checking for blank or duplicate values.
 * This ensures values that differ only by surrounding whitespace are
 * treated as equivalent during validation. This check does not modify
 * the original options; actual cleanup of field data belongs to the
 * normalization layer.
 *
 * This validator is responsible only for rules belonging to an individual
 * FieldDefinition. Component-level concerns, such as duplicate field keys
 * within the same Component Definition, are handled by
 * `validateComponentDefinition`.
 *
 * Validation is non-mutating and collects all discovered errors rather
 * than stopping at the first failure.
 *
 * `FieldValidationResult.valid` is true only when no validation errors
 * were discovered.
 */

import { FieldDefinition } from "@/domain/components/models/FieldDefinition";
import { FieldType } from "@/domain/components/models/FieldType";

const FIELD_KEY_PATTERN = /^[A-Za-z][A-Za-z0-9]*$/;

export interface FieldValidationResult {
    valid: boolean;
    errors: string[];
}

export function validateFieldDefinition(
    field: FieldDefinition
): FieldValidationResult {
    const errors: string[] = [];

    if (!field.key.trim()) {
        errors.push("Field key is required.");
    }

    if (
        field.key.trim() &&
        !FIELD_KEY_PATTERN.test(field.key)
    ) {
        errors.push(
            `Field key "${field.key}" must begin with a letter and contain only letters and numbers.`
        );
    }

    if (!field.label.trim()) {
        errors.push("Field label is required.");
    }

    if (
        field.type === FieldType.Enum &&
        (!field.options || field.options.length === 0)
    ) {
        errors.push(
            `Enum field "${field.label}" must contain at least one option.`
        );
    }

    if (
        field.type === FieldType.Enum &&
        field.options
    ) {
        const normalizedOptions = field.options.map(
            option => option.trim()
        );

        if (normalizedOptions.some(option => !option)) {
            errors.push(
                `Enum field "${field.label}" cannot contain blank options.`
            );
        }

        const uniqueOptions = new Set(normalizedOptions);

        if (uniqueOptions.size !== normalizedOptions.length) {
            errors.push(
                `Enum field "${field.label}" cannot contain duplicate options.`
            );
        }
    }

    if (
        field.type !== FieldType.Enum &&
        field.options &&
        field.options.length > 0
    ) {
        errors.push(
            `Non-enum field "${field.label}" cannot contain options.`
        );
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}