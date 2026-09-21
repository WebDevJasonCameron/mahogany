/**
 * ComponentDefinition
 *
 * Defines the domain structure used to describe a Component within Mahogany.
 *
 * A Component Definition contains the identity, organizational context,
 * lineage, and field schema needed to represent a Component as portable,
 * self-describing data.
 *
 * `id` is the stable, unique identity of this specific definition. It is
 * intended to remain unchanged when the definition is renamed, moved, or
 * edited.
 *
 * `name` is the human-readable name of the definition and may also be used
 * when determining its Markdown filename. It is not the definition's
 * persistent identity.
 *
 * `state` identifies the lifecycle context in which the definition exists.
 * Mahogany currently supports library, package, and inPlay states.
 *
 * `stateId` identifies the specific context within that state. For example,
 * a package may use a stateId identifying a particular campaign, while an
 * inPlay definition may use a stateId identifying a particular run of that
 * campaign.
 *
 * `categoryId` identifies the Component category to which the definition
 * belongs. Category metadata, including its filesystem directory name, is
 * defined separately by ComponentDefinitionCategory and its registry.
 *
 * `copyOf` records the stable ID of the immediate definition from which this
 * definition was copied. An empty value indicates that the definition has
 * no parent in its lineage. This allows copied definitions to evolve
 * independently while preserving their provenance.
 *
 * `fields` describes the fields available to the Component, including their
 * keys, labels, types, requirements, and other field-specific configuration.
 *
 * This interface represents domain data only. It does not perform
 * validation, normalization, filesystem access, or serialization.
 * Those responsibilities belong to their respective domain and
 * infrastructure layers.
 */

import { FieldDefinition } from "@/domain/components/models/FieldDefinition";
import { ComponentState } from "@/domain/components/models/ComponentState";

export interface ComponentDefinition {
    id: string;
    name: string;
    state: ComponentState;
    stateId: string;
    categoryId: string;
    copyOf: string;
    fields: FieldDefinition[];
}