import { mkdir, writeFile } from "node:fs/promises";

import { ComponentDefinitionDocument } from "@/domain/components/models/ComponentDefinitionDocument";
import { getComponentDefinitionPath, getDefinitionsDirectory } from "@/infrastructure/filesystem/paths/MahoganyPaths";
import { serializeComponentDefinitionDocument } from "@/infrastructure/markdown/serializers/serializeComponentDefinitionDocument";

export async function saveComponentDefinitionDocument(
    workspaceRoot: string,
    document: ComponentDefinitionDocument
): Promise<void> {
    const definitionsDirectory =
        getDefinitionsDirectory(workspaceRoot);

    await mkdir(definitionsDirectory, {
        recursive: true,
    });

    const filePath =
        getComponentDefinitionPath(
            workspaceRoot,
            document.definition.id
        );

    const markdown =
        serializeComponentDefinitionDocument(document);

    await writeFile(
        filePath,
        markdown,
        "utf8"
    );
}