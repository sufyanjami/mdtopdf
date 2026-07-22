# mdtopdf

Static Markdown to PDF converter.

## Capabilities

- Load `.md` and `.markdown` files.
- Edit Markdown in the browser.
- Render GitHub Flavored Markdown.
- Sanitize rendered HTML.
- Export directly to PDF.
- Keep file contents local to the browser session.
- Start empty. No bundled default document content.

## Commands

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm build
```

## Architecture

- React owns interaction state.
- Tailwind CSS v4 owns application styling.
- Local shadcn-style components provide reusable UI primitives.
- Unified and remark parse Markdown.
- Rehype sanitizes and serializes HTML.
- The preview uses sanitized HTML only.
- PDF export converts the Markdown AST into a pdfmake document definition.
- The generated PDF has no browser print headers or footers.

## Privacy Model

The app has no backend and no upload path. Markdown files are read with the
browser File API. Export runs in the browser and downloads a PDF file.

Remote images referenced from Markdown may be fetched by the browser.
