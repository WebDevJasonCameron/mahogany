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