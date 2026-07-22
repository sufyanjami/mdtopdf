import rehypeSanitize, {
  defaultSchema,
  type Options as SanitizeSchema,
} from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export type MarkdownRenderResult = {
  readonly html: string;
  readonly warnings: readonly string[];
};

const taskListClasses = ["contains-task-list", "task-list-item"] as const;

const allowLanguageClass: ["className", RegExp] = [
  "className",
  /^language-[\w-]+$/,
];

const allowTaskListItemClass: ["className", ...string[]] = [
  "className",
  ...taskListClasses,
];

const allowTaskListClass: ["className", string] = [
  "className",
  "contains-task-list",
];

const sanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "input"],
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), allowLanguageClass],
    input: [["type", "checkbox"], "checked", "disabled"],
    li: [
      ...(defaultSchema.attributes?.li ?? []),
      allowTaskListItemClass,
    ],
    ul: [...(defaultSchema.attributes?.ul ?? []), allowTaskListClass],
  },
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm, { singleTilde: false })
  .use(remarkRehype)
  .use(rehypeSanitize, sanitizeSchema)
  .use(rehypeStringify);

export async function renderMarkdownToHtml(
  markdown: string,
): Promise<MarkdownRenderResult> {
  const file = await processor.process(markdown);

  return {
    html: String(file),
    warnings: file.messages.map((message) => String(message)),
  };
}

export function getMarkdownTitle(markdown: string, fallback: string): string {
  const heading = markdown
    .split(/\r?\n/)
    .find((line) => /^#\s+\S/.test(line.trim()));

  if (!heading) {
    return fallback;
  }

  return heading.replace(/^#\s+/, "").trim();
}

export function getDocumentStats(markdown: string): {
  readonly characters: number;
  readonly words: number;
  readonly readingMinutes: number;
} {
  const words = markdown.trim().match(/\b[\p{L}\p{N}'-]+\b/gu)?.length ?? 0;

  return {
    characters: markdown.length,
    words,
    readingMinutes: words === 0 ? 0 : Math.ceil(words / 220),
  };
}
