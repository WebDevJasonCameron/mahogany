import { describe, expect, test } from "vitest";

import { createComponentDefinition } from "@/domain/components/factories/createComponentDefinition";
import { copyComponentDefinition } from "@/domain/components/factories/copyComponentDefinition";
import { ComponentState } from "@/domain/components/models/ComponentState";
import {FieldType} from "@/domain/components/models/FieldType";

describe("copyComponentDefinition", () => {
    test("creates a copy with a new identity and immediate-source lineage", () => {
        const source = createComponentDefinition(
            "Character",
            ComponentState.Library,
            "core",
            "character",
            ""
        );

        const copy = copyComponentDefinition(
            source,
            ComponentState.Package,
            "ravenloft"
        );

        expect(copy.id).not.toBe(source.id);
        expect(copy.copyOf).toBe(source.id);

        expect(copy.state).toBe(ComponentState.Package);
        expect(copy.stateId).toBe("ravenloft");
    });

    test("copies fields without sharing mutable state with the source", () => {
        const source = createComponentDefinition(
            "Character",
            ComponentState.Library,
            "core",
            "character",
            "",
            [
                {
                    key: "characterType",
                    label: "Character Type",
                    type: FieldType.Enum,
                    required: true,
                    options: ["PC", "NPC"],
                },
            ]
        );

        const copy = copyComponentDefinition(
            source,
            ComponentState.Package,
            "ravenloft"
        );

        copy.fields[0].label = "Updated Character Type";
        copy.fields[0].options?.push("Companion");

        expect(source.fields[0].label).toBe("Character Type");
        expect(source.fields[0].options).toEqual(["PC", "NPC"]);
    });

    test("preserves immediate-parent lineage from Library to Package to InPlay", () => {
        const libraryDefinition = createComponentDefinition(
            "Character",
            ComponentState.Library,
            "core",
            "character",
            ""
        );

        const packageDefinition = copyComponentDefinition(
            libraryDefinition,
            ComponentState.Package,
            "ravenloft"
        );

        const inPlayDefinition = copyComponentDefinition(
            packageDefinition,
            ComponentState.InPlay,
            "ravenloft-saturday"
        );

        expect(packageDefinition.copyOf).toBe(libraryDefinition.id);
        expect(inPlayDefinition.copyOf).toBe(packageDefinition.id);

        expect(inPlayDefinition.copyOf).not.toBe(libraryDefinition.id);

        expect(libraryDefinition.id).not.toBe(packageDefinition.id);
        expect(packageDefinition.id).not.toBe(inPlayDefinition.id);
    });
});