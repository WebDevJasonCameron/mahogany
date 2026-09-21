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
 * - Generates the definition's current `id` from its name.
 * - Trims surrounding whitespace from `name`.
 * - Stores the supplied Component lifecycle `state`.
 * - Trims surrounding whitespace from `stateId`.
 * - Trims surrounding whitespace from `categoryId`.
 * - Trims and stores the immediate parent definition identifier in `copyOf`.
 * - Accepts an optional collection of FieldDefinitions, defaulting to an
 *   empty collection when no fields are supplied.
 *
 * `state` identifies the lifecycle context in which the definition exists,
 * such as library, package, or inPlay.
 *
 * `stateId` identifies the specific context within that state. This allows
 * multiple packages or inPlay runs to exist independently while sharing the
 * same lifecycle state.
 *
 * `copyOf` records the ID of the immediate Component Definition from which
 * this definition was copied. An empty value indicates that the definition
 * has no parent in its lineage.
 *
 * `createComponentId()` currently derives an ID from the human-readable
 * definition name by converting it to lowercase, replacing groups of
 * non-alphanumeric characters with hyphens, and removing leading or
 * trailing hyphens.
 *
 * For example:
 *
 *     " Player Character " -> "player-character"
 *
 * Name-derived IDs are temporary behavior. Mahogany's domain model requires
 * `id` to become an immutable unique identifier that remains stable across
 * renames, edits, moves, and changes of state. ID generation will therefore
 * be replaced separately without changing the other factory semantics.
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