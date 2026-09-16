/**
 * saveComponentDefinitionDocument
 *
 * Saves a Component Definition document to the Mahogany workspace
 * filesystem as a Markdown file.
 *
 * The saving process is intentionally divided between specialized
 * infrastructure responsibilities:
 *
 * - `getDefinitionCategoryDirectory()` determines the directory where
 *   definitions belonging to the document's category are stored.
 * - `mkdir()` ensures that category directory exists before writing.
 * - `getComponentDefinitionPath()` determines the complete path for the
 *   Component Definition Markdown file.
 * - `serializeComponentDefinitionDocument()` converts the in-memory
 *   ComponentDefinitionDocument into Markdown.
 * - `writeFile()` writes the serialized Markdown to the filesystem.
 *
 * The document's `categoryId` and `id` determine where the definition is
 * stored. Callers therefore do not need to know or construct Mahogany's
 * physical filesystem paths themselves.
 *
 * The category directory is created recursively when necessary, allowing
 * the save operation to initialize missing definition directories as part
 * of writing the document.
 *
 * This function coordinates persistence only. It does not define filesystem
 * path rules or contain Markdown serialization logic; those responsibilities
 * remain in their respective infrastructure modules.
 *
 * Filesystem and serialization errors are allowed to propagate to the caller
 * so higher application layers can decide how those failures should be
 * handled or presented to the user.
 */

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