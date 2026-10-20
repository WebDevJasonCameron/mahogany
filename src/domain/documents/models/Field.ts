// src/domain/documents/models/Field.ts

import { FieldType } from "./FieldType";

export interface HeadingField {
    structure: FieldType.Heading;
    structureDetails: {
        level: 1 | 2 | 3 | 4 | 5 | 6;
    };
    data: string;
}

export interface ParagraphField {
    structure: FieldType.Paragraph;
    structureDetails: Record<string, never>;
    data: string;
}

export interface ThematicBreakField {
    structure: FieldType.ThematicBreak;
    structureDetails: Record<string, never>;
    data: null;
}

export interface OpaqueBlockField {
    structure: FieldType.OpaqueBlock;
    structureDetails: Record<string, never>;
    data: string;
}

export interface CodeBlockField {
    structure: FieldType.CodeBlock;
    structureDetails: {
        style: "fenced" | "indented";
        info: string | null;
    };
    data: string;
}

export interface BlockquoteField {
    structure: FieldType.Blockquote;
    structureDetails: Record<string, never>;
    data: Field[];
}

export type Field =
    | HeadingField
    | ParagraphField
    | ThematicBreakField
    | OpaqueBlockField
    | CodeBlockField
    | BlockquoteField;