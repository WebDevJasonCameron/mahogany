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