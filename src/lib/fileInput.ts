export type LoadedMarkdownFile = {
  readonly name: string;
  readonly size: number;
  readonly source: string;
};

export const maxMarkdownFileBytes = 5 * 1024 * 1024;

const markdownExtensions = [".md", ".markdown"] as const;

export function validateMarkdownFile(file: File): string | null {
  const lowerName = file.name.toLowerCase();
  const hasMarkdownExtension = markdownExtensions.some((extension) =>
    lowerName.endsWith(extension),
  );

  if (!hasMarkdownExtension) {
    return "Choose a .md or .markdown file.";
  }

  if (file.size > maxMarkdownFileBytes) {
    return "Choose a Markdown file smaller than 5 MB.";
  }

  return null;
}

export async function readMarkdownFile(file: File): Promise<LoadedMarkdownFile> {
  const validationError = validateMarkdownFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  return {
    name: file.name,
    size: file.size,
    source: normalizeLineEndings(await file.text()),
  };
}

export function stripMarkdownExtension(fileName: string): string {
  return fileName.replace(/\.(md|markdown)$/i, "");
}

function normalizeLineEndings(value: string): string {
  return value.replace(/\r\n?/g, "\n");
}
