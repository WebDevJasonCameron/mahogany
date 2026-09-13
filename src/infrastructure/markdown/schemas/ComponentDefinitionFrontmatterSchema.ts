import { z } from "zod";

import { FieldType } from "@/domain/components/models/FieldType";

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
    categoryId: z.string(),
    directory: z.string(),
    fields: z.array(FieldDefinitionSchema),
});