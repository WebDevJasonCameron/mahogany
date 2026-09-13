import { join } from "node:path";

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
    return join(
        getDefinitionsDirectory(workspaceRoot),
        `${componentDefinitionId}.md`
    );
}