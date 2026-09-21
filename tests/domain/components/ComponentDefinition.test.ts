import { describe, expect, test } from "vitest";

import { ComponentDefinition } from "@/domain/components/models/ComponentDefinition";
import { FieldType } from "@/domain/components/models/FieldType";
import { validateComponentDefinition } from "@/domain/components/validations/validateComponentDefinition";
import { createComponentDefinition } from "@/domain/components/factories/createComponentDefinition";
import {ComponentState} from "@/domain/components/models/ComponentState";

describe("ComponentDefinition", () => {
    test("accepts a valid Character component definition", () => {
        const characterDefinition: ComponentDefinition = {
            id: "character",
            name: "Character",
            state: ComponentState.Library,
            stateId: "core",
            categoryId: "characters",
            copyOf: "",
            fields: [
                {
                    key: "name",
                    label: "Name",
                    type: FieldType.String,
                    required: true,
                },
                {
                    key: "characterType",
                    label: "Character Type",
                    type: FieldType.Enum,
                    required: true,
                    options: ["PC", "NPC"],
                },
                {
                    key: "description",
                    label: "Description",
                    type: FieldType.Text,
                    required: false,
                },
            ],
        };

        const result = validateComponentDefinition(characterDefinition);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    test("rejects a blank component name", () => {
        const definition: ComponentDefinition = {
            id: "character",
            name: "   ",
            state: ComponentState.Library,
            stateId: "core",
            categoryId: "characters",
            copyOf: "",
            fields: [],
        };

        const result = validateComponentDefinition(definition);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain("Component name is required.");
    });

    test("rejects duplicate field keys", () => {
        const definition: ComponentDefinition = {
            id: "character",
            name: "Character",
            state: ComponentState.Library,
            stateId: "core",
            categoryId: "characters",
            copyOf: "",
            fields: [
                {
                    key: "name",
                    label: "Name",
                    type: FieldType.String,
                    required: true,
                },
                {
                    key: "name",
                    label: "Display Name",
                    type: FieldType.String,
                    required: false,
                },
            ],
        };

        const result = validateComponentDefinition(definition);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain("Duplicate field key: name");
    });

    test("rejects an enum field with no options", () => {
        const definition: ComponentDefinition = {
            id: "character",
            name: "Character",
            state: ComponentState.Library,
            stateId: "core",
            categoryId: "characters",
            copyOf: "",
            fields: [
                {
                    key: "characterType",
                    label: "Character Type",
                    type: FieldType.Enum,
                    required: true,
                    options: [],
                },
            ],
        };

        const result = validateComponentDefinition(definition);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            'Enum field "Character Type" must contain at least one option.'
        );
    });

    test("creates an id from the component name", () => {
        const definition = createComponentDefinition(
            "Character",
            ComponentState.Library,
            "core",
            "Characters",
            ""
        );

        expect(definition.id).toBe("character");
    });

    test("creates a kebab-case id from a multi-word component name", () => {
        const definition = createComponentDefinition(
            "Magic Item",
            ComponentState.Library,
            "core",
            "Items",
            ""
        );

        expect(definition.id).toBe("magic-item");
    });

    test("trims component name and category ID", () => {
        const definition = createComponentDefinition(
            "  Character  ",
            ComponentState.Library,
            "core",
            "  characters  ",
            ""
        );

        expect(definition.name).toBe("Character");
        expect(definition.categoryId).toBe("characters");
    });

    test("accepts a safe component definition", () => {
        const definition: ComponentDefinition = {
            id: "magic-item",
            name: "Magic Item",
            state: ComponentState.Library,
            stateId: "core",
            categoryId: "items",
            copyOf: "",
            fields: [],
        };

        const result = validateComponentDefinition(definition);

        expect(result.valid).toBe(true);
    });
});