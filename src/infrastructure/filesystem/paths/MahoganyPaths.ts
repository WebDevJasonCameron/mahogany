import {
    join,
    relative,
    resolve,
} from "node:path";

const COMPONENT_DEFINITION_ID_PATTERN =
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function getDefinitionsDirectory(
    workspaceRoot: string
): string {
    return join(
        workspaceRoot,
        ".mahogany",
        "definitions"
    );
}

export function getComponentDefinitionPath(
    workspaceRoot: string,
    componentDefinitionId: string
): string {
    assertValidComponentDefinitionId(
        componentDefinitionId
    );

    const definitionsDirectory =
        resolve(
            getDefinitionsDirectory(workspaceRoot)
        );

    const filePath =
        resolve(
            definitionsDirectory,
            `${componentDefinitionId}.md`
        );

    assertPathInsideDirectory(
        definitionsDirectory,
        filePath
    );

    return filePath;
}

function assertValidComponentDefinitionId(
    componentDefinitionId: string
): void {
    if (
        !COMPONENT_DEFINITION_ID_PATTERN.test(
            componentDefinitionId
        )
    ) {
        throw new Error(
            `Invalid Component Definition ID "${componentDefinitionId}".`
        );
    }
}

function assertPathInsideDirectory(
    directory: string,
    filePath: string
): void {
    const relativePath =
        relative(directory, filePath);

    if (
        relativePath.startsWith("..") ||
        relativePath === ""
    ) {
        throw new Error(
            "Component Definition path must remain inside the definitions directory."
        );
    }
}