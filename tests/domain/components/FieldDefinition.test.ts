import { describe, expect, test } from "vitest";

import { FieldDefinition } from "@/domain/components/models/FieldDefinition";
import { FieldType } from "@/domain/components/models/FieldType";
import { validateFieldDefinition } from "@/domain/components/validations/validateFieldDefinition";
import { normalizeFieldDefinition } from "@/domain/components/normalizations/normalizeFieldDefinition";

describe("FieldDefinition", () => {
    test("accepts a valid string field", () => {
        const field: FieldDefinition = {
            key: "name",
            label: "Name",
            type: FieldType.String,
            required: true,
        };

        const result = validateFieldDefinition(field);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    test("rejects a blank field key", () => {
        const field: FieldDefinition = {
            key: "   ",
            label: "Name",
            type: FieldType.String,
            required: true,
        };

        const result = validateFieldDefinition(field);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain("Field key is required.");
    });

    test("rejects a blank field label", () => {
        const field: FieldDefinition = {
            key: "name",
            label: "   ",
            type: FieldType.String,
            required: true,
        };

        const result = validateFieldDefinition(field);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain("Field label is required.");
    });

    test("rejects an enum field with no options", () => {
        const field: FieldDefinition = {
            key: "characterType",
            label: "Character Type",
            type: FieldType.Enum,
            required: true,
            options: [],
        };

        const result = validateFieldDefinition(field);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            'Enum field "Character Type" must contain at least one option.'
        );
    });

    test("rejects options on a non-enum field", () => {
        const field: FieldDefinition = {
            key: "name",
            label: "Name",
            type: FieldType.String,
            required: true,
            options: ["One", "Two"],
        };

        const result = validateFieldDefinition(field);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            'Non-enum field "Name" cannot contain options.'
        );
    });
    
    test("rejects a field key containing spaces", () => {
        const field: FieldDefinition = {
            key: "character type",
            label: "Character Type",
            type: FieldType.String,
            required: true,
        };

        const result = validateFieldDefinition(field);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            'Field key "character type" must begin with a letter and contain only letters and numbers.'
        );
    });

    test("rejects a field key containing path characters", () => {
        const field: FieldDefinition = {
            key: "../../name",
            label: "Name",
            type: FieldType.String,
            required: true,
        };

        const result = validateFieldDefinition(field);

        expect(result.valid).toBe(false);
    });

    test("accepts a camelCase field key", () => {
        const field: FieldDefinition = {
            key: "characterType",
            label: "Character Type",
            type: FieldType.String,
            required: true,
        };

        const result = validateFieldDefinition(field);

        expect(result.valid).toBe(true);
    });

    test("rejects a blank enum option", () => {
        const field: FieldDefinition = {
            key: "characterType",
            label: "Character Type",
            type: FieldType.Enum,
            required: true,
            options: ["PC", "NPC", "   "],
        };

        const result = validateFieldDefinition(field);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            'Enum field "Character Type" cannot contain blank options.'
        );
    });

    test("rejects duplicate enum options", () => {
        const field: FieldDefinition = {
            key: "characterType",
            label: "Character Type",
            type: FieldType.Enum,
            required: true,
            options: ["PC", "NPC", "NPC"],
        };

        const result = validateFieldDefinition(field);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            'Enum field "Character Type" cannot contain duplicate options.'
        );
    });

    test("detects duplicate enum options after trimming", () => {
        const field: FieldDefinition = {
            key: "characterType",
            label: "Character Type",
            type: FieldType.Enum,
            required: true,
            options: ["PC", " NPC ", "NPC"],
        };

        const result = validateFieldDefinition(field);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            'Enum field "Character Type" cannot contain duplicate options.'
        );
    });

    test("trims enum options during normalization", () => {
        const field: FieldDefinition = {
            key: "characterType",
            label: "Character Type",
            type: FieldType.Enum,
            required: true,
            options: [" PC ", " NPC "],
        };

        const normalized = normalizeFieldDefinition(field);

        expect(normalized.options).toEqual([
            "PC",
            "NPC",
        ]);
    });

    test("trims field key and label during normalization", () => {
        const field: FieldDefinition = {
            key: "  characterType  ",
            label: "  Character Type  ",
            type: FieldType.Enum,
            required: true,
            options: ["PC", "NPC"],
        };

        const normalized = normalizeFieldDefinition(field);

        expect(normalized.key).toBe("characterType");
        expect(normalized.label).toBe("Character Type");
    });
});