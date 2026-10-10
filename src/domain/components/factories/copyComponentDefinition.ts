/**
 * copyComponentDefinition
 *
 * Creates an independent copy of an existing ComponentDefinition in a
 * specified Mahogany context.
 *
 * A copied definition receives its own stable, opaque `id`. Its `copyOf`
 * property records the `id` of the immediate source definition from which
 * the copy was created.
 *
 * Lineage records the immediate parent rather than the root ancestor. For
 * example, when a Library definition is copied to Package and that Package
 * definition is later copied to InPlay, the InPlay definition's `copyOf`
 * references the Package definition.
 *
 * `copyOf` stores only the source object's stable identity. It does not
 * duplicate the source's state, stateId, name, category, or filesystem
 * location.
 *
 * Mutable field data is copied independently. The copied definition receives
 * its own fields array, FieldDefinition objects, and option arrays so that
 * subsequent changes to the copy do not mutate the source definition.
 *
 * Copying therefore preserves provenance without creating shared mutable
 * state or making the copied definition dependent on future changes to its
 * source.
 */

import { ComponentDefinition } from "@/domain/components/models/ComponentDefinition";
import { ComponentState } from "@/domain/components/models/ComponentState";
import { createId } from "@/domain/shared/identity/createId";

export function copyComponentDefinition(
    source: ComponentDefinition,
    state: ComponentState,
    stateId: string
): ComponentDefinition {
    return {
        ...source,
        id: createId(),
        state,
        stateId: stateId.trim(),
        copyOf: source.id,
        fields: source.fields.map(field => ({
            ...field,
            options: field.options ? [...field.options] : undefined,
        })),
    };
}