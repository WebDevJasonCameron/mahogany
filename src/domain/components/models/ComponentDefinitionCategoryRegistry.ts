/**
 * Category IDs use stable singular identifiers because they identify the
 * category itself rather than its display name or filesystem collection.
 *
 * For example:
 *
 *     id:            "character"
 *     name:          "Characters"
 *     directoryName: "Characters"
 *
 * These values intentionally serve different purposes and must not be
 * treated as interchangeable.
 */

import { ComponentDefinitionCategory } from "@/domain/components/models/ComponentDefinitionCategory";

const categories: readonly ComponentDefinitionCategory[] = [
    {
        id: "character",
        name: "Characters",
        directoryName: "Characters",
    },
    {
        id: "item",
        name: "Items",
        directoryName: "Items",
    },
    {
        id: "location",
        name: "Locations",
        directoryName: "Locations",
    },
    {
        id: "species",
        name: "Species",
        directoryName: "Species",
    },
    {
        id: "profession",
        name: "Professions",
        directoryName: "Professions",
    },
];

export const ComponentDefinitionCategoryRegistry = {
    getAll(): readonly ComponentDefinitionCategory[] {
        return categories;
    },

    getById(
        categoryId: string,
    ): ComponentDefinitionCategory | undefined {
        return categories.find(
            category => category.id === categoryId,
        );
    },

    has(categoryId: string): boolean {
        return categories.some(
            category => category.id === categoryId,
        );
    },
};