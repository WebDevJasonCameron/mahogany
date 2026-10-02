/**
 * validateComponentDefinition
 *
 * Validates a ComponentDefinition against Mahogany's domain rules and
 * returns all validation errors found in the definition.
 *
 * Component-level validation currently ensures that:
 *
 * - `name` is not blank.
 * - `stateId` is not blank and contains only characters currently
 *   supported by Mahogany.
 * - `categoryId` is not blank and follows Mahogany's category ID format.
 * - `categoryId` identifies a category registered in the
 *   Component Definition Category Registry.
 * - Field keys are unique within the Component Definition.
 * - Every FieldDefinition satisfies its own validation rules.
 *
 * Category IDs are stable machine-readable identifiers using lowercase
 * alphanumeric words separated by hyphens. A syntactically valid category
 * ID is not necessarily a valid Mahogany category; it must also resolve
 * through the Component Definition Category Registry.
 *
 * Category membership is intentionally validated through the registry
 * rather than against a hardcoded list of built-in category IDs. This keeps
 * Component Definition validation independent of where registered categories
 * originate and allows the registry to support additional category sources
 * in the future without changing this validator's category-membership rule.
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
import {ComponentDefinitionCategoryRegistry} from "@/domain/components/models/ComponentDefinitionCategoryRegistry";

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

const CATEGORY_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STATE_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateComponentDefinition(definition: ComponentDefinition): ValidationResult {
    const errors: string[] = [];

    if (!definition.name.trim()) {
        errors.push("Component name is required.");
    }

    if (!definition.stateId.trim()) {
        errors.push(
            "Component Definition state ID cannot be blank."
        );
    } else if (!STATE_ID_PATTERN.test(definition.stateId)) {
        errors.push(
            `Component Definition state ID "${definition.stateId}" is invalid.`
        );
    }

    if (!definition.categoryId.trim()) {
        errors.push("Component Definition category ID cannot be blank.");
    } else if (!CATEGORY_ID_PATTERN.test(definition.categoryId)) {
        errors.push("Component Definition category ID is invalid.");
    } else if (!ComponentDefinitionCategoryRegistry.has(definition.categoryId)) {
        errors.push(`Component Definition category ID "${definition.categoryId}" is not registered.`);
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