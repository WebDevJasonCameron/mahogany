/**
 * MahoganyPaths
 *
 * Centralizes construction and safety validation of filesystem paths used
 * by Mahogany's Component Definition storage infrastructure.
 *
 * Component Definitions are stored beneath the workspace's Mahogany
 * metadata directory:
 *
 *     <workspace>/.mahogany/definitions/<category-directory>/<definition-id>.md
 *
 * Category identity and filesystem representation are intentionally
 * separate concerns. Callers provide a stable `categoryId`, which is
 * resolved through the Component Definition Category Registry. The
 * registered category's explicit `directoryName` is then used when
 * constructing the filesystem path.
 *
 * For example:
 *
 *     categoryId:    "character"
 *     directoryName: "Characters"
 *
 * produces:
 *
 *     <workspace>/.mahogany/definitions/Characters/<definition-id>.md
 *
 * `getDefinitionsDirectory()` resolves the root directory containing all
 * Component Definition categories.
 *
 * `getDefinitionCategoryDirectory()` validates the supplied category ID,
 * verifies that the category is registered, and resolves its directory
 * using the category's registered `directoryName`.
 *
 * `getComponentDefinitionPath()` resolves the Markdown file belonging to
 * a particular Component Definition within its registered category
 * directory.
 *
 * IDs used to construct filesystem paths must satisfy `SAFE_ID_PATTERN`.
 * Safe IDs contain lowercase alphanumeric words optionally separated by
 * hyphens. Restricting IDs prevents filesystem control characters and path
 * traversal sequences from becoming part of generated paths.
 *
 * `assertPathInsideDirectory()` provides an additional containment check
 * after path resolution. Generated paths must remain inside the directory
 * they are expected to belong to rather than escaping into another part
 * of the workspace or filesystem.
 *
 * This module determines filesystem locations only. It does not create,
 * read, write, serialize, or deserialize files.
 */

import {
    relative,
    resolve,
} from "node:path";
import { ComponentDefinitionCategoryRegistry } from "@/domain/components/models/ComponentDefinitionCategoryRegistry";

const SAFE_ID_PATTERN =
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function getDefinitionsDirectory(workspaceRoot: string): string {
    return resolve(
        workspaceRoot,
        ".mahogany",
        "definitions"
    );
}

export function getDefinitionCategoryDirectory(
    workspaceRoot: string,
    categoryId: string
): string {
    assertSafeId(
        categoryId,
        "Component Definition category ID"
    );

    const category =
        ComponentDefinitionCategoryRegistry.getById(
            categoryId
        );

    if (!category) {
        throw new Error(
            `Component Definition category ID "${categoryId}" is not registered.`
        );
    }

    const definitionsDirectory =
        getDefinitionsDirectory(workspaceRoot);

    const categoryDirectory = resolve(
        definitionsDirectory,
        category.directoryName
    );

    assertPathInsideDirectory(
        definitionsDirectory,
        categoryDirectory
    );

    return categoryDirectory;
}

export function getComponentDefinitionPath(workspaceRoot: string, categoryId: string, componentDefinitionId: string): string {
    assertSafeId(componentDefinitionId, "Component Definition ID");

    const categoryDirectory = getDefinitionCategoryDirectory(workspaceRoot, categoryId);

    const filePath = resolve(categoryDirectory, `${componentDefinitionId}.md`);

    assertPathInsideDirectory(categoryDirectory, filePath);

    return filePath;
}

function assertSafeId(value: string, label: string): void {
    if (!SAFE_ID_PATTERN.test(value)) {
        throw new Error(`Invalid ${label} "${value}".`);
    }
}

function assertPathInsideDirectory(directory: string, targetPath: string): void {
    const relativePath = relative(directory, targetPath);

    if (relativePath.startsWith("..") || relativePath === "") {
        throw new Error("Filesystem path must remain inside its expected directory.");
    }
}