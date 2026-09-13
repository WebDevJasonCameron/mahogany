import { ComponentDefinition } from "@/domain/components/models/ComponentDefinition";

export interface ComponentDefinitionDocument {
    definition: ComponentDefinition;
    body: string;
}