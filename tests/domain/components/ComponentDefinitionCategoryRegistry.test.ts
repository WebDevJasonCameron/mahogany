import { describe, expect, it } from "vitest";
import { ComponentDefinitionCategoryRegistry } from "@/domain/components/models/ComponentDefinitionCategoryRegistry";

describe("ComponentDefinitionCategoryRegistry", () => {
    it("returns all registered categories", () => {
        const categories =
            ComponentDefinitionCategoryRegistry.getAll();

        expect(categories).toHaveLength(4);
    });

    it("returns a category by id", () => {
        const category =
            ComponentDefinitionCategoryRegistry.getById(
                "character",
            );

        expect(category).toEqual({
            id: "character",
            name: "Characters",
            directoryName: "Characters",
        });
    });

    it("returns undefined for an unknown category", () => {
        const category =
            ComponentDefinitionCategoryRegistry.getById(
                "spaceship",
            );

        expect(category).toBeUndefined();
    });

    it("reports whether a category exists", () => {
        expect(
            ComponentDefinitionCategoryRegistry.has(
                "character",
            ),
        ).toBe(true);

        expect(
            ComponentDefinitionCategoryRegistry.has(
                "spaceship",
            ),
        ).toBe(false);
    });
});