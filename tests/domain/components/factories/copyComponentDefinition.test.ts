import { describe, expect, test } from "vitest";

import { createComponentDefinition } from "@/domain/components/factories/createComponentDefinition";
import { copyComponentDefinition } from "@/domain/components/factories/copyComponentDefinition";
import { ComponentState } from "@/domain/components/models/ComponentState";

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
});