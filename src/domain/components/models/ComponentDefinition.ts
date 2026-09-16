/**
 * ComponentDefinition
 *
 * Defines the schema for a type of Component within Mahogany.
 *
 * A Component Definition describes what Components of a particular type
 * look like, including the fields they contain and where their Markdown
 * files are stored. For example, a "Character" definition may describe
 * fields such as name, species, profession, or other character attributes.
 *
 * Component Definitions are grouped by category using `categoryId`.
 * The category itself is defined separately by ComponentDefinitionCategory.
 *
 * `directory` identifies where Component instances created from this
 * definition are stored within the user's Mahogany workspace.
 *
 * `copy` and `copyOf` track whether this definition was created as a copy
 * of another Component Definition, allowing definitions to be duplicated
 * and modified without changing the original.
 *
 * This interface represents domain data only. It does not perform
 * validation, normalization, filesystem access, or serialization.
 * Those responsibilities belong to their respective domain/application
 * layers.
 */

import { FieldDefinition } from "@/domain/components/models/FieldDefinition";

export interface ComponentDefinition {
    id: string;
    name: string;
    categoryId: string;
    directory: string;
    copy: boolean;
    copyOf: string;
    fields: FieldDefinition[];
}