/**
 * ComponentDefinitionCategory
 *
 * Defines a category used to organize related Component Definitions
 * within Mahogany.
 *
 * A category represents a collection of Component Definitions rather
 * than an individual Component type. For example, the "characters"
 * category may contain definitions such as "character", "npc", or
 * other character-related Component Definitions.
 *
 * `id` is the stable machine-facing identifier for the category.
 * Category IDs describe the collection and are therefore plural
 * (for example: "characters", "items", or "locations").
 *
 * `name` is the human-readable name used when presenting the category
 * to the user (for example: "Characters").
 *
 * `directoryName` is the filesystem directory associated with the
 * category (for example: "characters"). It is kept separate from `id`
 * and `name` so Mahogany does not depend on display names or assume
 * that a category's identity and filesystem representation must always
 * be identical.
 *
 * This interface represents category metadata only. The available
 * categories and category lookup behavior are managed separately by
 * Mahogany's Component Definition category registry.
 */

export interface ComponentDefinitionCategory {
    id: string;
    name: string;
    directoryName: string;
}