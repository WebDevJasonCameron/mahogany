import { FieldDefinition } from "@/domain/components/models/FieldDefinition";

export interface ComponentDefinition {
    id: string,
    name: string,
    directory: string,
    fields: FieldDefinition[],
}