import { ComponentDefinitionCategory } from "@/domain/components/models/ComponentDefinitionCategory";

export const BUILT_IN_COMPONENT_DEFINITION_CATEGORIES:
    ComponentDefinitionCategory[] = [
    {
        id: "characters",
        name: "Characters",
        directoryName: "characters"
    },
    {
        id: "items",
        name: "Items",
        directoryName: "items"

    },
    {
        id: "locations",
        name: "Locations",
        directoryName: "locations"
    },
    {
        id: "species",
        name: "Species",
        directoryName: "species"
    },
    {
        id: "professions",
        name: "Professions",
        directoryName: "professions"
    },
];