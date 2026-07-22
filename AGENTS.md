# mdtopdf

## Purpose

`mdtopdf` converts Markdown files into PDF documents in the browser. It is a
static React application for local, private document conversion.

## Repository Map

- `src/main.tsx`: React entry point.
- `src/App.tsx`: application shell.
- `src/components/ui/`: local shadcn-style primitives.
- `src/features/converter/`: Markdown converter UI.
- `src/lib/`: Markdown rendering, file validation, PDF export utilities.
- `src/styles/`: screen and document styles.
- `docs/decisions/`: architecture decision records.

## Shared Engineering Knowledge

Workspace knowledge base: `../../knowledge`.

- `../../knowledge/README.md`: index.
- `../../knowledge/stack/versions.md`: read before adding or upgrading
  dependencies.
- `../../knowledge/vendor-policy.md`: read before consulting library source.

Project-local code and documentation override shared knowledge.

## Commands

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm build
```

## Git Rules

- Git is read-only for agents: `status`, `log`, `diff`, `show`, `blame`,
  lookups.
- Never run `commit`, `add`, `push`, `pull`, `merge`, `rebase`, `checkout`,
  `switch`, `branch`, `stash`, `reset`, `restore`, `tag`, or config changes.
- Never add co-authors, `Co-Authored-By` trailers, or agent attribution.
  Sufyan Jami is the sole author.

## Writing Style

All authored text and comments follow
`../../knowledge/conventions/writing-style.md`.

## Core Rules

- No backend. No file upload. Conversion runs in the browser.
- Raw Markdown HTML stays disabled unless an ADR approves the change.
- Use strict TypeScript. Do not use `any`.
- Use client-side PDF generation. Do not require a backend or browser print
  dialog.
- Keep document styling separate from application chrome.
- Use local shadcn-style components for shared UI primitives.
- Test production builds, not only the dev server.

## Definition of Done

- Implementation completed.
- Typecheck, tests, and production build pass.
- Documentation updated when behaviour changes.
- No unrelated changes.
