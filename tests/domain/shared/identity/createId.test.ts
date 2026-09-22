import { describe, expect, test } from "vitest";

import { createId } from "@/domain/shared/identity/createId";

describe("createId", () => {
    test("creates a UUID v4 identifier", () => {
        const id = createId();

        expect(id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
        );
    });

    test("creates a different identifier for each call", () => {
        const firstId = createId();
        const secondId = createId();

        expect(firstId).not.toBe(secondId);
    });
});