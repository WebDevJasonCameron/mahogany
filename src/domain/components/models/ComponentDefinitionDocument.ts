/**
 * ComponentDefinitionDocument
 *
 * Represents a complete Component Definition Markdown document after it
 * has been separated into its structured definition data and Markdown body.
 *
 * `definition` contains the ComponentDefinition represented by the
 * document's YAML front matter. This includes the definition's identity,
 * category, storage information, and field schema.
 *
 * `body` contains the Markdown content that appears after the YAML
 * front matter. Keeping the body separate allows Mahogany to preserve
 * human-readable Markdown content while working with the definition's
 * structured data independently.
 *
 * This interface acts as the document-level representation used when
 * serializing and deserializing Component Definition Markdown files.
 * It does not itself parse, validate, normalize, or write files.
 */

import { ComponentDefinition } from "@/domain/components/models/ComponentDefinition";

export interface ComponentDefinitionDocument {
    definition: ComponentDefinition;
    body: string;
}
