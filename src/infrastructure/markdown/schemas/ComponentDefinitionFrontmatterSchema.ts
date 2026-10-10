/**
 * ...
 * `ComponentDefinitionFrontmatterSchema` describes the complete YAML
 * frontmatter required for a version 1 Component Definition document,
 * including:
 *
 * - Mahogany document metadata.
 * - Definition identity and display name.
 * - Component lifecycle state and state context.
 * - Component Definition category membership.
 * - Copy/origin lineage.
 * - The collection of field definitions that make up the Component schema.
 *
 * `state` identifies the lifecycle context in which the definition exists,
 * such as library, package, or inPlay. `stateId` identifies the specific
 * context within that state.
 *
 * `copyOf` stores the identifier of the immediate Component Definition from
 * which this definition was copied. A null value indicates that the
 * definition is a lineage root with no upstream source.
 *
 * This schema validates the serialized structure and primitive data types
 * of the frontmatter. Higher-level Mahogany domain rules remain the
 * responsibility of `validateComponentDefinition` and
 * `validateFieldDefinition`.
 */

import { z } from "zod";

import { FieldType } from "@/domain/components/models/FieldType";
import { ComponentState } from "@/domain/components/models/ComponentState";

export const MahoganyMetadataSchema = z.object({
    mahogany: z.object({
        type: z.string(),
        version: z.number(),
    }),
});

const FieldDefinitionSchema = z.object({
    key: z.string(),
    label: z.string(),
    type: z.enum(FieldType),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
});

export const ComponentDefinitionFrontmatterSchema = z.object({
    mahogany: z.object({
        type: z.literal("component-definition"),
        version: z.literal(1),
    }),

    id: z.string(),
    name: z.string(),
    state: z.enum(ComponentState),
    stateId: z.string(),
    categoryId: z.string(),
    copyOf: z.string().nullable(),
    fields: z.array(FieldDefinitionSchema),
});