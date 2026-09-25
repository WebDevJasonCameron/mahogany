import { describe, expect, it } from "vitest";
import { ComponentDefinitionCategoryRegistry } from "@/domain/components/models/ComponentDefinitionCategoryRegistry";

describe("ComponentDefinitionCategoryRegistry", () => {
    it("returns all registered categories", () => {
        const categories =
            ComponentDefinitionCategoryRegistry.getAll();

        expect(categories).toHaveLength(5);
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
    
    it("resolves categories by their singular category id", () => {
        expect(
            ComponentDefinitionCategoryRegistry.getById("character")
        )?.toEqual({
            id: "character",
            name: "Characters",
            directoryName: "Characters",
        });

        expect(
            ComponentDefinitionCategoryRegistry.getById("location")
        )?.toEqual({
            id: "location",
            name: "Locations",
            directoryName: "Locations",
        });

        expect(
            ComponentDefinitionCategoryRegistry.getById("profession")
        )?.toEqual({
            id: "profession",
            name: "Professions",
            directoryName: "Professions",
        });
    });

    it("does not recognize old plural category ids", () => {
        expect(
            ComponentDefinitionCategoryRegistry.has("characters")
        ).toBe(false);

        expect(
            ComponentDefinitionCategoryRegistry.has("items")
        ).toBe(false);

        expect(
            ComponentDefinitionCategoryRegistry.has("locations")
        ).toBe(false);

        expect(
            ComponentDefinitionCategoryRegistry.has("professions")
        ).toBe(false);
    });
});