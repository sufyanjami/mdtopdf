import { describe, expect, it } from "vitest";
import { defaultDocumentSettings } from "./documentSettings";
import { createDocumentCss, createPrintDocument } from "./pdfExport";

describe("createPrintDocument", () => {
  it("escapes the title and keeps sanitized body HTML", () => {
    const html = createPrintDocument({
      html: "<h1>Report</h1>",
      settings: defaultDocumentSettings,
      title: "A < B & C",
    });

    expect(html).toContain("<title>A &lt; B &amp; C</title>");
    expect(html).toContain(
      '<article class="document-content"><h1>Report</h1></article>',
    );
  });
});

describe("createDocumentCss", () => {
  it("uses selected page size and typography", () => {
    const css = createDocumentCss({
      density: "compact",
      pageSize: "a4",
      typeface: "serif",
    });

    expect(css).toContain("size: A4");
    expect(css).toContain("font-size: 10.5pt");
    expect(css).toContain("Georgia");
    expect(css).toContain("#27272a");
    expect(css).toContain("list-style: disc");
    expect(css).toContain('content: "\\00a0"');
  });
});
