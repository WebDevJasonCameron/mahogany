import { mkdir, writeFile } from "node:fs/promises";

import { ComponentDefinitionDocument } from "@/domain/components/models/ComponentDefinitionDocument";
import {
    getComponentDefinitionPath,
    getDefinitionCategoryDirectory,
} from "@/infrastructure/filesystem/paths/MahoganyPaths";
import { serializeComponentDefinitionDocument } from "@/infrastructure/markdown/serializers/serializeComponentDefinitionDocument";

export async function saveComponentDefinitionDocument(
    workspaceRoot: string,
    document: ComponentDefinitionDocument
): Promise<void> {
    const categoryDirectory =
        getDefinitionCategoryDirectory(
            workspaceRoot,
            document.definition.categoryId
        );

    await mkdir(
        categoryDirectory,
        {
            recursive: true,
        }
    );

    const filePath =
        getComponentDefinitionPath(
            workspaceRoot,
            document.definition.categoryId,
            document.definition.id
        );

    const markdown =
        serializeComponentDefinitionDocument(
            document
        );

    await writeFile(
        filePath,
        markdown,
        "utf8"
    );
}