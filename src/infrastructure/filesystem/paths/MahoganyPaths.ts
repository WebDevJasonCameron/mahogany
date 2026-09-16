/**
 * MahoganyPaths
 *
 * Centralizes construction and safety validation of filesystem paths used
 * by Mahogany's Component Definition storage infrastructure.
 *
 * Component Definitions are currently stored beneath the workspace's
 * Mahogany metadata directory:
 *
 *     <workspace>/.mahogany/definitions/<category>/<definition-id>.md
 *
 * This module provides path-building functions so other parts of Mahogany
 * do not need to know or reproduce that filesystem structure themselves.
 *
 * `getDefinitionsDirectory()` resolves the root directory containing all
 * Component Definition categories.
 *
 * `getDefinitionCategoryDirectory()` resolves the directory containing
 * Component Definitions for a particular category.
 *
 * `getComponentDefinitionPath()` resolves the Markdown file belonging to
 * a particular Component Definition within its category.
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
 *
 * NOTE:
 * Category directories are currently resolved directly from `categoryId`.
 * As Mahogany's Component Definition Category Registry is integrated,
 * category IDs may instead be resolved through the registry to obtain the
 * category's explicit `directoryName`. Keeping path construction centralized
 * here allows that storage rule to change without affecting callers.
 */

import {
    relative,
    resolve,
} from "node:path";

const SAFE_ID_PATTERN =
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function getDefinitionsDirectory(
    workspaceRoot: string
): string {
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

    const definitionsDirectory =
        getDefinitionsDirectory(
            workspaceRoot
        );

    const categoryDirectory =
        resolve(
            definitionsDirectory,
            categoryId
        );

    assertPathInsideDirectory(
        definitionsDirectory,
        categoryDirectory
    );

    return categoryDirectory;
}

export function getComponentDefinitionPath(
    workspaceRoot: string,
    categoryId: string,
    componentDefinitionId: string
): string {
    assertSafeId(
        componentDefinitionId,
        "Component Definition ID"
    );

    const categoryDirectory =
        getDefinitionCategoryDirectory(
            workspaceRoot,
            categoryId
        );

    const filePath =
        resolve(
            categoryDirectory,
            `${componentDefinitionId}.md`
        );

    assertPathInsideDirectory(
        categoryDirectory,
        filePath
    );

    return filePath;
}

function assertSafeId(
    value: string,
    label: string
): void {
    if (
        !SAFE_ID_PATTERN.test(value)
    ) {
        throw new Error(
            `Invalid ${label} "${value}".`
        );
    }
}

function assertPathInsideDirectory(
    directory: string,
    targetPath: string
): void {
    const relativePath =
        relative(
            directory,
            targetPath
        );

    if (
        relativePath.startsWith("..") ||
        relativePath === ""
    ) {
        throw new Error(
            "Filesystem path must remain inside its expected directory."
        );
    }
}