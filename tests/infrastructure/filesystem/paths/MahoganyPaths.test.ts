import { describe, expect, test } from "vitest";
import { join } from "node:path";

import {
    getComponentDefinitionPath, getDefinitionCategoryDirectory,
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
                "character",
                "character"
            )
        ).toBe(
            join(
                workspaceRoot,
                ".mahogany",
                "definitions",
                "Characters",
                "character.md"
            )
        );
    });

    test("resolves a category directory from registered category metadata", () => {
        const workspaceRoot = "/test/workspace";

        expect(
            getDefinitionCategoryDirectory(
                workspaceRoot,
                "character"
            )
        ).toBe(
            join(
                workspaceRoot,
                ".mahogany",
                "definitions",
                "Characters"
            )
        );
    });

    test("rejects path traversal using parent directories", () => {
        expect(() => {
            getComponentDefinitionPath(
                "/test/workspace",
                "characters",
                "../../secret"
            );
        }).toThrow(
            "Invalid Component Definition ID"
        );
    });

    test("rejects an unregistered Component Definition category ID", () => {
        expect(() => {
            getDefinitionCategoryDirectory(
                "/test/workspace",
                "spaceship"
            );
        }).toThrow(
            'Component Definition category ID "spaceship" is not registered.'
        );
    });
    
    test("rejects an ID containing a path separator", () => {
        expect(() => {
            getComponentDefinitionPath(
                "/test/workspace",
                "characters",
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
                "characters",
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
                "characters",
                ""
            );
        }).toThrow(
            "Invalid Component Definition ID"
        );
    });
});