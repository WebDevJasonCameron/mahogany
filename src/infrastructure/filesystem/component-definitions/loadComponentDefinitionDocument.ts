import { readFile } from "node:fs/promises";

import { ComponentDefinitionDocument } from "@/domain/components/models/ComponentDefinitionDocument";
import { getComponentDefinitionPath } from "@/infrastructure/filesystem/paths/MahoganyPaths";
import { deserializeComponentDefinitionDocument } from "@/infrastructure/markdown/deserializers/deserializeComponentDefinitionDocument";

export async function loadComponentDefinitionDocument(
    workspaceRoot: string,
    categoryId: string,
    componentDefinitionId: string
): Promise<ComponentDefinitionDocument> {
    const filePath =
        getComponentDefinitionPath(
            workspaceRoot,
            categoryId,
            componentDefinitionId
        );

    const markdown =
        await readFile(
            filePath,
            "utf8"
        );

    return deserializeComponentDefinitionDocument(
        markdown
    );
}