/**
 * ComponentDefinitionCategoryRegistry
 *
 * Provides the authoritative registry of Component Definition categories
 * currently known by Mahogany.
 *
 * Each registered category describes a collection used to organize related
 * Component Definitions. For example, the "characters" category may contain
 * definitions for character-related Component types.
 *
 * Category metadata is defined here rather than scattered throughout the
 * application so other parts of Mahogany can resolve category information
 * from a stable `categoryId`.
 *
 * The registry provides three operations:
 *
 * - `getAll()` returns all registered categories.
 * - `getById()` resolves a category from its stable category ID.
 * - `has()` determines whether a category ID is registered.
 *
 * Category IDs are plural because they identify collections
 * (for example: "characters", "items", and "locations").
 *
 * `directoryName` identifies the filesystem directory associated with the
 * category and is intentionally stored separately from both the category ID
 * and its human-readable name.
 *
 * The registry is currently static and contains Mahogany's built-in
 * categories only. It does not yet support adding, removing, modifying,
 * or persisting user-defined categories. Those capabilities can be added
 * later without requiring consumers of the registry to know where category
 * definitions originate.
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
        id: "locations",
        name: "Locations",
        directoryName: "locations"
    },
    {
        id: "species",
        name: "Species",
        directoryName: "Species",
    },
    {
        id: "professions",
        name: "Professions",
        directoryName: "professions"
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