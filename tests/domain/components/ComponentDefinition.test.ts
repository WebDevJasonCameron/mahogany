import { describe, expect, test } from "vitest";

import { ComponentDefinition } from "@/domain/components/models/ComponentDefinition";
import { FieldType } from "@/domain/components/models/FieldType";
import { validateComponentDefinition } from "@/domain/components/validations/validateComponentDefinition";
import { createComponentDefinition } from "@/domain/components/factories/createComponentDefinition";
import {ComponentState} from "@/domain/components/models/ComponentState";
import {copyComponentDefinition} from "@/domain/components/factories/copyComponentDefinition";

describe("ComponentDefinition", () => {
    test("accepts a valid Character component definition", () => {
        const characterDefinition: ComponentDefinition = {
            id: "character",
            name: "Character",
            state: ComponentState.Library,
            stateId: "core",
            categoryId: "character",
            copyOf: null,
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
            copyOf: null,
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
            copyOf: null,
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
            copyOf: null,
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
        );

        const secondDefinition = createComponentDefinition(
            "Character",
            ComponentState.Library,
            "core",
            "character",
        );

        expect(firstDefinition.id).not.toBe(secondDefinition.id);
    });

    test("identity does not depend on name formatting", () => {
        const firstDefinition = createComponentDefinition(
            "Magic Item",
            ComponentState.Library,
            "core",
            "item",
        );

        const secondDefinition = createComponentDefinition(
            "  MAGIC   ITEM  ",
            ComponentState.Library,
            "core",
            "item",
        );

        expect(firstDefinition.id).not.toBe(secondDefinition.id);
    });

    test("trims component name, state ID, and category ID", () => {
        const definition = createComponentDefinition(
            "  Character  ",
            ComponentState.Library,
            "  core  ",
            "  character  ",
        );

        expect(definition.name).toBe("Character");
        expect(definition.stateId).toBe("core");
        expect(definition.categoryId).toBe("character");
    });

    test("accepts a safe component definition", () => {
        const definition: ComponentDefinition = {
            id: "magic-item",
            name: "Magic Item",
            state: ComponentState.Library,
            stateId: "core",
            categoryId: "item",
            copyOf: null,
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
        );

        const copy = copyComponentDefinition(
            original,
            ComponentState.Package,
            "ravenloft",
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
            copyOf: null,
            fields: [],
        };

        const result = validateComponentDefinition(definition);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            'Component Definition category ID "spaceship" is not registered.'
        );
    });

    test("accepts Component Definitions in each supported state", () => {
        const states = [
            {
                state: ComponentState.Library,
                stateId: "core",
            },
            {
                state: ComponentState.Package,
                stateId: "ravenloft",
            },
            {
                state: ComponentState.InPlay,
                stateId: "ravenloft-saturday",
            },
        ];

        for (const { state, stateId } of states) {
            const definition: ComponentDefinition = {
                id: "test-id",
                name: "Character",
                state,
                stateId,
                categoryId: "character",
                copyOf: null,
                fields: [],
            };

            const result =
                validateComponentDefinition(definition);

            expect(result.valid).toBe(true);
        }
    });

    test("allows a library Component Definition to use a non-core state ID", () => {
        const definition: ComponentDefinition = {
            id: "test-id",
            name: "Character",
            state: ComponentState.Library,
            stateId: "homebrew",
            categoryId: "character",
            copyOf: null,
            fields: [],
        };

        const result =
            validateComponentDefinition(definition);

        expect(result.valid).toBe(true);
    });

    test("distinguishes copies of the same source in different Package contexts", () => {
        const source = createComponentDefinition(
            "Character",
            ComponentState.Library,
            "core",
            "character",
        );

        const ravenloftCopy = createComponentDefinition(
            source.name,
            ComponentState.Package,
            "ravenloft",
            source.categoryId,
        );

        const saltmarshCopy = createComponentDefinition(
            source.name,
            ComponentState.Package,
            "saltmarsh",
            source.categoryId,
        );

        expect(ravenloftCopy.state).toBe(ComponentState.Package);
        expect(saltmarshCopy.state).toBe(ComponentState.Package);

        expect(ravenloftCopy.stateId).not.toBe(
            saltmarshCopy.stateId
        );
        
    });

    test("distinguishes copies in different InPlay contexts", () => {
        const packageDefinition = createComponentDefinition(
            "Character",
            ComponentState.Package,
            "ravenloft",
            "character",
        );

        const saturdayRun = createComponentDefinition(
            packageDefinition.name,
            ComponentState.InPlay,
            "ravenloft-saturday",
            packageDefinition.categoryId,
        );

        const jamesRun = createComponentDefinition(
            packageDefinition.name,
            ComponentState.InPlay,
            "ravenloft-james",
            packageDefinition.categoryId,
        );

        expect(saturdayRun.stateId).not.toBe(jamesRun.stateId);

        expect(saturdayRun.id).not.toBe(jamesRun.id);
    });

    test("allows the same state ID in different Component states", () => {
        const packageDefinition = createComponentDefinition(
            "Character",
            ComponentState.Package,
            "ravenloft",
            "character",
        );

        const inPlayDefinition = createComponentDefinition(
            "Character",
            ComponentState.InPlay,
            "ravenloft",
            "character",
        );

        expect(
            validateComponentDefinition(packageDefinition).valid
        ).toBe(true);

        expect(
            validateComponentDefinition(inPlayDefinition).valid
        ).toBe(true);

        expect(packageDefinition.state).not.toBe(
            inPlayDefinition.state
        );

        expect(packageDefinition.stateId).toBe(
            inPlayDefinition.stateId
        );
    });

    test("rejects an invalid state ID", () => {
        const definition: ComponentDefinition = {
            id: "test-id",
            name: "Character",
            state: ComponentState.Package,
            stateId: "Ravenloft Saturday",
            categoryId: "character",
            copyOf: null,
            fields: [],
        };

        const result =
            validateComponentDefinition(definition);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            'Component Definition state ID "Ravenloft Saturday" is invalid.'
        );
    });

    test("rejects a malformed copyOf ID", () => {
        const definition = createComponentDefinition(
            "Character",
            ComponentState.Library,
            "core",
            "character"
        );

        definition.copyOf = "not-a-valid-id";

        const result = validateComponentDefinition(definition);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            'Component Definition copyOf ID "not-a-valid-id" is invalid.'
        );
    });

    test("accepts a valid copyOf ID", () => {
        const source = createComponentDefinition(
            "Character",
            ComponentState.Library,
            "core",
            "character"
        );

        const copy = copyComponentDefinition(
            source,
            ComponentState.Package,
            "ravenloft"
        );

        const result = validateComponentDefinition(copy);

        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
        expect(copy.copyOf).toBe(source.id);
    });

    test("rejects an empty copyOf ID", () => {
        const definition = createComponentDefinition(
            "Character",
            ComponentState.Library,
            "core",
            "character"
        );

        definition.copyOf = "";

        const result = validateComponentDefinition(definition);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            'Component Definition copyOf ID "" is invalid.'
        );
    });
    
});