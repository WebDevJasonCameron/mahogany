/**
 * FieldDefinition
 *
 * Defines the schema for a single field belonging to a Component Definition.
 *
 * Field Definitions describe what information a Component created from the
 * parent Component Definition may contain. For example, a Character definition
 * might contain fields such as "name", "species", "profession", or "level".
 *
 * `key` is the stable machine-facing identifier used to identify the field
 * within Mahogany and its serialized data.
 *
 * `label` is the human-readable name presented to the user.
 *
 * `type` identifies the kind of data the field accepts using Mahogany's
 * FieldType model.
 *
 * `required` determines whether a value must be provided for this field.
 *
 * `options` contains the allowed values for field types that require a
 * predefined set of choices, such as an Enum. It is optional because most
 * field types do not require a list of choices.
 *
 * A FieldDefinition describes the structure of a field, not the actual value
 * assigned to that field on a Component instance.
 *
 * This interface represents domain data only. Validation, normalization,
 * serialization, and user-interface behavior are handled separately.
 */

import { FieldType} from "@/domain/components/models/FieldType";

export interface FieldDefinition {
    key: string,
    label: string,
    type: FieldType,
    required: boolean,
    options?: string[],
}