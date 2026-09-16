/**
 * normalizeFieldDefinition
 *
 * Converts a FieldDefinition into Mahogany's normalized form before the
 * field is validated, compared, serialized, or otherwise processed.
 *
 * Normalization cleans representational differences without deciding
 * whether the FieldDefinition itself is valid.
 *
 * Currently this function:
 *
 * - Trims leading and trailing whitespace from `key`.
 * - Trims leading and trailing whitespace from `label`.
 * - Trims each option when the field is an Enum with defined options.
 * - Preserves all other FieldDefinition properties unchanged.
 *
 * Enum options are only normalized for Enum fields because `options`
 * has semantic meaning for that field type. Other field types retain
 * their existing `options` value rather than having normalization
 * silently alter unrelated data.
 *
 * This function returns a new FieldDefinition and does not mutate the
 * FieldDefinition passed to it.
 *
 * Normalization does not perform validation. Rules such as whether a key
 * is empty, whether an Enum contains valid options, or whether other field
 * constraints are satisfied belong to the validation layer.
 */

import { FieldDefinition } from "@/domain/components/models/FieldDefinition";
import { FieldType } from "@/domain/components/models/FieldType";

export function normalizeFieldDefinition(
    field: FieldDefinition
): FieldDefinition {
    return {
        ...field,
        key: field.key.trim(),
        label: field.label.trim(),
        options:
            field.type === FieldType.Enum && field.options
                ? field.options.map(option => option.trim())
                : field.options,
    };
}