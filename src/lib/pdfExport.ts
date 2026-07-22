import type {
  BlockContent,
  Code,
  Delete,
  Emphasis,
  Heading,
  InlineCode,
  Link,
  List,
  ListItem,
  Paragraph,
  PhrasingContent,
  Root,
  RootContent,
  Strong,
  Table,
  TableCell,
  TableRow,
  Text,
} from "mdast";
import type {
  Content,
  ContentCanvas,
  ContentStack,
  ContentTable,
  ContentText,
  Margins,
  TDocumentDefinitions,
  TFontContainer,
  TVirtualFileSystem,
} from "pdfmake/interfaces";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type { DocumentSettings } from "./documentSettings";

export type PdfExportInput = {
  readonly markdown: string;
  readonly settings: DocumentSettings;
  readonly title: string;
};

type InlineMarks = {
  readonly bold?: boolean;
  readonly color?: string;
  readonly decoration?: ContentText["decoration"];
  readonly italics?: boolean;
  readonly link?: string;
  readonly style?: ContentText["style"];
};

type PdfMakeApi = {
  readonly addFontContainer: (fontContainer: TFontContainer) => void;
  readonly addVirtualFileSystem: (vfs: TVirtualFileSystem) => void;
  readonly createPdf: (
    documentDefinition: TDocumentDefinitions,
  ) => {
    readonly download: (defaultFileName?: string) => Promise<void>;
  };
};

const markdownAstProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm, { singleTilde: false });

let pdfMakePromise: Promise<PdfMakeApi> | null = null;

export async function downloadMarkdownPdf(
  input: PdfExportInput,
): Promise<void> {
  const pdfMake = await getPdfMake();
  const definition = createPdfDocumentDefinition(input);

  await pdfMake.createPdf(definition).download(createPdfFileName(input.title));
}

export function createPdfDocumentDefinition(
  input: PdfExportInput,
): TDocumentDefinitions {
  const root = markdownAstProcessor.parse(input.markdown) as Root;
  const bodySize = input.settings.density === "compact" ? 10.5 : 11.5;
  const lineHeight = input.settings.density === "compact" ? 1.18 : 1.26;
  const pageMargin = input.settings.density === "compact" ? 40 : 50;
  const bodyFont = input.settings.typeface === "serif" ? "Times" : "Helvetica";

  return {
    content: renderBlocks(root.children),
    defaultStyle: {
      color: "#18181b",
      font: bodyFont,
      fontSize: bodySize,
      lineHeight,
    },
    info: {
      title: input.title,
      creator: "Markdown to PDF in the browser",
      producer: "Markdown to PDF in the browser",
    },
    pageMargins: [pageMargin, pageMargin, pageMargin, pageMargin],
    pageSize: input.settings.pageSize === "a4" ? "A4" : "LETTER",
    styles: {
      blockquote: {
        color: "#3f3f46",
        italics: true,
      },
      codeBlock: {
        background: "#f4f4f5",
        color: "#18181b",
        font: "Courier",
        fontSize: input.settings.density === "compact" ? 9 : 9.75,
      },
      heading1: {
        bold: true,
        color: "#09090b",
        fontSize: input.settings.density === "compact" ? 21 : 24,
      },
      heading2: {
        bold: true,
        color: "#09090b",
        fontSize: input.settings.density === "compact" ? 15 : 17,
      },
      heading3: {
        bold: true,
        color: "#09090b",
        fontSize: input.settings.density === "compact" ? 12.5 : 13.5,
      },
      inlineCode: {
        background: "#f4f4f5",
        color: "#18181b",
        font: "Courier",
        fontSize: input.settings.density === "compact" ? 9 : 9.75,
      },
      link: {
        color: "#27272a",
        decoration: "underline",
      },
      tableHeader: {
        bold: true,
        color: "#09090b",
      },
    },
  };
}

