/**
 * FieldType
 *
 * Defines the field types currently supported by Mahogany's
 * Component Definition system.
 *
 * A FieldType determines the kind of data a FieldDefinition accepts and
 * provides a common vocabulary that validation, serialization, and the
 * future Component Definition Builder UI can use when working with fields.
 *
 * Current field types:
 *
 * - `String` represents short, single-value text.
 * - `Text` represents longer-form text content.
 * - `Number` represents numeric values.
 * - `Enum` represents a value selected from a predefined list of options.
 *
 * The enum values use lowercase strings because these values may be stored
 * in Mahogany's Markdown/YAML files and should remain stable independently
 * of the TypeScript enum member names.
 *
 * Additional field types can be introduced as Mahogany's Component schema
 * capabilities grow.
 */
export enum FieldType{
    String = "string",
    Text = "text",
    Number = "number",
    Enum = "enum",
}