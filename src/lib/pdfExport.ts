import type { DocumentSettings } from "./documentSettings";
import { pageSizeLabels } from "./documentSettings";

export type PrintDocumentInput = {
  readonly html: string;
  readonly settings: DocumentSettings;
  readonly title: string;
};

export async function printHtmlDocument(
  input: PrintDocumentInput,
): Promise<void> {
  if (typeof document === "undefined") {
    throw new Error("PDF export requires a browser document.");
  }

  const frame = document.createElement("iframe");
  frame.title = "PDF export";
  frame.setAttribute("aria-hidden", "true");
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "1px";
  frame.style.height = "1px";
  frame.style.border = "0";
  frame.style.opacity = "0";

  document.body.append(frame);

  try {
    const frameDocument = frame.contentDocument;
    const frameWindow = frame.contentWindow;

    if (!frameDocument || !frameWindow) {
      throw new Error("Could not create the print frame.");
    }

    frameDocument.open();
    frameDocument.write(createPrintDocument(input));
    frameDocument.close();

    await waitForPrintableAssets(frameDocument);

    frameWindow.focus();
    frameWindow.print();

    window.setTimeout(() => frame.remove(), 1_000);
  } catch (error) {
    frame.remove();
    throw error;
  }
}

export function createPrintDocument(input: PrintDocumentInput): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(input.title)}</title>
<style>${createDocumentCss(input.settings)}</style>
</head>
<body>
<article class="document-content">${input.html}</article>
</body>
</html>`;
}

export function createDocumentCss(settings: DocumentSettings): string {
  const pageSize = pageSizeLabels[settings.pageSize];
  const margin = settings.density === "compact" ? "0.55in" : "0.7in";
  const bodyFont =
    settings.typeface === "serif"
      ? "Charter, Georgia, 'Times New Roman', serif"
      : "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  return `
@page {
  size: ${pageSize};
  margin: ${margin};
}

* {
  box-sizing: border-box;
}

html {
  color: #18181b;
  font-family: ${bodyFont};
  font-size: ${settings.density === "compact" ? "10.5pt" : "11.5pt"};
  line-height: ${settings.density === "compact" ? "1.48" : "1.62"};
}

body {
  margin: 0;
}

.document-content {
  max-width: 100%;
}

h1,
h2,
h3,
h4 {
  color: #09090b;
  line-height: 1.16;
  page-break-after: avoid;
}

h1 {
  border-bottom: 2px solid #27272a;
  font-size: 2.1em;
  margin: 0 0 0.72em;
  padding-bottom: 0.24em;
}

h2 {
  font-size: 1.36em;
  margin: 1.45em 0 0.48em;
}

h3 {
  font-size: 1.08em;
  margin: 1.25em 0 0.38em;
}

p,
ul,
ol,
blockquote,
pre,
table {
  margin: 0 0 0.85em;
}

ul {
  list-style: disc;
  padding-left: 1.4em;
}

ol {
  list-style: decimal;
  padding-left: 1.4em;
}

ul ul {
  list-style: circle;
  margin-top: 0.18em;
}

ul ul ul {
  list-style: square;
}

li {
  padding-left: 0.12em;
}

li:empty::after {
  content: "\\00a0";
}

.contains-task-list {
  list-style: none;
  padding-left: 0;
}

.task-list-item {
  list-style: none;
  padding-left: 0;
}

a {
  color: #27272a;
  text-decoration: underline;
}

blockquote {
  border-left: 3px solid #a16207;
  color: #3f3f46;
  padding-left: 0.9em;
}

code {
  background: #f4f4f5;
  border: 1px solid #d4d4d8;
  border-radius: 4px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  font-size: 0.88em;
  padding: 0.1em 0.28em;
}

pre {
  background: #f4f4f5;
  border: 1px solid #d4d4d8;
  border-radius: 6px;
  overflow-wrap: break-word;
  padding: 0.85em;
  white-space: pre-wrap;
}

pre code {
  background: transparent;
  border: 0;
  padding: 0;
}

table {
  border-collapse: collapse;
  page-break-inside: avoid;
  width: 100%;
}

th,
td {
  border: 1px solid #d4d4d8;
  padding: 0.42em 0.55em;
  text-align: left;
  vertical-align: top;
}

th {
  background: #e4e4e7;
}

img {
  max-width: 100%;
}

li + li {
  margin-top: 0.18em;
}

input[type='checkbox'] {
  margin-right: 0.45em;
}
`;
}

async function waitForPrintableAssets(frameDocument: Document): Promise<void> {
  const imagePromises = Array.from(frameDocument.images)
    .filter((image) => !image.complete)
    .map(
      (image) =>
        new Promise<void>((resolve) => {
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        }),
    );

  await Promise.all(imagePromises);
  await frameDocument.fonts.ready;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
