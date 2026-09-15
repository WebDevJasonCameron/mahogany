import { ComponentDefinitionCategory } from "" +
    "" +
"ComponentDefinitionCategory";

const categories: readonly ComponentDefinitionCategory[] = [
    {
        id: "character",
        name: "Characters",
        directoryName: "Characters",
    },
    {
        id: "class",
        name: "Classes",
        directoryName: "Classes",
    },
    {
        id: "item",
        name: "Items",
        directoryName: "Items",
    },
    {
        id: "species",
        name: "Species",
        directoryName: "Species",
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