export function createPdfFileName(title: string): string {
  const sanitized = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${sanitized || "markdown-document"}.pdf`;
}

async function getPdfMake(): Promise<PdfMakeApi> {
  pdfMakePromise ??= configurePdfMake();

  return pdfMakePromise;
}

async function configurePdfMake(): Promise<PdfMakeApi> {
  const [
    pdfMakeModule,
    robotoVfsModule,
    courierFontModule,
    helveticaFontModule,
    timesFontModule,
  ] = await Promise.all([
    import("pdfmake/build/pdfmake.js"),
    import("pdfmake/build/vfs_fonts.js"),
    import("pdfmake/build/standard-fonts/Courier.js"),
    import("pdfmake/build/standard-fonts/Helvetica.js"),
    import("pdfmake/build/standard-fonts/Times.js"),
  ]);

  const pdfMake = pdfMakeModule.default;

  pdfMake.addVirtualFileSystem(robotoVfsModule.default);
  pdfMake.addFontContainer(courierFontModule.default);
  pdfMake.addFontContainer(helveticaFontModule.default);
  pdfMake.addFontContainer(timesFontModule.default);

  return pdfMake;
}

function renderBlocks(nodes: readonly RootContent[]): Content[] {
  const content = nodes
    .map((node) => renderRootContent(node))
    .filter((node): node is Content => node !== null);

  return content.length > 0 ? content : [{ text: " " }];
}

function renderRootContent(node: RootContent): Content | null {
  switch (node.type) {
    case "blockquote":
      return renderBlockquote(node.children);
    case "break":
      return { text: "\n" };
    case "code":
      return renderCodeBlock(node);
    case "definition":
    case "footnoteDefinition":
    case "html":
    case "image":
    case "imageReference":
    case "linkReference":
    case "yaml":
      return null;
    case "heading":
      return renderHeading(node);
    case "list":
      return renderList(node);
    case "paragraph":
      return renderParagraph(node);
    case "table":
      return renderTable(node);
    case "thematicBreak":
      return renderThematicBreak();
    default:
      return null;
  }
}

function renderBlockContent(node: BlockContent): Content | null {
  switch (node.type) {
    case "blockquote":
      return renderBlockquote(node.children);
    case "code":
      return renderCodeBlock(node);
    case "heading":
      return renderHeading(node);
    case "html":
      return null;
    case "list":
      return renderList(node);
    case "paragraph":
      return renderParagraph(node);
    case "table":
      return renderTable(node);
    case "thematicBreak":
      return renderThematicBreak();
    default:
      return null;
  }
}

function renderHeading(node: Heading): ContentText {
  const depth = Math.min(node.depth, 3);
  const margin: Margins =
    depth === 1 ? [0, 0, 0, 12] : [0, 8, 0, depth === 2 ? 6 : 4];

  return {
    margin,
    style: `heading${depth}`,
    text: inlineContent(node.children),
  };
}

function renderParagraph(node: Paragraph): ContentText {
  return {
    margin: [0, 0, 0, 8],
    text: inlineContent(node.children),
  };
}

function renderCodeBlock(node: Code): ContentText {
  return {
    margin: [0, 2, 0, 10],
    preserveLeadingSpaces: true,
    style: "codeBlock",
    text: node.value.length > 0 ? node.value : " ",
  };
}

function renderBlockquote(
  children: readonly (BlockContent | import("mdast").DefinitionContent)[],
): ContentStack {
  const stack = children
    .filter((child): child is BlockContent => child.type !== "definition")
    .map((child) => renderBlockContent(child))
    .filter((child): child is Content => child !== null);

  return {
    margin: [8, 0, 0, 10],
    stack: stack.length > 0 ? stack : [{ text: " " }],
    style: "blockquote",
  };
}

function renderList(node: List): Content {
  const items = node.children
    .map((item) => renderListItem(item))
    .filter((item): item is Content => item !== null);
  const margin: Margins = [0, 0, 0, 8];

  if (node.ordered) {
    return {
      margin,
      ol: items.length > 0 ? items : [{ text: " " }],
      start: node.start ?? 1,
    };
  }

  return {
    margin,
    type: "disc",
    ul: items.length > 0 ? items : [{ text: " " }],
  };
}

function renderListItem(node: ListItem): Content | null {
  const blocks = node.children
    .filter((child): child is BlockContent => child.type !== "definition")
    .map((child) => renderBlockContent(child))
    .filter((child): child is Content => child !== null);

  if (blocks.length === 0) {
    return { text: " " };
  }

  if (blocks.length === 1) {
    const block = blocks[0];

    return block ? applyTaskPrefix(block, node.checked) : { text: " " };
  }

  return applyTaskPrefix(
    {
      stack: blocks,
    },
    node.checked,
  );
}

function applyTaskPrefix(
  content: Content,
  checked: boolean | null | undefined,
): Content {
  if (checked === null || checked === undefined) {
    return content;
  }

  const marker = checked ? "[x] " : "[ ] ";

  if (isContentText(content)) {
    return {
      ...content,
      text: [marker, content.text],
    };
  }

  return {
    stack: [{ text: marker }, content],
  };
}

function renderTable(node: Table): ContentTable | null {
  if (node.children.length === 0) {
    return null;
  }

  const body = node.children.map((row, rowIndex) =>
    renderTableRow(row, rowIndex === 0),
  );

  return {
    layout: {
      fillColor: (rowIndex: number) =>
        rowIndex === 0 ? "#e4e4e7" : null,
      hLineColor: () => "#d4d4d8",
      vLineColor: () => "#d4d4d8",
    },
    margin: [0, 2, 0, 10],
    table: {
      body,
      headerRows: 1,
      widths: node.children[0]?.children.map(() => "*") ?? [],
    },
  };
}

function renderTableRow(row: TableRow, isHeader: boolean): Content[] {
  return row.children.map((cell) => renderTableCell(cell, isHeader));
}

function renderTableCell(cell: TableCell, isHeader: boolean): ContentText {
  return {
    margin: [2, 2, 2, 2],
    style: isHeader ? "tableHeader" : undefined,
    text: inlineContent(cell.children),
  };
}

function renderThematicBreak(): ContentCanvas {
  return {
    canvas: [
      {
        lineColor: "#d4d4d8",
        lineWidth: 1,
        type: "line",
        x1: 0,
        x2: 515,
        y1: 0,
        y2: 0,
      },
    ],
    margin: [0, 6, 0, 12],
  };
}

function inlineContent(
  nodes: readonly PhrasingContent[],
  marks: InlineMarks = {},
): Content {
  const runs = nodes.flatMap((node) => renderInline(node, marks));

  if (runs.length === 0) {
    return " ";
  }

  if (runs.length === 1) {
    return runs[0] ?? " ";
  }

  return runs;
}

function renderInline(
  node: PhrasingContent,
  marks: InlineMarks,
): ContentText[] {
  switch (node.type) {
    case "break":
      return [textRun("\n", marks)];
    case "delete":
      return renderDelete(node, marks);
    case "emphasis":
      return renderEmphasis(node, marks);
    case "footnoteReference":
      return [textRun(`[${node.label ?? node.identifier}]`, marks)];
    case "html":
      return [];
    case "image":
      return [textRun(node.alt ?? node.url, marks)];
    case "imageReference":
      return [textRun(node.alt ?? node.label ?? node.identifier, marks)];
    case "inlineCode":
      return renderInlineCode(node, marks);
    case "link":
      return renderLink(node, marks);
    case "linkReference":
      return inlineContentAsRuns(node.children, marks);
    case "strong":
      return renderStrong(node, marks);
    case "text":
      return renderText(node, marks);
    default:
      return [];
  }
}

function renderDelete(node: Delete, marks: InlineMarks): ContentText[] {
  return inlineContentAsRuns(node.children, {
    ...marks,
    decoration: "lineThrough",
  });
}

function renderEmphasis(node: Emphasis, marks: InlineMarks): ContentText[] {
  return inlineContentAsRuns(node.children, {
    ...marks,
    italics: true,
  });
}

function renderStrong(node: Strong, marks: InlineMarks): ContentText[] {
  return inlineContentAsRuns(node.children, {
    ...marks,
    bold: true,
  });
}

function renderInlineCode(
  node: InlineCode,
  marks: InlineMarks,
): ContentText[] {
  return [
    textRun(node.value.length > 0 ? node.value : " ", {
      ...marks,
      style: "inlineCode",
    }),
  ];
}

function renderLink(node: Link, marks: InlineMarks): ContentText[] {
  return inlineContentAsRuns(node.children, {
    ...marks,
    link: node.url,
    style: "link",
  });
}

function renderText(node: Text, marks: InlineMarks): ContentText[] {
  return [textRun(node.value, marks)];
}

function inlineContentAsRuns(
  nodes: readonly PhrasingContent[],
  marks: InlineMarks,
): ContentText[] {
  return nodes.flatMap((child) => renderInline(child, marks));
}

function textRun(value: string, marks: InlineMarks): ContentText {
  return {
    ...marks,
    text: value,
  };
}

function isContentText(content: Content): content is ContentText {
  return (
    typeof content === "object" &&
    content !== null &&
    !Array.isArray(content) &&
    "text" in content
  );
}
