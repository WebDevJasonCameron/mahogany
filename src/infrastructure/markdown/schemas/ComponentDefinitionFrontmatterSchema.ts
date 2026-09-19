/**
 * ComponentDefinitionFrontmatterSchema
 *
 * Defines and validates the expected YAML frontmatter structure for
 * Mahogany Component Definition Markdown documents.
 *
 * These schemas form the boundary between untrusted data read from Markdown
 * files and the structured data Mahogany uses internally. Successfully
 * parsing YAML is not enough for Mahogany to trust a document; its contents
 * must also match the expected schema.
 *
 * `MahoganyMetadataSchema` validates the basic Mahogany metadata envelope.
 * It intentionally accepts general string and numeric values for `type` and
 * `version` so the deserialization process can inspect those values and
 * provide specific errors for unsupported document types or versions.
 *
 * `FieldDefinitionSchema` describes the serialized structure of each field
 * belonging to a Component Definition, including optional Enum options.
 *
 * `ComponentDefinitionFrontmatterSchema` describes the complete YAML
 * frontmatter required for a version 1 Component Definition document,
 * including:
 *
 * - Mahogany document metadata.
 * - Definition identity and display name.
 * - Component Definition category membership.
 * - Component instance directory information.
 * - Copy/origin metadata.
 * - The collection of field definitions that make up the Component schema.
 *
 * `copy` indicates whether the definition originated as a copy of another
 * Component Definition. `copyOf` stores the identifier of that source
 * definition so its origin can survive serialization and deserialization.
 *
 * This schema validates the serialized structure and primitive data types
 * of the frontmatter. Higher-level Mahogany domain rules remain the
 * responsibility of `validateComponentDefinition` and
 * `validateFieldDefinition`.
 */

import { z } from "zod";

import { FieldType } from "@/domain/components/models/FieldType";
import {ComponentState} from "@/domain/components/models/ComponentState";

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
    copyOf: z.string(),
    fields: z.array(FieldDefinitionSchema),
});