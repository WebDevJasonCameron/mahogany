/**
 * createComponentDefinition
 *
 * Factory for creating a new ComponentDefinition from the information
 * supplied by Mahogany or the user.
 *
 * The factory provides a single, consistent creation path for Component
 * Definitions rather than requiring callers to construct the domain object
 * manually.
 *
 * When creating a definition, this factory:
 *
 * - Generates the definition's stable `id` from its name.
 * - Trims surrounding whitespace from `name`.
 * - Trims surrounding whitespace from `categoryId`.
 * - Trims surrounding whitespace from `directory`.
 * - Records whether the definition is a copy of another definition.
 * - Trims and stores the source definition identifier in `copyOf`.
 * - Accepts an optional collection of FieldDefinitions, defaulting to an
 *   empty collection when no fields are supplied.
 *
 * `copy` indicates whether this Component Definition was created as a copy
 * of another definition. When it is a copy, `copyOf` identifies the original
 * definition from which it was created. This allows a copied definition to
 * evolve independently while retaining information about its origin.
 *
 * `createComponentId()` converts the human-readable definition name into
 * Mahogany's stable ID format. The generated ID is lowercase, replaces
 * groups of non-alphanumeric characters with hyphens, and removes leading
 * or trailing hyphens.
 *
 * For example:
 *
 *     " Player Character " -> "player-character"
 *
 * This factory performs object construction and basic normalization only.
 * It does not determine whether the resulting ComponentDefinition is valid.
 * Domain validation remains the responsibility of
 * `validateComponentDefinition`.
 */

import { ComponentDefinition } from "@/domain/components/models/ComponentDefinition";
import { FieldDefinition } from "@/domain/components/models/FieldDefinition";
import { ComponentState } from "@/domain/components/models/ComponentState";

export function createComponentDefinition(
    name: string,
    state: ComponentState,
    stateId: string,
    categoryId: string,
    copyOf: string,
    fields: FieldDefinition[] = []
): ComponentDefinition {
    return {
        id: createComponentId(name),
        name: name.trim(),
        state: state,
        stateId: stateId.trim(),
        categoryId: categoryId.trim(),
        copyOf: copyOf.trim(),
        fields,
    };
}

function createComponentId(
    name: string
): string {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}