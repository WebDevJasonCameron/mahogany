import { describe, expect, test } from "vitest";
import {createComponentDefinition} from "@/domain/components/factories/createComponentDefinition";
import {ComponentState} from "@/domain/components/models/ComponentState";

describe("copyComponentDefinition", () => {
    test("creates a newly authored Component Definition with no upstream source", () => {
        const definition = createComponentDefinition(
            "Character",
            ComponentState.Library,
            "core",
            "character",
            []
        );

        expect(definition.copyOf).toBe("");
    });

});