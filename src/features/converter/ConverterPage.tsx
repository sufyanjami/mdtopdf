import {
  Download,
  FileText,
  Trash2,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import {
  defaultDocumentSettings,
  type DocumentSettings,
} from "../../lib/documentSettings";
import { readMarkdownFile, stripMarkdownExtension } from "../../lib/fileInput";
import { getMarkdownTitle } from "../../lib/markdown";
import { printHtmlDocument } from "../../lib/pdfExport";
import { Button } from "@/components/ui/button";
import { DocumentSettingsPanel } from "./components/DocumentSettingsPanel";
import { DocumentStats } from "./components/DocumentStats";
import { EditorPane } from "./components/EditorPane";
import { FileDropzone } from "./components/FileDropzone";
import { PreviewPane } from "./components/PreviewPane";
import { useRenderedMarkdown } from "./useRenderedMarkdown";

const fallbackDocumentTitle = "markdown-document";

export function ConverterPage() {
  const [source, setSource] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [settings, setSettings] = useState<DocumentSettings>(
    defaultDocumentSettings,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const deferredSource = useDeferredValue(source);
  const rendered = useRenderedMarkdown(deferredSource);

  const documentTitle = useMemo(
    () =>
      getMarkdownTitle(
        source,
        fileName ? stripMarkdownExtension(fileName) : fallbackDocumentTitle,
      ),
    [fileName, source],
  );

  async function handleFileSelected(file: File) {
    setFileError(null);
    setExportError(null);

    try {
      const loadedFile = await readMarkdownFile(file);
      setFileName(loadedFile.name);
      setSource(loadedFile.source);
    } catch (error) {
      setFileError(
        error instanceof Error ? error.message : "The file could not be read.",
      );
    }
  }

  function handleFileInputChange() {
    const file = inputRef.current?.files?.item(0);

    if (file) {
      void handleFileSelected(file);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function handleExport() {
    if (rendered.status !== "ready") {
      return;
    }

    setExportError(null);

    try {
      await printHtmlDocument({
        html: rendered.html,
        settings,
        title: documentTitle,
      });
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : "PDF export failed.",
      );
    }
  }

  function clearDocument() {
    setFileName(null);
    setSource("");
    setFileError(null);
    setExportError(null);
  }

  const canExport =
    rendered.status === "ready" && rendered.html.trim().length > 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-[1800px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground"
            aria-hidden="true"
          >
            <FileText size={22} strokeWidth={1.8} />
          </span>
          <div>
            <h1 className="font-mono text-lg font-semibold leading-none">
              Markdown to PDF in the browser
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            aria-label="Open Markdown file"
            onClick={() => inputRef.current?.click()}
            title="Open Markdown file"
            type="button"
            variant="outline"
          >
            <Upload size={17} />
            Open
          </Button>
          <Button
            aria-label="Clear document"
            disabled={source.length === 0 && fileName === null}
            onClick={clearDocument}
            title="Clear document"
            type="button"
            variant="ghost"
            size="icon"
          >
            <Trash2 size={17} />
          </Button>
          <Button
            disabled={!canExport}
            onClick={() => void handleExport()}
            type="button"
          >
            <Download size={17} />
            Export PDF
          </Button>
        </div>
      </header>

      <input
        accept=".md,.markdown,text/markdown,text/plain"
        className="sr-only"
        onChange={handleFileInputChange}
        ref={inputRef}
        type="file"
      />

      <div className="mx-auto grid max-w-[1800px] gap-3 px-4 pb-4 xl:grid-cols-[300px_minmax(360px,1fr)_minmax(460px,1.08fr)]">
        <aside className="grid content-start gap-3" aria-label="Controls">
          <FileDropzone
            error={fileError}
            fileName={fileName}
            onBrowse={() => inputRef.current?.click()}
            onFileSelected={(file) => void handleFileSelected(file)}
          />
          <DocumentSettingsPanel onChange={setSettings} settings={settings} />
          <DocumentStats source={source} />
          {exportError ? (
            <p className="text-sm text-destructive" role="alert">
              {exportError}
            </p>
          ) : null}
        </aside>

        <EditorPane onChange={setSource} source={source} />

        <PreviewPane rendered={rendered} settings={settings} />
      </div>

      <footer className="mx-auto flex max-w-[1800px] items-center gap-2 px-4 pb-4 font-mono text-xs text-muted-foreground">
        <ShieldCheck size={15} aria-hidden="true" />
        <span>No backend. No upload. Browser print creates the PDF.</span>
        <span className="text-foreground">Built by Sufyan Jami</span>
      </footer>
    </main>
  );
}
