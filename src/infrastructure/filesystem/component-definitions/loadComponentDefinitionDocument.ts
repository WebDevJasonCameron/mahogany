/**
 * loadComponentDefinitionDocument
 *
 * Loads a Component Definition document from the Mahogany workspace
 * filesystem and converts its Markdown contents into Mahogany's
 * in-memory ComponentDefinitionDocument representation.
 *
 * The loading process is intentionally divided between specialized
 * infrastructure responsibilities:
 *
 * - `getComponentDefinitionPath()` determines where the requested
 *   Component Definition file is stored within the workspace.
 * - `readFile()` reads the Markdown file from the filesystem.
 * - `deserializeComponentDefinitionDocument()` converts the Markdown
 *   contents into a ComponentDefinitionDocument.
 *
 * The caller identifies the document using the workspace root, the
 * Component Definition category ID, and the Component Definition ID.
 * This function does not require callers to know or construct the
 * physical filesystem path themselves.
 *
 * This function coordinates loading only. It does not define filesystem
 * path rules or contain Markdown parsing/deserialization logic; those
 * responsibilities remain in their respective infrastructure modules.
 *
 * Filesystem read errors and deserialization errors are allowed to
 * propagate to the caller so higher application layers can decide how
 * those failures should be handled or presented to the user.
 */

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