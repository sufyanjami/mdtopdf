# 0002. Direct PDF Export

## Status

Accepted.

## Context

Browser print export opens a print dialog. The app cannot force "Save as PDF"
or suppress browser-generated headers and footers.

## Decision

Generate PDFs directly in the browser with pdfmake.

The preview still renders sanitized HTML. Export parses the Markdown source
into mdast, maps supported Markdown nodes to a pdfmake document definition,
and downloads the generated PDF.

## Consequences

- Export downloads a PDF without a print dialog.
- Browser print headers and footers are not present.
- The export path owns Markdown layout for headings, paragraphs, lists,
  blockquotes, code, and tables.
- Export fidelity depends on the Markdown-to-pdfmake mapper.
