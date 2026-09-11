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