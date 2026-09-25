/**
 * ComponentDefinitionCategory
 *
 * Defines the metadata used to identify and represent a Component Definition
 * category within Mahogany.
 *
 * A category groups related Component Definitions, such as Characters,
 * Items, Locations, Species, or Professions.
 *
 * `id` is the stable machine-readable identity of the category. Built-in
 * category IDs use singular identifiers, such as `character`, `item`, and
 * `location`. Category IDs are used by Component Definitions and must not
 * be derived from the category's display name or filesystem directory name.
 *
 * `name` is the human-readable display name of the category. It may use a
 * plural or otherwise user-friendly form, such as `Characters`.
 *
 * `directoryName` is the filesystem representation of the category and
 * identifies the directory under which Components belonging to the category
 * are stored. It is defined independently from both `id` and `name`.
 *
 * These three values intentionally represent separate concepts:
 *
 *     id:            "character"
 *     name:          "Characters"
 *     directoryName: "Characters"
 *
 * Code must not assume that these values are interchangeable or derive one
 * from another.
 *
 * This interface represents category metadata only. Registry lookup,
 * validation, and filesystem path resolution are handled by their respective
 * domain and infrastructure responsibilities.
 */

export interface ComponentDefinitionCategory {
    id: string;
    name: string;
    directoryName: string;
}