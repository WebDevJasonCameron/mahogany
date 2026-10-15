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

export type Field =
    | HeadingField
    | ParagraphField;