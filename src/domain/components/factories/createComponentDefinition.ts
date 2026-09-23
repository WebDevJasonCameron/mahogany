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
 * - Generates a new stable, opaque `id`.
 * - Trims surrounding whitespace from `name`.
 * - Stores the supplied Component lifecycle `state`.
 * - Trims surrounding whitespace from `stateId`.
 * - Trims surrounding whitespace from `categoryId`.
 * - Trims and stores the immediate parent definition identifier in `copyOf`.
 * - Accepts an optional collection of FieldDefinitions, defaulting to an
 *   empty collection when no fields are supplied.
 *
 * `id` is generated independently of the definition's name, filesystem
 * representation, state, category, and content. Once assigned, the ID
 * identifies that specific definition and must remain unchanged when the
 * definition is renamed, moved, or edited.
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
 * has no parent in its lineage. A copied definition receives its own new ID
 * while retaining its immediate parent's ID through `copyOf`.
 *
 * ID generation is delegated to `createId()`, which implements Mahogany's
 * UUID v4 identity strategy.
 *
 * This factory performs object construction and basic normalization only.
 * It does not determine whether the resulting ComponentDefinition is valid.
 * Domain validation remains the responsibility of
 * `validateComponentDefinition`.
 */

import { ComponentDefinition } from "@/domain/components/models/ComponentDefinition";
import { FieldDefinition } from "@/domain/components/models/FieldDefinition";
import { ComponentState } from "@/domain/components/models/ComponentState";
import { createId } from "@/domain/shared/identity/createId";

export function createComponentDefinition(
    name: string,
    state: ComponentState,
    stateId: string,
    categoryId: string,
    copyOf: string,
    fields: FieldDefinition[] = []
): ComponentDefinition {
    return {
        id: createId(),
        name: name.trim(),
        state,
        stateId: stateId.trim(),
        categoryId: categoryId.trim(),
        copyOf: copyOf.trim(),
        fields,
    };
}