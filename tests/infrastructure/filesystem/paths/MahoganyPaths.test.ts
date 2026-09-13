import { describe, expect, test } from "vitest";
import { join } from "node:path";

import {
    getComponentDefinitionPath,
    getDefinitionsDirectory,
} from "@/infrastructure/filesystem/paths/MahoganyPaths";

describe("MahoganyPaths", () => {
    test("returns the Component Definitions directory", () => {
        const workspaceRoot = "/test/workspace";

        expect(
            getDefinitionsDirectory(workspaceRoot)
        ).toBe(
            join(
                workspaceRoot,
                ".mahogany",
                "definitions"
            )
        );
    });

    test("returns the path for a valid Component Definition ID", () => {
        const workspaceRoot = "/test/workspace";

        expect(
            getComponentDefinitionPath(
                workspaceRoot,
                "character"
            )
        ).toBe(
            join(
                workspaceRoot,
                ".mahogany",
                "definitions",
                "character.md"
            )
        );
    });

    test("rejects path traversal using parent directories", () => {
        expect(() => {
            getComponentDefinitionPath(
                "/test/workspace",
                "../../secret"
            );
        }).toThrow(
            "Invalid Component Definition ID"
        );
    });

    test("rejects an ID containing a path separator", () => {
        expect(() => {
            getComponentDefinitionPath(
                "/test/workspace",
                "characters/secret"
            );
        }).toThrow(
            "Invalid Component Definition ID"
        );
    });

    test("rejects an ID containing a backslash", () => {
        expect(() => {
            getComponentDefinitionPath(
                "/test/workspace",
                "characters\\secret"
            );
        }).toThrow(
            "Invalid Component Definition ID"
        );
    });

    test("rejects an empty Component Definition ID", () => {
        expect(() => {
            getComponentDefinitionPath(
                "/test/workspace",
                ""
            );
        }).toThrow(
            "Invalid Component Definition ID"
        );
    });
});