import { describe, expect, it } from "vitest";
import { defaultDocumentSettings } from "./documentSettings";
import {
  createPdfDocumentDefinition,
  createPdfFileName,
} from "./pdfExport";

describe("createPdfDocumentDefinition", () => {
  it("creates a direct PDF definition without browser headers or footers", () => {
    const definition = createPdfDocumentDefinition({
      markdown: "# Report\n\n- Item\n\n| A | B |\n| --- | --- |\n| 1 | 2 |",
      settings: defaultDocumentSettings,
      title: "Report",
    });

    expect(definition.pageSize).toBe("LETTER");
    expect(definition.header).toBeUndefined();
    expect(definition.footer).toBeUndefined();
    expect(JSON.stringify(definition.content)).toContain('"ul"');
    expect(JSON.stringify(definition.content)).toContain('"table"');
  });

  it("uses compact A4 and serif settings", () => {
    const definition = createPdfDocumentDefinition({
      markdown: "Body",
      settings: {
        density: "compact",
        pageSize: "a4",
        typeface: "serif",
      },
      title: "Body",
    });

    expect(definition.pageSize).toBe("A4");
    expect(definition.pageMargins).toEqual([40, 40, 40, 40]);
    expect(definition.defaultStyle).toMatchObject({
      font: "Times",
      fontSize: 10.5,
    });
  });
});

describe("createPdfFileName", () => {
  it("creates a safe PDF filename", () => {
    expect(createPdfFileName("Quarterly Report: Q1")).toBe(
      "quarterly-report-q1.pdf",
    );
    expect(createPdfFileName(" ")).toBe("markdown-document.pdf");
  });
});
