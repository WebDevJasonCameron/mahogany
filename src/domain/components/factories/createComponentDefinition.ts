/**
 * createComponentDefinition
 *
 * Factory for creating a newly authored root ComponentDefinition from the
 * information supplied by Mahogany or the user.
 *
 * The factory provides a single, consistent creation path for new root
 * Component Definitions rather than requiring callers to construct the
 * domain object manually.
 *
 * When creating a definition, this factory:
 *
 * - Generates a new stable, opaque `id`.
 * - Trims surrounding whitespace from `name`.
 * - Stores the supplied Component lifecycle `state`.
 * - Trims surrounding whitespace from `stateId`.
 * - Trims surrounding whitespace from `categoryId`.
 * - Sets `copyOf` to an empty string because a newly authored definition
 *   has no upstream Mahogany source.
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
 * A newly authored definition is a lineage root, represented by `copyOf`
 * containing an empty string. Definitions copied from an existing definition
 * must instead be created through `copyComponentDefinition`, which assigns
 * the copy its own identity and records the immediate source definition's ID
 * in `copyOf`.
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
    fields: FieldDefinition[] = []
): ComponentDefinition {
    return {
        id: createId(),
        name: name.trim(),
        state,
        stateId: stateId.trim(),
        categoryId: categoryId.trim(),
        copyOf: "",
        fields,
    };
}