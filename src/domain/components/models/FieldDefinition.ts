import { FieldType} from "@/domain/components/models/FieldType";

export interface FieldDefinition {
    key: string,
    label: string,
    type: FieldType,
    required: boolean,
    options?: string[],
}