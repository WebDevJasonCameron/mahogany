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
            categoryId: "character",
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
            categoryId: "character",
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
            categoryId: "character",
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
            categoryId: "character",
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

    test("creates a generated UUID id independent of the component name", () => {
        const definition = createComponentDefinition(
            "Character",
            ComponentState.Library,
            "core",
            "character",
            ""
        );

        expect(definition.id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
        );

        expect(definition.id).not.toBe("character");
    });

    test("creates distinct ids for components with the same name", () => {
        const firstDefinition = createComponentDefinition(
            "Character",
            ComponentState.Library,
            "core",
            "character",
            ""
        );

        const secondDefinition = createComponentDefinition(
            "Character",
            ComponentState.Library,
            "core",
            "character",
            ""
        );

        expect(firstDefinition.id).not.toBe(secondDefinition.id);
    });

    test("identity does not depend on name formatting", () => {
        const firstDefinition = createComponentDefinition(
            "Magic Item",
            ComponentState.Library,
            "core",
            "item",
            ""
        );

        const secondDefinition = createComponentDefinition(
            "  MAGIC   ITEM  ",
            ComponentState.Library,
            "core",
            "item",
            ""
        );

        expect(firstDefinition.id).not.toBe(secondDefinition.id);
    });

    test("trims component name and category ID", () => {
        const definition = createComponentDefinition(
            "  Character  ",
            ComponentState.Library,
            "core",
            "  character  ",
            ""
        );

        expect(definition.name).toBe("Character");
        expect(definition.categoryId).toBe("character");
    });

    test("accepts a safe component definition", () => {
        const definition: ComponentDefinition = {
            id: "magic-item",
            name: "Magic Item",
            state: ComponentState.Library,
            stateId: "core",
            categoryId: "item",
            copyOf: "",
            fields: [],
        };

        const result = validateComponentDefinition(definition);

        expect(result.valid).toBe(true);
    });

    test("creates a copy with a new identity while preserving lineage", () => {
        const original = createComponentDefinition(
            "Character",
            ComponentState.Library,
            "core",
            "character",
            ""
        );

        const copy = createComponentDefinition(
            original.name,
            ComponentState.Package,
            "ravenloft",
            original.categoryId,
            original.id
        );

        expect(copy.id).not.toBe(original.id);
        expect(copy.copyOf).toBe(original.id);
    });

    test("rejects an unregistered category ID", () => {
        const definition: ComponentDefinition = {
            id: "test-id",
            name: "Spaceship",
            state: ComponentState.Library,
            stateId: "core",
            categoryId: "spaceship",
            copyOf: "",
            fields: [],
        };

        const result = validateComponentDefinition(definition);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            'Component Definition category ID "spaceship" is not registered.'
        );
    });
    
});