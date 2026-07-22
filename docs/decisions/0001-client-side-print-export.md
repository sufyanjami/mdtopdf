# 0001. Client-Side Print Export

## Status

Accepted.

## Context

The project converts Markdown to PDF without a backend. The browser must own
file reading, rendering, and export.

## Decision

Use Markdown-to-HTML rendering plus browser print-to-PDF.

The app renders Markdown with Unified, remark, and rehype. Raw Markdown HTML is
not enabled. Rehype sanitizes the output before React inserts it into the
preview.

PDF export writes the sanitized document into an isolated iframe with document
CSS. The browser print dialog creates the PDF.

## Consequences

- Export quality follows the browser print engine.
- Page layout uses CSS instead of manual PDF coordinates.
- No server handles user documents.
- Advanced PDF features need browser support.
