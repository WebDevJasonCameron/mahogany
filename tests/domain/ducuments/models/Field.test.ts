
import { describe, expect, expectTypeOf, it } from "vitest";
import { FieldType } from "@/domain/documents/models/FieldType";
import type {
    Field,
    HeadingField,
    ParagraphField,
    ListField,
    BlockquoteField,
    TableField,
} from  "@/domain/documents/models/Field";

describe("Field domain model", () => {
    it("supports all eight Field types", () => {
        const fields: Field[] = [
            {
                structure: FieldType.Heading,
                structureDetails: { level: 2 },
                data: "Background",
            },
            {
                structure: FieldType.Paragraph,
                structureDetails: {},
                data: "Lothar was born in Riverdale.",
            },
            {
                structure: FieldType.ThematicBreak,
                structureDetails: {},
                data: null,
            },
            {
                structure: FieldType.OpaqueBlock,
                structureDetails: {},
                data: ":::custom-content",
            },
            {
                structure: FieldType.CodeBlock,
                structureDetails: {
                    style: "fenced",
                    info: "typescript",
                },
                data: "const level = 5;",
            },
            {
                structure: FieldType.Blockquote,
                structureDetails: {},
                data: [],
            },
            {
                structure: FieldType.List,
                structureDetails: {
                    ordered: false,
                    start: null,
                    spread: false,
                },
                data: [],
            },
            {
                structure: FieldType.Table,
                structureDetails: {},
                data: {
                    columns: [],
                    rows: [],
                },
            },
        ];

        expect(fields.map(field => field.structure)).toEqual([
            FieldType.Heading,
            FieldType.Paragraph,
            FieldType.ThematicBreak,
            FieldType.OpaqueBlock,
            FieldType.CodeBlock,
            FieldType.Blockquote,
            FieldType.List,
            FieldType.Table,
        ]);
    });

    it("supports nested blockquotes", () => {
        const quote: BlockquoteField = {
            structure: FieldType.Blockquote,
            structureDetails: {},
            data: [
                {
                    structure: FieldType.Paragraph,
                    structureDetails: {},
                    data: "An ancient warning.",
                },
                {
                    structure: FieldType.Blockquote,
                    structureDetails: {},
                    data: [
                        {
                            structure: FieldType.Paragraph,
                            structureDetails: {},
                            data: "Beware the northern forest.",
                        },
                    ],
                },
            ],
        };

        expect(quote.data[1]?.structure).toBe(FieldType.Blockquote);

        const nested = quote.data[1];
        if (nested?.structure === FieldType.Blockquote) {
            expect(nested.data[0]?.structure).toBe(FieldType.Paragraph);
        }
    });

    it("supports nested lists with task metadata", () => {
        const list: ListField = {
            structure: FieldType.List,
            structureDetails: {
                ordered: false,
                start: null,
                spread: false,
            },
            data: [
                {
                    checked: null,
                    spread: false,
                    fields: [
                        {
                            structure: FieldType.Paragraph,
                            structureDetails: {},
                            data: "Prepare for the expedition.",
                        },
                        {
                            structure: FieldType.List,
                            structureDetails: {
                                ordered: false,
                                start: null,
                                spread: false,
                            },
                            data: [
                                {
                                    checked: true,
                                    spread: false,
                                    fields: [
                                        {
                                            structure: FieldType.Paragraph,
                                            structureDetails: {},
                                            data: "Pack supplies.",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        const nested = list.data[0]?.fields[1];

        expect(nested?.structure).toBe(FieldType.List);

        if (nested?.structure === FieldType.List) {
            expect(nested.data[0]?.checked).toBe(true);
        }
    });

    it("preserves table column and cell ordering", () => {
        const table: TableField = {
            structure: FieldType.Table,
            structureDetails: {},
            data: {
                columns: [
                    {
                        header: { content: "Name" },
                        alignment: "left",
                    },
                    {
                        header: { content: "Class" },
                        alignment: "center",
                    },
                ],
                rows: [
                    {
                        cells: [
                            { content: "Lothar" },
                            { content: "Fighter" },
                        ],
                    },
                    {
                        cells: [
                            { content: "Elara" },
                            { content: "Wizard" },
                        ],
                    },
                ],
            },
        };

        expect(table.data.columns.map(column => column.header.content))
            .toEqual(["Name", "Class"]);

        expect(table.data.rows.map(row => row.cells[0]?.content))
            .toEqual(["Lothar", "Elara"]);
    });

    it("supports discriminated union narrowing", () => {
        const field: Field = {
            structure: FieldType.Heading,
            structureDetails: { level: 3 },
            data: "History",
        };

        if (field.structure === FieldType.Heading) {
            expectTypeOf(field).toEqualTypeOf<HeadingField>();
            expect(field.structureDetails.level).toBe(3);
        }

        expectTypeOf<ParagraphField["data"]>().toEqualTypeOf<string>();
    });
});
